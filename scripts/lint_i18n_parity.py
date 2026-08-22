#!/usr/bin/env python3
"""
lint_i18n_parity.py
Audits I18N_DICT parity between English and Indonesian dictionaries in assets/js/app.js.
Ensures zero missing keys, consistent template placeholders, and starter card parity.
"""

import os
import sys
import subprocess
import json

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
APP_JS = os.path.join(ROOT_DIR, 'assets', 'js', 'app.js')

def extract_i18n_dict():
    if not os.path.exists(APP_JS):
        print(f"[ ERROR ] File not found: {APP_JS}")
        return None

    # Use node to evaluate and export I18N_DICT safely
    node_script = """
    const fs = require('fs');
    const content = fs.readFileSync(process.argv[1], 'utf-8');
    const match = content.match(/const\\s+I18N_DICT\\s*=\\s*({[\\s\\S]*?\\n\\s*};)/);
    if (!match) {
        process.exit(1);
    }
    const dict = eval('(' + match[1].replace(/;$/, '') + ')');
    console.log(JSON.stringify(dict));
    """
    
    res = subprocess.run(['node', '-e', node_script, APP_JS], capture_output=True, text=True)
    if res.returncode != 0:
        print("[ ERROR ] Failed to parse I18N_DICT via Node.js runtime.")
        return None

    try:
        return json.loads(res.stdout)
    except Exception as e:
        print(f"[ ERROR ] JSON parse error: {e}")
        return None

def run_i18n_parity_check():
    print("=== ZYEKH AI I18N PARITY & TRANSLATION LINTER ===")
    dict_data = extract_i18n_dict()
    if not dict_data:
        return False

    en_dict = dict_data.get('en', {})
    id_dict = dict_data.get('id', {})

    if not en_dict or not id_dict:
        print("[ ERROR ] Missing 'en' or 'id' root dictionary.")
        return False

    en_keys = set(en_dict.keys()) - {'starters'}
    id_keys = set(id_dict.keys()) - {'starters'}

    missing_in_id = en_keys - id_keys
    missing_in_en = id_keys - en_keys
    has_error = False

    if missing_in_id:
        print(f"[ FAILED ] Keys missing in Indonesian (id): {sorted(list(missing_in_id))}")
        has_error = True

    if missing_in_en:
        print(f"[ FAILED ] Keys missing in English (en): {sorted(list(missing_in_en))}")
        has_error = True

    if not missing_in_id and not missing_in_en:
        print(f"[ PASSED ] UI Keys Parity: {len(en_keys)} top-level string keys identical across EN and ID.")

    # Check Placeholders ({name}, {model}, {mode}, {err})
    import re
    placeholder_pattern = re.compile(r'\{([a-zA-Z0-9_]+)\}')
    for key in en_keys.intersection(id_keys):
        en_val = str(en_dict[key])
        id_val = str(id_dict[key])
        en_params = set(placeholder_pattern.findall(en_val))
        id_params = set(placeholder_pattern.findall(id_val))
        if en_params != id_params:
            print(f"[ FAILED ] Placeholder mismatch in key '{key}': EN={en_params} vs ID={id_params}")
            has_error = True

    # Check Starters Parity
    en_starters = en_dict.get('starters', {})
    id_starters = id_dict.get('starters', {})
    cat_keys = {'general', 'creative', 'research', 'dev'}

    for cat in cat_keys:
        en_cat_list = en_starters.get(cat, [])
        id_cat_list = id_starters.get(cat, [])
        if len(en_cat_list) != len(id_cat_list):
            print(f"[ FAILED ] Starter count mismatch for category '{cat}': EN={len(en_cat_list)} vs ID={len(id_cat_list)}")
            has_error = True
        else:
            for idx, (e_item, i_item) in enumerate(zip(en_cat_list, id_cat_list)):
                if not e_item.get('label') or not e_item.get('prompt'):
                    print(f"[ FAILED ] Missing label/prompt in EN starter '{cat}' index {idx}")
                    has_error = True
                if not i_item.get('label') or not i_item.get('prompt'):
                    print(f"[ FAILED ] Missing label/prompt in ID starter '{cat}' index {idx}")
                    has_error = True

    if not has_error:
        print(f"[ PASSED ] Starter Prompts Parity: All {len(cat_keys)} categories verified with matching counts and structures.")
        print("=== I18N PARITY GATE PASSED (100% IN SYNC) ===")
        return True
    else:
        print("=== I18N PARITY GATE FAILED ===")
        return False

if __name__ == '__main__':
    ok = run_i18n_parity_check()
    sys.exit(0 if ok else 1)
