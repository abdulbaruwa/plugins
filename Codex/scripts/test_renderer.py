import subprocess
from pathlib import Path
import unittest


class RendererTests(unittest.TestCase):
    def test_both_packaged_renderers(self):
        subprocess.run(['node', str(Path(__file__).with_suffix('.cjs'))], check=True, capture_output=True, text=True)
