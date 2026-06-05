#!/usr/bin/env python3
"""
Splice the validated MUTASH (highlight index) and MUTA (compare sheet) data into
public/tilawah.html, replacing ONLY the two stub data objects. No markup, CSS, or
render-function changes — design untouched. Idempotent: re-running replaces again.
"""
import json, os, re

PROTO = os.path.join(os.path.dirname(__file__), "..", "public", "tilawah.html")
mutash = json.load(open("/tmp/mutash.json"))
muta = json.load(open("/tmp/muta.json"))

def obj_bounds(s, decl):
    i = s.find(decl)
    if i < 0:
        raise SystemExit(f"declaration {decl!r} not found")
    j = s.find("{", i)
    depth = 0; k = j
    while k < len(s):
        if s[k] == "{": depth += 1
        elif s[k] == "}":
            depth -= 1
            if depth == 0: break
        k += 1
    end = k + 1
    while end < len(s) and s[end] in " \t": end += 1
    if end < len(s) and s[end] == ";": end += 1
    return i, end

# JS object literals. MUTASH keys are numeric strings -> quoted is fine.
# MUTA uses bareword numeric keys with {p,n}; emit as JSON (quoted keys ok in JS).
mutash_js = "window.MUTASH=" + json.dumps(mutash, ensure_ascii=False, separators=(",", ":")) + ";"
muta_js = "MUTA=" + json.dumps(muta, ensure_ascii=False, separators=(",", ":")) + ";"

s = open(PROTO, encoding="utf-8").read()

# Replace MUTASH first (later in file), then MUTA — recompute bounds each time.
ws, we = obj_bounds(s, "window.MUTASH=")
s = s[:ws] + mutash_js + s[we:]
ms, me = obj_bounds(s, "MUTA=")
s = s[:ms] + muta_js + s[me:]

open(PROTO, "w", encoding="utf-8").write(s)
print(f"spliced: MUTASH keys={len(mutash)}  MUTA surahs={len(muta)}")
print(f"new file size: {round(os.path.getsize(PROTO)/1e6,2)} MB")
