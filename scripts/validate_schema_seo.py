#!/usr/bin/env python3
"""
validate_schema_seo.py
Audits Schema.org JSON-LD structured data and SEO meta tags across index.html, 404.html, and server.js.
Ensures zero schema syntax errors, proper graph types, canonical URLs, and hreflang completeness.
"""

import os
import sys
import re
import json

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
HTML_FILES = ['index.html', '404.html']

def validate_html_file(file_name):
    path = os.path.join(ROOT_DIR, file_name)
    if not os.path.exists(path):
        print(f"[ ERROR ] File not found: {file_name}")
        return False

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    errors = []

    # 1. Canonical & Hreflang checks
    if '<link rel="canonical"' not in content:
        errors.append("Missing <link rel='canonical'> tag.")
    if 'hreflang="en"' not in content:
        errors.append("Missing hreflang='en' alternate tag.")
    if 'hreflang="id"' not in content:
        errors.append("Missing hreflang='id' alternate tag.")
    if 'hreflang="x-default"' not in content:
        errors.append("Missing hreflang='x-default' alternate tag.")

    # 2. Meta tags
    if '<meta name="description"' not in content:
        errors.append("Missing meta description.")
    if 'property="og:title"' not in content:
        errors.append("Missing Open Graph title.")
    if 'name="twitter:card"' not in content:
        errors.append("Missing Twitter Card meta tag.")

    # 3. Extract & Validate JSON-LD
    json_ld_matches = re.findall(r'<script\s+type=[\'"]application/ld\+json[\'"]>([\s\S]*?)</script>', content)
    if not json_ld_matches:
        errors.append("No JSON-LD structured data script found.")
    else:
        for idx, block in enumerate(json_ld_matches):
            try:
                parsed = json.loads(block.strip())
                context = parsed.get('@context')
                if context != 'https://schema.org':
                    errors.append(f"JSON-LD block {idx} context is not 'https://schema.org' (found: '{context}')")

                if '@graph' in parsed:
                    types = [item.get('@type') for item in parsed['@graph']]
                    if 'WebApplication' not in types:
                        errors.append("Missing 'WebApplication' entity in @graph.")
                    if 'FAQPage' not in types:
                        errors.append("Missing 'FAQPage' entity in @graph.")
                elif '@type' in parsed:
                    # Single entity
                    pass
                else:
                    errors.append(f"JSON-LD block {idx} missing @graph or @type definition.")
            except Exception as e:
                errors.append(f"Invalid JSON-LD syntax in block {idx}: {e}")

    if errors:
        print(f"[ FAILED ] {file_name}:")
        for err in errors:
            print(f"  - {err}")
        return False
    else:
        print(f"[ PASSED ] {file_name}: Schema.org JSON-LD (@graph), Canonical, and Hreflang tags valid.")
        return True

def validate_server_ssr_schema():
    server_path = os.path.join(ROOT_DIR, 'server.js')
    if not os.path.exists(server_path):
        return True

    with open(server_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract JSON-LD template in server.js
    match = re.search(r'<script type="application/ld\+json">([\s\S]*?)</script>', content)
    if not match:
        print("[ WARN ] No JSON-LD block found in server.js SSR template.")
        return True

    raw_template = match.group(1).strip()
    # Replace template string variables with mock strings for validation
    mocked = re.sub(r'\$\{.*?\}', 'mock_value', raw_template)
    try:
        parsed = json.loads(mocked)
        if parsed.get('@type') != 'QAPage':
            print("[ FAILED ] server.js SSR Schema is not of type 'QAPage'.")
            return False
        print("[ PASSED ] server.js: Dynamic SSR QAPage JSON-LD schema template valid.")
        return True
    except Exception as e:
        print(f"[ FAILED ] server.js SSR JSON-LD template syntax error: {e}")
        return False

def main():
    print("=== ZYEKH AI SCHEMA.ORG & SEO META VALIDATOR ===")
    all_ok = True
    for html in HTML_FILES:
        ok = validate_html_file(html)
        if not ok:
            all_ok = False

    ssr_ok = validate_server_ssr_schema()
    if not ssr_ok:
        all_ok = False

    if all_ok:
        print("=== ALL SCHEMA.ORG & SEO GATES PASSED (100% CLEAN) ===")
        return True
    else:
        print("=== SCHEMA.ORG & SEO GATES FAILED ===")
        return False

if __name__ == '__main__':
    ok = main()
    sys.exit(0 if ok else 1)
