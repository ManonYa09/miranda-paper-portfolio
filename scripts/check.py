#!/usr/bin/env python3
"""Check route integrity, local presentation dependencies and tracking removal."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,json,sys
ROOT=Path(__file__).resolve().parents[1]; DIST=ROOT/'dist'; errors=[]; routes=[]
class Audit(HTMLParser):
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  for key in ('src','poster','data-image','data-gl-image'):
   value=d.get(key,'')
   if value.startswith('http'): errors.append(f'{current}: remote {key}: {value}')
   elif value.startswith('/assets/') and not (DIST/value.split('?')[0].lstrip('/')).is_file(): errors.append(f'{current}: missing {value}')
  if tag=='a':
   href=d.get('href',''); parsed=urlsplit(href)
   if not parsed.netloc and parsed.path.startswith('/'):
    p=DIST/parsed.path.strip('/')
    if not p.is_file() and not (p/'index.html').is_file():errors.append(f'{current}: broken route {href}')
for current in DIST.rglob('*.html'):
 if current.name=='404.html':continue
 routes.append(str(current.relative_to(DIST)));text=current.read_text();Audit().feed(text)
 if re.search(r'googletagmanager|gtag\(|UA-108305037|google-analytics',text):errors.append(f'{current}: tracker present')
for current in (DIST/'assets').glob('*'):
 if current.suffix not in ['.css','.js','.mjs']:continue
 text=current.read_text()
 for value in re.findall(r'(?<![\w])(/assets/[^\s\)\'";]+)',text):
  value=value.rstrip('\\')
  if not (DIST/value.lstrip('/')).is_file():errors.append(f'{current.name}: missing dependency {value}')
assert not (DIST/'assets/873a3f1383-paper-curtain.mjs').exists(),'Restricted reference curtain must not be shipped'
report={'routes':len(routes),'asset_files':len(list((DIST/'assets').iterdir())),'errors':errors}
(ROOT/'docs/static-check.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2));sys.exit(bool(errors))
