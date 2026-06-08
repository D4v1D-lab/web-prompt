#!/usr/bin/env python3
"""
QA Test Runner — Petstore & Autosuficiencia
───────────────────────────────────────────
Run individual test files or all tests at once.
Designed for WSL / PyCharm terminal.
"""

import os
import sys
import subprocess
import glob
from pathlib import Path

TESTS_DIR = Path(__file__).parent.resolve()
QA_USE = "qa-use"

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
BOLD = "\033[1m"
RESET = "\033[0m"

BANNER = f"""
{CYAN}{'=' * 60}
  QA Test Runner
  Petstore Sign In & Autosuficiencia
{'=' * 60}{RESET}
"""


def find_tests():
    yaml_files = sorted(TESTS_DIR.rglob("*.yaml"))
    tests = []
    for f in yaml_files:
        rel = f.relative_to(TESTS_DIR)
        category = str(rel.parent)
        if category == ".":
            category = "autosuficiencia"
        tests.append({"path": f, "rel": rel, "category": category, "name": f.stem})
    return tests


def group_by_category(tests):
    groups = {}
    for t in tests:
        groups.setdefault(t["category"], []).append(t)
    return groups


def print_header(text):
    print(f"\n{YELLOW}{'─' * 50}")
    print(f"  {text}")
    print(f"{'─' * 50}{RESET}")


def run_test(test_path):
    name = test_path.stem
    print(f"\n  {CYAN}▶ Running:{RESET} {BOLD}{name}{RESET}")
    result = subprocess.run(
        [QA_USE, "test", "run", str(test_path)],
        capture_output=True, text=True, timeout=300
    )
    if result.returncode == 0:
        print(f"  {GREEN}✓ PASS{RESET}  {name}")
    else:
        print(f"  {RED}✗ FAIL{RESET}  {name}")
    for line in result.stdout.splitlines():
        print(f"    {line}")
    if result.stderr:
        for line in result.stderr.splitlines():
            print(f"    {RED}{line}{RESET}")
    return result.returncode


def run_all(tests):
    print_header("Running ALL tests")
    passed = failed = 0
    for t in tests:
        rc = run_test(t["path"])
        if rc == 0:
            passed += 1
        else:
            failed += 1
    print(f"\n  {GREEN}{passed} passed{RESET}, {RED}{failed} failed{RESET} "
          f"({passed + failed} total)")


def run_category(category, tests):
    print_header(f"Category: {category}")
    passed = failed = 0
    for t in tests:
        rc = run_test(t["path"])
        if rc == 0:
            passed += 1
        else:
            failed += 1
    print(f"\n  {GREEN}{passed} passed{RESET}, {RED}{failed} failed{RESET} "
          f"({passed + failed} total)")


def menu():
    tests = find_tests()
    groups = group_by_category(tests)
    categories = sorted(groups.keys())

    while True:
        print(BANNER)
        print(f"  {BOLD}Available test categories:{RESET}\n")
        idx = 1
        all_count = len(tests)
        for cat in categories:
            count = len(groups[cat])
            print(f"  {YELLOW}[{idx}]{RESET} {cat:25s} ({count} test{'s' if count > 1 else ''})")
            idx += 1

        print(f"  {YELLOW}[{idx}]{RESET} ALL categories ({all_count} tests)")
        idx += 1
        print(f"  {YELLOW}[{idx}]{RESET} Pick individual tests")
        idx += 1
        print(f"  {YELLOW}[0]{RESET} Exit\n")

        choice = input(f"  {BOLD}Select option:{RESET} ").strip()

        if choice == "0":
            print(f"\n  {CYAN}Bye!{RESET}\n")
            break

        try:
            c = int(choice)
        except ValueError:
            print(f"  {RED}Invalid option.{RESET}")
            continue

        if 1 <= c <= len(categories):
            cat = categories[c - 1]
            run_category(cat, groups[cat])
            input(f"\n  {YELLOW}Press Enter to continue...{RESET}")

        elif c == len(categories) + 1:
            run_all(tests)
            input(f"\n  {YELLOW}Press Enter to continue...{RESET}")

        elif c == len(categories) + 2:
            print(f"\n  {BOLD}Available tests:{RESET}\n")
            for i, t in enumerate(tests, 1):
                print(f"  {YELLOW}[{i}]{RESET} {t['name']:40s} ({t['category']})")
            print(f"  {YELLOW}[0]{RESET} Back\n")
            picks = input(f"  {BOLD}Enter numbers separated by space:{RESET} ").strip()
            if not picks:
                continue
            try:
                indices = [int(x) for x in picks.split()]
            except ValueError:
                print(f"  {RED}Invalid input.{RESET}")
                continue
            passed = failed = 0
            for i in indices:
                if 1 <= i <= len(tests):
                    rc = run_test(tests[i - 1]["path"])
                    if rc == 0:
                        passed += 1
                    else:
                        failed += 1
                else:
                    print(f"  {RED}Invalid index {i}{RESET}")
            print(f"\n  {GREEN}{passed} passed{RESET}, {RED}{failed} failed{RESET}")
            input(f"\n  {YELLOW}Press Enter to continue...{RESET}")

        else:
            print(f"  {RED}Invalid option.{RESET}")


if __name__ == "__main__":
    try:
        menu()
    except KeyboardInterrupt:
        print(f"\n  {CYAN}Interrupted. Bye!{RESET}\n")
        sys.exit(0)
