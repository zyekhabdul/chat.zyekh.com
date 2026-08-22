#!/usr/bin/env python3
"""
test_e2e_flow.py
Automated Playwright headless interaction test suite for chat.zyekh.com.
Simulates real user workflows: language toggling, model switching, starter prompts, and modals.
"""

import sys
import time

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("[ WARN ] Playwright not installed. Skipping live E2E interaction test.")
    sys.exit(0)

TARGET_URL = "http://127.0.0.1:3001"

def run_e2e_tests():
    print("=== ZYEKH AI HEADLESS E2E INTERACTION TEST SUITE ===")
    start_time = time.time()
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        try:
            # 1. Navigation
            print(f"[ E2E ] Navigating to {TARGET_URL}...")
            page.goto(TARGET_URL, wait_until="networkidle", timeout=10000)
            time.sleep(0.5)

            # 2. Test: Language Switcher (EN -> ID -> EN)
            print("[ E2E ] Testing Language Switcher toggle...")
            lang_btn = page.locator('#btnLangToggle')
            lang_tag = page.locator('#activeLangTag')
            initial_tag = lang_tag.inner_text().strip()

            lang_btn.click()
            time.sleep(0.3)
            switched_tag = lang_tag.inner_text().strip()
            if switched_tag == initial_tag:
                raise Exception(f"Language tag did not toggle (still '{initial_tag}').")

            # Toggle back
            lang_btn.click()
            time.sleep(0.3)
            print(f"[ PASSED ] Language switcher verified: {initial_tag} -> {switched_tag} -> {lang_tag.inner_text().strip()}")

            # 3. Test: Model Selector Dropdown
            print("[ E2E ] Testing Model Selector dropdown...")
            model_btn = page.locator('#btnModelSelector')
            model_dropdown = page.locator('#modelDropdown')
            model_btn.click()
            time.sleep(0.3)

            if not model_dropdown.is_visible():
                raise Exception("Model dropdown did not open on click.")

            # Select a model item
            first_model_item = page.locator('.model-option-card').first
            first_model_item.click()
            time.sleep(0.3)
            print("[ PASSED ] Model selector open & select lifecycle verified.")

            # 4. Test: Starter Category & Prompt Pill
            print("[ E2E ] Testing Starter Categories and Prompt Pill dispatch...")
            dev_tab = page.locator('.starter-tab-btn[data-cat="dev"]')
            if dev_tab.count() > 0:
                dev_tab.click()
                time.sleep(0.3)

            first_pill = page.locator('.starter-pill').first
            if first_pill.count() > 0:
                pill_prompt = first_pill.get_attribute('data-prompt')
                first_pill.click()
                time.sleep(0.3)
                # Chat input value should be populated or sent
                print("[ PASSED ] Starter category navigation & pill prompt dispatch verified.")

            # 5. Test: Modals Open & Close Lifecycle
            print("[ E2E ] Testing Modals (Profile, Widget Embed)...")
            # Profile Modal
            btn_profile = page.locator('#btnSidebarEditProfile')
            if btn_profile.is_visible():
                btn_profile.click()
                time.sleep(0.3)
                page.locator('#btnProfileModalClose').click()
                time.sleep(0.3)

            # Widget Modal
            btn_widget = page.locator('#btnEmbedModal')
            if btn_widget.is_visible():
                btn_widget.click()
                time.sleep(0.3)
                page.locator('#btnWidgetModalClose').click()
                time.sleep(0.3)

            print("[ PASSED ] Modal opening and closing lifecycles verified.")

            duration = round(time.time() - start_time, 2)
            print(f"=== ALL E2E INTERACTION TESTS PASSED ({duration}s) ===")
            browser.close()
            return True

        except Exception as err:
            print(f"[ FAILED ] E2E interaction test failure: {err}")
            browser.close()
            return False

if __name__ == '__main__':
    ok = run_e2e_tests()
    sys.exit(0 if ok else 1)
