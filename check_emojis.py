import os
import sys

def check_emojis(directory):
    found_any = False
    for root, _, files in os.walk(directory):
        if '.git' in root or 'node_modules' in root or '__pycache__' in root:
            continue
        for file in files:
            if file.endswith(('.html', '.css', '.js', '.json', '.md', '.py', '.yml', '.yaml')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        emojis = [c for c in content if ('\U00010000' <= c <= '\U0010ffff') or ('\u2600' <= c <= '\u27bf') or ('\u2300' <= c <= '\u23ff') or ('\u2b50' <= c <= '\u2b55')]
                        if emojis:
                            print(f"[ EMOJI VIOLATION ] {path}: Found emojis {set(emojis)}")
                            found_any = True
                except Exception:
                    pass
    if found_any:
        print("[ FAILED ] Emojis detected in codebase.")
        sys.exit(1)
    else:
        print("[ PASSED ] 0 Emojis detected. Strict no-emoji standard enforced.")
        sys.exit(0)

if __name__ == '__main__':
    check_emojis('.')
