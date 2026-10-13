#!/usr/bin/env python3
"""Store bounded Ralph progress for an explicitly owned chat/run."""

import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import tempfile
import uuid


def now():
    return datetime.now(timezone.utc).isoformat()


def storage(workspace):
    workspace = workspace.resolve()
    result = workspace / ".codex/ralph/runs"
    if not result.resolve().is_relative_to(workspace):
        raise ValueError("Ralph storage escapes the workspace")
    return result


def run_directory(workspace, run_id):
    if not re.fullmatch(r"[a-f0-9]{32}", run_id):
        raise ValueError("run ID must be the ID returned by start")
    base = storage(workspace)
    directory = base / run_id
    if not directory.resolve().is_relative_to(base.resolve()):
        raise ValueError("run directory escapes Ralph storage")
    return directory


def write_state(directory, value):
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=directory, delete=False) as file:
        json.dump(value, file, indent=2)
        file.write("\n")
        temporary = Path(file.name)
    try:
        os.replace(temporary, directory / "state.json")
    finally:
        temporary.unlink(missing_ok=True)


def start(workspace, owner_id, task, limit):
    if not owner_id.strip() or not task.strip() or limit < 1:
        raise ValueError("owner, task, and a positive iteration limit are required")
    directory = run_directory(workspace, uuid.uuid4().hex)
    directory.mkdir(parents=True)
    value = {"version": 1, "owner_id": owner_id, "run_id": directory.name, "task": task,
             "max_iterations": limit, "iteration": 0, "status": "active",
             "last_evidence": [], "remaining_failure": "", "updated_at": now()}
    write_state(directory, value)
    return value


def show(workspace, owner_id, run_id):
    directory = run_directory(workspace, run_id)
    file = directory / "state.json"
    if not file.resolve().is_relative_to(directory.resolve()):
        raise ValueError("state file escapes this run")
    value = json.loads(file.read_text(encoding="utf-8"))
    if not isinstance(value, dict) or value.get("owner_id") != owner_id or value.get("run_id") != run_id:
        raise ValueError("run is not owned by this chat")
    if value.get("version") != 1 or type(value.get("iteration")) is not int or type(value.get("max_iterations")) is not int or not 0 <= value["iteration"] <= value["max_iterations"] or value["max_iterations"] < 1:
        raise ValueError("invalid run progress")
    if value.get("status") not in ("active", "blocked", "completed", "cancelled", "limit_reached") or not isinstance(value.get("task"), str) or not isinstance(value.get("last_evidence"), list) or not all(isinstance(item, str) for item in value["last_evidence"]):
        raise ValueError("invalid run state")
    return value


@contextmanager
def update_lock(directory):
    lock = directory / ".update-lock"
    try:
        lock.mkdir()
    except FileExistsError:
        raise ValueError("run has an active or interrupted writer; resolve that run's lock before retrying")
    try:
        yield
    finally:
        lock.rmdir()


def change(workspace, owner_id, run_id, action, iteration=None, status="active", evidence=None, failure=""):
    directory = run_directory(workspace, run_id)
    with update_lock(directory):
        value = show(workspace, owner_id, run_id)
        if action == "cancel":
            if value["status"] in ("completed", "cancelled", "limit_reached"):
                return value
            value["status"] = "cancelled"
        elif action == "resume":
            if value["status"] == "active":
                return value
            if value["status"] != "blocked" or value["iteration"] >= value["max_iterations"]:
                raise ValueError("only a blocked run with iterations remaining can resume")
            value["status"] = "active"
        else:
            if value["status"] != "active":
                raise ValueError("only an active run can record an iteration")
            if iteration not in (value["iteration"], value["iteration"] + 1) or iteration > value["max_iterations"]:
                raise ValueError("iteration must be current or next and within the limit")
            if status not in ("active", "completed", "blocked") or (status == "completed" and not evidence):
                raise ValueError("completion requires fresh evidence and a supported status")
            value.update(iteration=iteration, status=status, remaining_failure=failure)
            if evidence is not None:
                value["last_evidence"] = evidence
            if status == "active" and iteration == value["max_iterations"]:
                value["status"] = "limit_reached"
        value["updated_at"] = now()
        write_state(directory, value)
        return value


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--workspace", type=Path, default=Path.cwd())
    sub = parser.add_subparsers(dest="action", required=True)
    for action in ("start", "show", "update", "cancel", "resume"):
        command = sub.add_parser(action)
        command.add_argument("--owner", required=True)
        if action == "start":
            command.add_argument("--task", required=True)
            command.add_argument("--limit", type=int, default=10)
        else:
            command.add_argument("--run-id", required=True)
        if action == "update":
            command.add_argument("--iteration", type=int, required=True)
            command.add_argument("--status", choices=("active", "completed", "blocked"), default="active")
            command.add_argument("--evidence", action="append")
            command.add_argument("--failure", default="")
    args = parser.parse_args()
    try:
        if args.action == "start":
            result = start(args.workspace, args.owner, args.task, args.limit)
        elif args.action == "show":
            result = show(args.workspace, args.owner, args.run_id)
        elif args.action == "update":
            result = change(args.workspace, args.owner, args.run_id, "update", args.iteration, args.status, args.evidence, args.failure)
        else:
            result = change(args.workspace, args.owner, args.run_id, args.action)
        print(json.dumps(result))
    except (OSError, ValueError) as exc:
        parser.exit(1, f"Ralph state error: {exc}\n")


if __name__ == "__main__":
    main()
