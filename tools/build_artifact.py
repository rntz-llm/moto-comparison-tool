#!/usr/bin/env python3
"""Inline css/js into one self-contained HTML fragment (dist/next-bike-shortlist.html)
for publishing as a claude.ai Artifact. The repo's index.html stays the source."""
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
html = (root / 'index.html').read_text()

def inline_css(m):
    return '<style>\n' + (root / m.group(1)).read_text() + '\n</style>'

def inline_js(m):
    src = (root / m.group(1)).read_text().replace('</script', '<\\/script')
    return '<script>\n' + src + '\n</script>'

html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', inline_css, html)
html = re.sub(r'<script src="(js/[^"]+)"></script>', inline_js, html)
# The artifact host supplies the document skeleton.
for pat in [r'<!doctype html>\s*', r'<html[^>]*>\s*', r'</html>\s*', r'<head>\s*', r'</head>\s*',
            r'<body>\s*', r'</body>\s*', r'<meta charset="utf-8">\s*', r'<meta name="viewport"[^>]*>\s*']:
    html = re.sub(pat, '', html, flags=re.I)
out = root / 'dist' / 'next-bike-shortlist.html'
out.parent.mkdir(exist_ok=True)
out.write_text(html)
print(out, len(html))
