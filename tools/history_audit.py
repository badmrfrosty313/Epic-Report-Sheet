"""Audit every reachable Git blob for accidental public-disclosure candidates.

Scans *tracked history*, not only the latest checkout. This is heuristic, not
a substitute for visual/manual PHI review or a dedicated secret scanner.
Never prints matched sensitive values.
"""
from __future__ import annotations

from collections import defaultdict
from pathlib import PurePosixPath
import re
import subprocess
import sys

BAD_PATH = re.compile(
    r"(?:^|/)(?:\.env(?:\.|$)|id_rsa(?:\.|$)|credentials|secrets?|private|"
    r"patient[_-]?exports?|.*\.(?:sqlite3?|db|pem|p12|pfx|key|pcap|zip|xlsx?|csv)$)",
    re.IGNORECASE,
)
EXCEPTIONS = {
    "Support Sheets/Report Sheet V.2 ICU - Prototype.pdf",
}
# Intentionally only high-confidence patterns. No match does NOT certify that
# a free-text clinical note or a made-up patient's name is real or fictional.
PATTERNS = {
    "email address": re.compile(rb"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b"),
    "GitHub token": re.compile(rb"(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})"),
    "AWS access key": re.compile(rb"AKIA[0-9A-Z]{16}"),
    "private key block": re.compile(rb"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "credential assignment": re.compile(
        rb"(?i)(?:api[_-]?key|client[_-]?secret|password|secret[_-]?key)"
        rb"\s*[:=]\s*[\x22\x27]?[A-Za-z0-9_.\-/]{12,}"
    ),
    "SSN pattern": re.compile(rb"(?<!\d)[0-9]{3}-[0-9]{2}-[0-9]{4}(?!\d)"),
}

def git(*args: str, stdin: bytes | None = None) -> bytes:
    result = subprocess.run(
        ["git", *args], input=stdin, stdout=subprocess.PIPE,
        stderr=subprocess.PIPE, check=True,
    )
    return result.stdout

def main() -> int:
    all_objs = git("rev-list", "--objects", "--all").decode("utf-8", "replace").splitlines()
    seen: set[str] = set()
    path_to_blobs: dict[str, set[str]] = defaultdict(set)
    hits: list[tuple[str, str, str]] = []
    total_blobs = 0
    for line in all_objs:
        sha, _, filename = line.partition(" ")
        if not filename:
            continue
        path_to_blobs[filename].add(sha)
        if sha in seen:
            continue
        seen.add(sha)
        if git("cat-file", "-t", sha).strip() != b"blob":
            continue
        total_blobs += 1
        data = git("cat-file", "blob", sha)
        if b"\x00" in data[:4096] or data.startswith(b"%PDF-"):
            continue
        for label, pattern in PATTERNS.items():
            if pattern.search(data):
                hits.append((label, filename, sha[:12]))

    suspicious = [p for p in path_to_blobs
                  if BAD_PATH.search(p) and p not in EXCEPTIONS]
    print(f"Reviewed {total_blobs} distinct reachable historical blobs "
          f"and {len(path_to_blobs)} historical paths.")
    print(f"Potentially sensitive filenames: {len(suspicious)}")
    for path in suspicious:
        print(f"  CHECK PATH: {path}")
    print(f"Sensitive-pattern matches: {len(hits)}")
    for label, filename, sha in hits:
        print(f"  CHECK {label}: {filename} (blob {sha})")
    if suspicious or hits:
        print("REVIEW REQUIRED: check the reported content before publication.")
        return 1
    print("PASS: no high-confidence sensitive patterns or unexpected file types found.")
    print("LIMITATION: heuristic scanning cannot certify the absence of PHI, "
          "confidential text, copyright restrictions, or historical data "
          "hidden in non-text objects.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
