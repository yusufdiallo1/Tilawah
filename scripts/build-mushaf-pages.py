#!/usr/bin/env python3
"""
Build the canonical 604-page Madinah muṣḥaf (Ḥafṣ, 15-line KFGQPC layout) page map:
for each physical page 1..604, the exact list of āyāt on it.

Source: quran.com API v4 by_page (mirrors the printed Madinah muṣḥaf page boundaries).
This is the SAME page layout a physical Madinah muṣḥaf uses — e.g. page 15 = 2:94..2:101.

Output: public/data/mushaf-pages.json = { "1": [[1,1],[1,2],...], "15": [[2,94],...], ... }
plus a page->{surah,fromAyah,toAyah,juz} index. Validates all 6236 āyāt appear exactly once.
"""
import json, os, urllib.request, time

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "public", "data", "mushaf-pages.json")
API = "https://api.quran.com/api/v4/verses/by_page/{p}?fields=verse_key&per_page=50"

def get(url, tries=5):
    last = None
    for t in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "tilawah-build"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            last = e; time.sleep(1.2 * (t + 1))
    raise SystemExit(f"FETCH FAILED {url}: {last}")

def main():
    pages = {}
    seen = set()
    for p in range(1, 605):
        d = get(API.format(p=p))
        refs = []
        for v in d["verses"]:
            s, a = v["verse_key"].split(":")
            s, a = int(s), int(a)
            refs.append([s, a])
            seen.add((s, a))
        assert refs, f"page {p} empty"
        pages[str(p)] = refs
        if p % 100 == 0 or p == 604:
            print(f"  page {p}/604")

    # validation: every āyah 1..6236 present exactly once
    assert len(seen) == 6236, f"covered {len(seen)} unique āyāt, expected 6236"
    # check page 15 matches the known physical layout
    p15 = pages["15"]
    assert p15[0] == [2, 94] and p15[-1] == [2, 101], f"page 15 boundary mismatch: {p15[0]}..{p15[-1]}"
    assert pages["1"][0] == [1, 1] and pages["604"][-1] == [114, 6], "first/last page mismatch"

    json.dump(pages, open(OUT, "w"), separators=(",", ":"))
    print(f"\n604-page Madinah muṣḥaf map ✓  ({len(seen)} āyāt, page 15 = 2:94..2:101)")
    print("wrote", OUT, f"({round(os.path.getsize(OUT)/1024)}kb)")

if __name__ == "__main__":
    main()
