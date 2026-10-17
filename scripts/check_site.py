#!/usr/bin/env python3
"""Lightweight static-link check; requires only Python's standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1] / 'public'

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for name in ('href', 'src'):
            value = attrs.get(name)
            if value:
                self.links.append(value.strip())

errors = []
for page in sorted(ROOT.glob('*.html')):
    parser = LinkParser()
    parser.feed(page.read_text(encoding='utf-8'))
    for raw in parser.links:
        if not raw or raw.startswith(('#', 'mailto:', 'tel:', 'javascript:', 'data:')):
            continue
        url = urlsplit(raw)
        if url.scheme or url.netloc:
            continue
        clean_path = url.path
        if not clean_path:
            continue
        target = (ROOT / page.parent.relative_to(ROOT) / clean_path).resolve() if not clean_path.startswith('/') else (ROOT / clean_path.lstrip('/')).resolve()
        if not str(target).startswith(str(ROOT.resolve())):
            errors.append(f'{page.relative_to(ROOT)}: path escapes public folder: {raw}')
        elif not target.exists():
            errors.append(f'{page.relative_to(ROOT)}: missing local file: {raw}')

if errors:
    print('\n'.join(errors))
    sys.exit(1)
print(f'Checked {len(list(ROOT.glob("*.html")))} HTML pages; all local href/src paths exist.')
