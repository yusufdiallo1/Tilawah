#!/usr/bin/env python3
"""
Build verified, bundled (offline-first) sacred-text assets:
  public/data/quran/{1..114}.json     -> [[ar_uthmani, en_saheeh], ...]  (prototype shape)
  public/data/tafsir/muyassar/{n}.json -> { "ayah": text }                (prototype shape)

Sources (per data-sources/SOURCES.md):
  - Qurʾān: quran.com API v4 (text_uthmani + Saheeh International, translation id 20)
  - Tafsīr: spa5k/tafsir_api  ar-tafsir-muyassar (al-Tafsīr al-Muyassar, KFGQPC)

Validates 114 surahs / 6236 āyāt, snapshots al-Fātiḥah and Āyat al-Kursī (2:255).
Idempotent. Run: python3 scripts/build-quran-tafsir.py
"""
import json, os, re, time, urllib.request, sys

ROOT = os.path.join(os.path.dirname(__file__), "..")
QDIR = os.path.join(ROOT, "public", "data", "quran")
TDIR = os.path.join(ROOT, "public", "data", "tafsir", "muyassar")
os.makedirs(QDIR, exist_ok=True)
os.makedirs(TDIR, exist_ok=True)

QURAN_API = "https://api.quran.com/api/v4/verses/by_chapter/{n}?language=en&fields=text_uthmani&translations=20&per_page=300"
TAFSIR_RAW = "https://raw.githubusercontent.com/spa5k/tafsir_api/main/tafsir/ar-tafsir-muyassar/{n}.json"

# canonical counts from the prototype SURAHS[].y
def ayah_counts():
    s = open(os.path.join(ROOT, "public", "tilawah.html"), encoding="utf-8").read()
    i = s.find("SURAHS=["); j = s.find("];", i)
    ys = [int(x) for x in re.findall(r"y:(\d+)", s[i:j])]
    assert len(ys) == 114 and sum(ys) == 6236
    return ys

AYC = ayah_counts()

def get(url, tries=4):
    last = None
    for t in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "tilawah-build"})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            last = e; time.sleep(1.5 * (t + 1))
    raise SystemExit(f"FETCH FAILED {url}: {last}")

def strip_html(t):
    return re.sub(r"<[^>]*>", "", t or "").strip()

def build_quran():
    total = 0
    for n in range(1, 115):
        d = get(QURAN_API.format(n=n))
        verses = d["verses"]
        rows = [[v["text_uthmani"], strip_html((v.get("translations") or [{}])[0].get("text", ""))]
                for v in verses]
        assert len(rows) == AYC[n - 1], f"surah {n}: got {len(rows)} expected {AYC[n-1]}"
        json.dump(rows, open(os.path.join(QDIR, f"{n}.json"), "w"),
                  ensure_ascii=False, separators=(",", ":"))
        total += len(rows)
        if n % 20 == 0 or n == 114:
            print(f"  quran … surah {n}/114 ({total} āyāt)")
    assert total == 6236, f"TOTAL ĀYĀT {total} != 6236"
    print(f"Qurʾān: 114 surahs / {total} āyāt ✓")
    return total

def build_tafsir():
    miss = 0
    for n in range(1, 115):
        arr = get(TAFSIR_RAW.format(n=n))
        m = {}
        for e in arr:
            a = e.get("ayah")
            if a:
                m[str(a)] = (e.get("text") or "").strip()
        # tafsir may have one combined entry for some surahs; keep what we have
        json.dump(m, open(os.path.join(TDIR, f"{n}.json"), "w"),
                  ensure_ascii=False, separators=(",", ":"))
        if len(m) < AYC[n - 1]:
            miss += 1
        if n % 20 == 0 or n == 114:
            print(f"  tafsir … surah {n}/114")
    print(f"Tafsīr (al-Muyassar): 114 files written (surahs with < ayah-count entries: {miss})")

def snapshots():
    f1 = json.load(open(os.path.join(QDIR, "1.json")))
    s2 = json.load(open(os.path.join(QDIR, "2.json")))
    print("\n--- snapshots ---")
    print("1:1 :", f1[0][0])
    print("2:255:", s2[254][0][:70], "…")
    t2 = json.load(open(os.path.join(TDIR, "2.json")))
    print("tafsir 2:255 present:", "255" in t2 and len(t2["255"]) > 0)
    # hard assertions on known text (diacritic-insensitive: strip combining marks)
    def bare(t):
        import unicodedata
        return "".join(c for c in t if unicodedata.category(c) != "Mn")
    assert "بسم" in bare(f1[0][0]) and "لله" in bare(f1[0][0]), "al-Fātiḥah 1:1 mismatch"
    assert len(f1) == 7, "al-Fātiḥah must have 7 āyāt"
    # 2:255 Uthmani uses superscript-alef forms; check stable tokens after stripping marks + tatweel
    ak = bare(s2[254][0]).replace("ـ", "")
    assert ("لا" in ak and "إلا هو" in ak and "ٱلقيوم" in ak and len(s2) == 286), "Āyat al-Kursī (2:255) mismatch"
    print("snapshot assertions ✓")

if __name__ == "__main__":
    print("Building Qurʾān …"); build_quran()
    print("Building Tafsīr …"); build_tafsir()
    snapshots()
    print("\nDone. Assets in public/data/quran and public/data/tafsir/muyassar")
