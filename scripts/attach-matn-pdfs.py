#!/usr/bin/env python3
"""
Attach each source PDF to the correct matn entry in public/tilawah.html.

The matn PDFs are scanned custom-font docs (no extractable Unicode — confirmed),
so they serve as a *reference scan* per matn, not as body text. We:
  1) add a `pdf:"<file>"` field to the matching MATN[key] entries, and
  2) add a small "PDF" affordance in the matn reader header (reusing existing
     tokens/colors — no new visual language) that opens /source-pdfs/<file>.

Several PDFs are LEVEL BUNDLES covering multiple matns; those are mapped to each
matn in that level. Single-matn PDFs win over the bundle when both exist.

Idempotent. Run: python3 scripts/attach-matn-pdfs.py
"""
import re, os, json

PROTO = os.path.join(os.path.dirname(__file__), "..", "public", "tilawah.html")

# matn key -> PDF filename in public/source-pdfs/
MAP = {
    # L1
    "adhkar":   "Athkaar_Level_1.pdf",
    # L2 bundle
    "usul":     "Student_Texts_Level_2.pdf",
    "nawaqid":  "Student_Texts_Level_2.pdf",
    "qawaid":   "Student_Texts_Level_2.pdf",
    "arbain":   "Student_Texts_Level_2.pdf",
    # L3 bundle (jazari has a dedicated scan -> prefer it)
    "tuhfa":    "0300_Mutoon.pdf",
    "tawhid":   "0300_Mutoon.pdf",
    "shurut":   "0300_Mutoon.pdf",
    "jazari":   "070301Jazariyyah.pdf",
    # L4 bundle
    "bayquni":  "Level_4_Mutoon.pdf",
    "ajrumi":   "Level_4_Mutoon.pdf",
    "ilbiri":   "Level_4_Mutoon.pdf",
    "wasitiyya":"Level_4_Mutoon.pdf",
    # L5 bundle
    "waraqat":  "0500_Mutoon.pdf",
    "rahbiyya": "0500_Mutoon.pdf",
    "unwan":    "0500_Mutoon.pdf",
    "tahawiyya":"0500_Mutoon.pdf",
    # L6 dedicated
    "bulugh":   "Buloogh_Al-Maram_17x24.pdf",
    "alfiyyah": "Alfiyyah_Ibn_Malik.pdf",
    "zad":      "Zad_Al-Mustaqni_PDF.pdf",
    # Ḥadīth tab
    "umdah":    "Al-Ahkam_Texts.pdf",
    # qudsi: no PDF in the source set -> intentionally omitted (render no button)
}

def main():
    pubpdf = os.path.join(os.path.dirname(PROTO), "source-pdfs")
    for f in set(MAP.values()):
        assert os.path.exists(os.path.join(pubpdf, f)), f"missing public/source-pdfs/{f}"

    s = open(PROTO, encoding="utf-8").read()

    # 1) inject pdf: into each MATN[key] object. The store is MATN={ key:{t:..,by:..,body:..}, ...}.
    # We add `,pdf:"file"` right after the opening brace of each key's object, once.
    added = 0
    for key, pdf in MAP.items():
        # match  <key>:{   (key may be bareword or quoted)
        pat = re.compile(r'(["\']?' + re.escape(key) + r'["\']?\s*:\s*\{)')
        def repl(m):
            nonlocal added
            added += 1
            return m.group(1) + f'pdf:"{pdf}",'
        # only the matn store; guard: require the object to contain body: nearby is hard,
        # so we replace the first occurrence that is a matn entry (keys are unique enough)
        s_new, n = pat.subn(repl, s, count=1)
        if n:
            s = s_new
    # remove any double pdf: if re-run (idempotent): collapse pdf:"x",pdf:"y" -> first
    s = re.sub(r'(pdf:"[^"]+",)\s*pdf:"[^"]+",', r'\1', s)

    # 2) add the affordance in openMatn: after it sets matnTitle, set a global + show a button.
    # Insert a tiny block that wires a #matnPdfBtn anchor. We add the button element next to
    # matnTitle and a one-liner in openMatn. Reuse existing color tokens only.
    if 'id="matnPdfBtn"' not in s:
        s = s.replace(
            'id="matnTitle">الأُصُول الثَّلَاثَة</div>',
            'id="matnTitle">الأُصُول الثَّلَاثَة</div>'
            '<a id="matnPdfBtn" href="#" target="_blank" rel="noopener" style="display:none;'
            'margin:-8px auto 14px;width:max-content;font-family:var(--arui);font-size:11px;'
            'font-weight:600;color:var(--gold);text-decoration:none;border:1px solid var(--line);'
            'border-radius:999px;padding:4px 12px;background:var(--fill)" '
            'data-en="View PDF" data-ar="عرض الـ PDF" data-fr="Voir le PDF" data-ur="PDF دیکھیں">PDF</a>',
            1,
        )
    # in openMatn, after curMatn is set, toggle the button
    hook = 'function openMatn(k){curMatn=k||"usul";var m=MATN[curMatn]||MATN.usul;'
    inject = hook + (
        'var _pb=document.getElementById("matnPdfBtn");'
        'if(_pb){if(m&&m.pdf){_pb.href="/source-pdfs/"+m.pdf;_pb.style.display="block";}else{_pb.style.display="none";}}'
    )
    if 'getElementById("matnPdfBtn")' not in s.split('function openMatn')[1][:400]:
        s = s.replace(hook, inject, 1)

    open(PROTO, "w", encoding="utf-8").write(s)
    print(f"pdf fields injected: {added}/{len(MAP)} matns")
    print("matnPdfBtn affordance:", "present" if 'id="matnPdfBtn"' in s else "MISSING")

if __name__ == "__main__":
    main()
