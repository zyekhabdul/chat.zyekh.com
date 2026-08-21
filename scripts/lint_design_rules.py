#!/usr/bin/env python3
"""
lint_design_rules.py
Unified design standard & syntax validator:
1. JavaScript Syntax Verification (node -c)
2. Strict Zero-Emoji standard
3. Strict Bracket Syntax Prohibition in UI strings
"""

import os
import sys
import subprocess
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def run_syntax_check():
    print("[ LINT ] Running JavaScript syntax checks...")
    js_files = []
    for root, _, files in os.walk(ROOT_DIR):
        if '.git' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.js'):
                js_files.append(os.path.join(root, file))

    for js_file in js_files:
        res = subprocess.run(['node', '-c', js_file], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"[ SYNTAX ERROR ] {os.path.relpath(js_file, ROOT_DIR)}:\n{res.stderr}")
            return False
    print(f"[ PASSED ] {len(js_files)} JavaScript files verified with 0 syntax errors.")
    return True

def run_emoji_check():
    print("[ LINT ] Enforcing strict zero-emoji standard...")
    found_emoji = False
    checked_count = 0
    for root, _, files in os.walk(ROOT_DIR):
        if '.git' in root or 'node_modules' in root or '__pycache__' in root:
            continue
        for file in files:
            if file.endswith(('.html', '.css', '.js', '.json', '.md', '.py', '.yml', '.yaml', '.sh')):
                checked_count += 1
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        emojis = [c for c in content if ('\U00010000' <= c <= '\U0010ffff') or ('\u2600' <= c <= '\u27bf') or ('\u2300' <= c <= '\u23ff') or ('\u2b50' <= c <= '\u2b55')]
                        if emojis:
                            print(f"[ EMOJI VIOLATION ] {os.path.relpath(path, ROOT_DIR)}: Found emojis {set(emojis)}")
                            found_emoji = True
                except Exception as e:
                    pass
    if found_emoji:
        print("[ FAILED ] Emoji check failed.")
        return False
    print(f"[ PASSED ] 0 Emojis detected across {checked_count} code files.")
    return True

def run_bracket_prefix_check():
    print("[ LINT ] Checking for prohibited developer bracket syntax in UI dictionary...")
    app_js_path = os.path.join(ROOT_DIR, 'assets', 'js', 'app.js')
    if not os.path.exists(app_js_path):
        return True

    with open(app_js_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Search for prohibited bracket patterns in dictionary strings like "[ INFO ]", "[ ? ]"
    violations = []
    forbidden_patterns = [
        r'prefix\s*:\s*[\'"]\[[^\]]+\][\'"]',
        r'toast_[a-z_]+\s*:\s*[\'"]\[\s*[A-Z]+\s*\]',
        r'welcome_badge\s*:\s*[\'"]\[[^\]]+\][\'"]'
    ]

    for pat in forbidden_patterns:
        matches = re.findall(pat, content)
        if matches:
            violations.extend(matches)

    if violations:
        print(f"[ BRACKET VIOLATION ] Found developer bracket strings in app.js: {violations}")
        return False

    print("[ PASSED ] 0 Developer bracket syntax violations in UI strings.")
    return True

def main():
    print("=== ZYEKH AI DESIGN RULES & SYNTAX LINTER ===")
    ok1 = run_syntax_check()
    ok2 = run_emoji_check()
    ok3 = run_bracket_prefix_check()

    if ok1 and ok2 and ok3:
        print("=== ALL DESIGN & SYNTAX GATES PASSED (100% CLEAN) ===")
        sys.exit(0)
    else:
        print("=== LINT FAILED: PLEASE RESOLVE VIOLATIONS ABOVE ===")
        sys.exit(1)

if __name__ == '__main__':
    main()
