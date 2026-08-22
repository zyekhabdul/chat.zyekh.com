#!/usr/bin/env python3
"""
snap_viewports.py
Automated Responsive & Visual Overflow Auditor using Playwright.
Audits:
- Mobile Narrow: 348x800
- Mobile Standard: 390x844
- Tablet: 768x1024
- Desktop: 1440x900

Usage:
  python3 scripts/snap_viewports.py [--url http://127.0.0.1:3000] [--save-shots]
"""

import sys
import os
import argparse
import time
from playwright.sync_api import sync_playwright

VIEWPORTS = [
    {"name": "mobile_narrow", "width": 348, "height": 800},
    {"name": "mobile_standard", "width": 390, "height": 844},
    {"name": "tablet", "width": 768, "height": 1024},
    {"name": "desktop", "width": 1440, "height": 900}
]

def audit_url(target_url, save_shots=False, output_dir="/tmp/snapshots"):
    if save_shots:
        os.makedirs(output_dir, exist_ok=True)

    print(f"=== AUDITING RESPONSIVE VIEWPORTS ON: {target_url} ===")
    has_overflow = False

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        for vp in VIEWPORTS:
            context = browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                user_agent="Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36" if vp["width"] < 600 else None
            )
            page = context.new_page()
            
            try:
                page.goto(target_url, wait_until="networkidle", timeout=10000)
                time.sleep(0.5) # Wait for animations
                
                # Check for horizontal overflow & subtitle typography density
                overflow_info = page.evaluate("""() => {
                    const docWidth = document.documentElement.clientWidth;
                    const scrollWidth = document.documentElement.scrollWidth;
                    const hasDocOverflow = scrollWidth > docWidth;
                    
                    const overflowingElements = [];
                    document.querySelectorAll('*').forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.right > docWidth + 1 && el.offsetParent !== null) {
                            overflowingElements.push({
                                tag: el.tagName,
                                class: el.className,
                                id: el.id,
                                right: Math.round(rect.right),
                                docWidth: docWidth
                            });
                        }
                    });

                    let subtitleMetrics = null;
                    const subEl = document.querySelector('.welcome-subtitle');
                    if (subEl) {
                        const style = window.getComputedStyle(subEl);
                        const rect = subEl.getBoundingClientRect();
                        subtitleMetrics = {
                            fontSize: style.fontSize,
                            height: Math.round(rect.height),
                            lineHeight: style.lineHeight,
                            color: style.color
                        };
                    }
                    
                    return {
                        hasDocOverflow,
                        docWidth,
                        scrollWidth,
                        subtitleMetrics,
                        overflowingElements: overflowingElements.slice(0, 5)
                    };
                }""")
                
                status = "[ PASSED ]"
                if overflow_info["hasDocOverflow"] or len(overflow_info["overflowingElements"]) > 0:
                    status = "[ OVERFLOW DETECTED ]"
                    has_overflow = True
                
                sub_info = ""
                if overflow_info.get("subtitleMetrics"):
                    sm = overflow_info["subtitleMetrics"]
                    sub_info = f" | Subtitle: {sm['fontSize']}, H={sm['height']}px"

                print(f"{status} {vp['name']} ({vp['width']}x{vp['height']}): scrollWidth={overflow_info['scrollWidth']}px (docWidth={overflow_info['docWidth']}px){sub_info}")
                
                if overflow_info["overflowingElements"]:
                    for item in overflow_info["overflowingElements"]:
                        print(f"   -> Element: <{item['tag']}> id='{item['id']}' class='{item['class']}' exceeds right bound ({item['right']}px > {item['docWidth']}px)")
                
                if save_shots:
                    shot_path = os.path.join(output_dir, f"{vp['name']}_{vp['width']}.png")
                    page.screenshot(path=shot_path, full_page=False)
                    print(f"   -> Snapshot saved: {shot_path}")
                    
            except Exception as err:
                print(f"[ ERROR ] Failed auditing {vp['name']}: {err}")
                has_overflow = True
            finally:
                context.close()
                
        browser.close()
        
    if has_overflow:
        print("=== AUDIT FAILED: RESPONSIVE OVERFLOW DETECTED ===")
        return False
    else:
        print("=== AUDIT PASSED: ZERO HORIZONTAL OVERFLOW DETECTED ===")
        return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Responsive layout & overflow auditor")
    parser.add_argument("--url", default="https://chat.zyekh.com", help="Target URL to test (default: https://chat.zyekh.com)")
    parser.add_argument("--save-shots", action="store_true", help="Save screenshot PNG files")
    parser.add_argument("--out-dir", default="/tmp/snapshots", help="Directory to save screenshots")
    
    args = parser.parse_args()
    ok = audit_url(args.url, save_shots=args.save_shots, output_dir=args.out_dir)
    sys.exit(0 if ok else 1)
