#!/usr/bin/env python3
"""
Extract the FULL Mutashābihāt (similar-āyāt) index from the printed PDF set
(The Tilāwah Files/Quran/Mutashabihat/Juz 1..30.pdf) into the two data shapes the
prototype (public/tilawah.html) already consumes:

  window.MUTASH = { absAyah: [absAyah, ...] }   # highlight index (reciprocal)
  MUTA          = { surah:   [{p, n}, ...] }     # compare-sheet content

The PDFs are clean Arabic Unicode with a strict structure per entry:

    Surah X Ayah Y
    <source āyah text>
    (X: Y)
    <similar āyah 1 text>
    (s1: a1)
    <similar āyah 2 text>
    (s2: a2)
    ...

The source ref is the header (X,Y). The matches are every other (s:a) tag in the
block. abs numbers use the SAME surah ayah-count table the prototype ships in
SURAHS[].y, so refToAbs lines up exactly at runtime.

Outputs: writes /tmp/mutash.json and /tmp/muta.json (the JS-ready objects) plus a
summary. A second script splices them into public/tilawah.html.
"""
import fitz, re, json, sys, os, unicodedata

PROTO = os.path.join(os.path.dirname(__file__), "..", "public", "tilawah.html")
MUT_DIR = "/Users/yusufdiallo/Desktop/The Tilāwah Files/Quran/Mutashabihat"

# --- canonical ayah-count table, pulled from the prototype's SURAHS[].y ---
def load_ayah_counts():
    s = open(PROTO, encoding="utf-8").read()
    i = s.find("SURAHS=[")
    j = s.find("];", i)
    block = s[i:j + 1]
    ys = [int(x) for x in re.findall(r"y:(\d+)", block)]
    assert len(ys) == 114, f"expected 114 surah counts, got {len(ys)}"
    assert sum(ys) == 6236, f"expected 6236 ayat, got {sum(ys)}"
    return ys

AYC = load_ayah_counts()
# prefix offsets: OFF[s] = abs number of (s,1) - 1  (1-indexed surah)
OFF = [0] * 115
acc = 0
for s in range(1, 115):
    OFF[s] = acc
    acc += AYC[s - 1]

def ref_to_abs(s, a):
    if not (1 <= s <= 114):
        return None
    if not (1 <= a <= AYC[s - 1]):
        return None
    return OFF[s] + a

# --- Arabic cleanup for the displayed compare phrase (display only) ---
# The RTL extractor (a) injects a space immediately BEFORE a combining mark that
# belongs to the preceding letter, and (b) sometimes emits a leading mark. We strip
# the spurious space-before-mark, drop leading marks, and collapse whitespace.
def is_mark(ch):
    return unicodedata.category(ch) == "Mn"

def clean_ar(t):
    t = t.replace("‏", "").replace("‎", "").replace("‏", "").replace("‎", "")
    t = re.sub(r"\s+", " ", t).strip()
    out = []
    for ch in t:
        if ch == " " and out and False:
            pass
        # drop a space that directly precedes a combining mark
        if is_mark(ch) and out and out[-1] == " ":
            out.pop()
        # drop a combining mark with no preceding base letter (leading mark)
        if is_mark(ch) and (not out or out[-1] == " "):
            continue
        out.append(ch)
    return "".join(out).strip()

# Headers are "Surah X Ayah Y" or ranged "Surah X Ayat A - B"; we key on the FIRST āyah.
HEADER = re.compile(r"Surah\s+(\d+)\s+Aya[ht]\s+(\d+)\s*(?:-\s*\d+)?")
# Ref tags: "(s: a)" or ranged "(s: a - b)" — take the first āyah.
REF = re.compile(r"\((\d+)\s*:\s*(\d+)\s*(?:-\s*\d+)?\)")

