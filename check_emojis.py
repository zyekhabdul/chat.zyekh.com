import os
import sys

# Single Source of Truth delegation to scripts/lint_design_rules.py
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'scripts'))
from lint_design_rules import run_emoji_check

if __name__ == '__main__':
    ok = run_emoji_check()
    sys.exit(0 if ok else 1)

