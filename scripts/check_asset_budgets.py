#!/usr/bin/env python3
"""
check_asset_budgets.py
Enforces strict file size caps on production assets (Ponytail / YAGNI Principle).
Prevents bloatware and guarantees sub-200ms First Contentful Paint.
"""

import os
import sys

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

BUDGETS = {
    'assets/css/app.css': 50 * 1024,             # 50 KB Cap
    'assets/js/app.js': 90 * 1024,               # 90 KB Cap
    'chat-widget.js': 25 * 1024,                 # 25 KB Cap
    'assets/js/chat-widget.min.js': 20 * 1024,   # 20 KB Cap
    'index.html': 35 * 1024,                     # 35 KB Cap
    '404.html': 35 * 1024,                       # 35 KB Cap
    'sw.js': 6 * 1024,                           # 6 KB Cap
    'offline.html': 10 * 1024                    # 10 KB Cap
}

def format_size(bytes_val):
    if bytes_val >= 1024:
        return f"{bytes_val / 1024:.2f} KB ({bytes_val:,} B)"
    return f"{bytes_val} B"

def run_budget_check():
    print("=== ZYEKH AI ASSET BUDGET & ZERO-BLOAT WATCHER ===")
    has_violation = False

    print(f"{'Target Asset':<30} | {'Current Size':<20} | {'Max Budget':<15} | {'Usage':<8} | {'Status'}")
    print("-" * 90)

    for rel_path, max_bytes in BUDGETS.items():
        full_path = os.path.join(ROOT_DIR, rel_path)
        if not os.path.exists(full_path):
            print(f"{rel_path:<30} | {'MISSING FILE':<20} | {format_size(max_bytes):<15} | {'-':<8} | [ ERROR ]")
            has_violation = True
            continue

        size = os.path.getsize(full_path)
        pct = (size / max_bytes) * 100
        status = "[ PASSED ]" if size <= max_bytes else "[ OVER BUDGET ]"
        if size > max_bytes:
            has_violation = True

        print(f"{rel_path:<30} | {format_size(size):<20} | {format_size(max_bytes):<15} | {pct:>6.1f}% | {status}")

    print("-" * 90)
    if has_violation:
        print("=== ASSET BUDGET CHECK FAILED: ASSETS EXCEED HARD CAP ===")
        return False
    else:
        print("=== ALL ASSETS WITHIN STRICT PERFORMANCE BUDGET (100% CLEAN) ===")
        return True

if __name__ == '__main__':
    ok = run_budget_check()
    sys.exit(0 if ok else 1)