def parse_juz(path):
    """Yield (src_ref, src_phrase, [match_refs]) per entry block."""
    d = fitz.open(path)
    full = "".join(d[i].get_text("text") for i in range(d.page_count))
    d.close()
    # split on headers, keeping the (s,a) of each header
    parts = []
    last = None
    for m in HEADER.finditer(full):
        if last is not None:
            parts.append((last[0], last[1], full[last[2]:m.start()]))
        last = (int(m.group(1)), int(m.group(2)), m.end())
    if last is not None:
        parts.append((last[0], last[1], full[last[2]:]))

    for s, a, body in parts:
        refs = REF.findall(body)
        refs = [(int(x), int(y)) for x, y in refs]
        # source phrase = text before the FIRST ref tag in the body
        first = REF.search(body)
        phrase = clean_ar(body[:first.start()]) if first else ""
        # matches = all ref tags except one occurrence equal to the source (X,Y)
        matches = []
        src_seen = False
        for r in refs:
            if r == (s, a) and not src_seen:
                src_seen = True
                continue
            matches.append(r)
        yield (s, a), phrase, matches

def main():
    edges = {}          # abs -> set(abs)   (reciprocal)
    muta = {}           # surah -> list of {p, n}
    entries = 0
    dropped = 0
    juz_files = sorted(
        [f for f in os.listdir(MUT_DIR) if re.match(r"Juz \d+\.pdf$", f)],
        key=lambda f: int(re.search(r"\d+", f).group()),
    )
    assert len(juz_files) == 30, f"expected 30 juz PDFs, found {len(juz_files)}"

    for jf in juz_files:
        for (s, a), phrase, matches in parse_juz(os.path.join(MUT_DIR, jf)):
            src_abs = ref_to_abs(s, a)
            if src_abs is None:
                dropped += 1
                continue
            valid_match_abs = []
            note_refs = []
            for (ms, ma) in matches:
                mab = ref_to_abs(ms, ma)
                if mab is None:
                    dropped += 1
                    continue
                if mab == src_abs:
                    continue
                valid_match_abs.append(mab)
                note_refs.append(f"{ms}:{ma}")
            if not valid_match_abs:
                continue
            entries += 1
            # reciprocal edges
            edges.setdefault(src_abs, set()).update(valid_match_abs)
            for mab in valid_match_abs:
                edges.setdefault(mab, set()).add(src_abs)
            # compare-sheet entry (de-dupe note refs, keep order)
            seen = set(); ordered = []
            for r in note_refs:
                if r not in seen:
                    seen.add(r); ordered.append(r)
            muta.setdefault(s, []).append({
                "p": phrase,
                "n": "Similar: " + " · ".join(ordered),
            })

    # finalize MUTASH: sorted unique lists, all refs in 1..6236
    mutash = {}
    bad = 0
    for ab, st in edges.items():
        lst = sorted(x for x in st if 1 <= x <= 6236 and x != ab)
        if not (1 <= ab <= 6236):
            bad += 1; continue
        if lst:
            mutash[ab] = lst

    # validation
    all_refs = set(mutash) | {x for v in mutash.values() for x in v}
    assert all(1 <= x <= 6236 for x in all_refs), "out-of-range abs ref!"
    # reciprocity check
    asym = 0
    for ab, lst in mutash.items():
        for x in lst:
            if ab not in mutash.get(x, []):
                asym += 1
    json.dump({str(k): v for k, v in mutash.items()},
              open("/tmp/mutash.json", "w"), ensure_ascii=False)
    json.dump({str(k): v for k, v in muta.items()},
              open("/tmp/muta.json", "w"), ensure_ascii=False)

    print(f"juz parsed:        {len(juz_files)}")
    print(f"entries:           {entries}")
    print(f"dropped bad refs:  {dropped}")
    print(f"MUTASH keys:       {len(mutash)}")
    print(f"total edges:       {sum(len(v) for v in mutash.values())}")
    print(f"MUTA surahs:       {len(muta)}")
    print(f"reciprocity gaps:  {asym}  (should be 0)")
    print(f"out-of-range:      {bad}")
    print("wrote /tmp/mutash.json /tmp/muta.json")

if __name__ == "__main__":
    main()
