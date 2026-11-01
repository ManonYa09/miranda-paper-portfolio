#!/usr/bin/env python3
"""Offline deterministic assembly. Reference sync is a separate explicit action."""
from pathlib import Path
import shutil,re,json
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'; ASSETS=DIST/'assets'
ASSETS.mkdir(parents=True,exist_ok=True)
# Remove duplicate conflict copies generated during reference acquisition.
for folder in [ASSETS,ROOT/"src/runtime",ROOT/"src/styles"]:
    for copy in folder.glob("* 2.*"): copy.unlink()
# Public reference assets are already vendored in dist/assets by sync_reference.py.
for directory in ['runtime','styles']:
    for path in (ROOT/'src'/directory).glob('*'):
        text=path.read_text()
        if path.name=='reference-paper-curtain-a21d57361f26.js':
            text=(ROOT/'src/scripts/navigation.js').read_text()
        elif path.name=='reference-paper-curtain-e92e535feaa6.js':
            text=text.replace('/assets/873a3f1383-paper-curtain.mjs','/assets/paper-curtain.mjs')
            text=text.replace("if (window.location.href.includes('?')) { app.classList.add('appear') }","if (window.location.href.includes('?')) { document.querySelector('#app')?.classList.add('appear') }")
            text=text.replace('new PaperCurtainEffect(aboveCanvas,','new PaperCurtainEffect(aboveCanvas,')
        elif path.name.startswith('reference-route-class'):
            text="const slug=location.pathname.split('/').filter(Boolean);if(slug[0]==='work'&&slug[1])document.body.classList.add(slug[1]);"
        elif path.name.startswith('reference-smooth-scroll'):
            text=text.replace('if (!is_touch_device())','if (!window.mirandaReducedMotion && !is_touch_device())')
        elif path.name.startswith('reference-opening-lock') or path.name.startswith('reference-opening-scroll'):
            text='if (!window.mirandaReducedMotion) {\n'+text+'\n}'
        elif path.name=='reference-bootstrap-b1dad743390e.js':
            text=text.replace('window.locomotive.update()','window.locomotive?.update()')
        elif path.name=='reference-bootstrap-ea308b4034b3.js':
            text=text.replace('locomotive.update()','window.locomotive?.update()').replace('locomotive.scrollTo','window.locomotive?.scrollTo').replace('console.log(locomotive)','')
            text=text.replace("      })\n      console.log", "      },{once:true})\n      console.log")
        text=re.sub(r'^\s*console\.log\([^\n]*\)\s*;?\s*$', '',text,flags=re.M)
        (ASSETS/path.name).write_text(text)
for path in (ROOT/'src/scripts').glob('*'):
    shutil.copy2(path,ASSETS/path.name)
for path in (ROOT/'src/pages').rglob('*.html'):
    text=path.read_text()
    thumb=next(ASSETS.glob('*616ec16685b160870d15932b_thumbnail-small.jpeg'))
    text=text.replace('https://miranda-paper-portfolio.webflow.io/work/deplace-maison','/assets/'+thumb.name)
    # No original identifier is transmitted: assets are local and network is constrained.
    policy="default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'none'; object-src 'none'; base-uri 'self'"
    additions=f'<meta name="robots" content="noindex,nofollow"><meta http-equiv="Content-Security-Policy" content="{policy}"><script src="/assets/enhancements.js"></script><link rel="stylesheet" href="/assets/enhancements.css">'
    # Early flag precedes reference startup. Styling goes last for deterministic overrides.
    text=text.replace('<head>','<head>'+additions.split('<link')[0])
    text=text.replace('</head>','<link'+additions.split('<link')[1]+'</head>')
    target=DIST/path.relative_to(ROOT/'src/pages');target.parent.mkdir(parents=True,exist_ok=True);target.write_text(text)
# The restricted implementation must never enter the deployment package.
(ASSETS/'873a3f1383-paper-curtain.mjs').unlink(missing_ok=True)
(DIST/'robots.txt').write_text('User-agent: *\nDisallow: /\n')
(DIST/'404.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Page not found</title><body style="background:#cdc6be;color:#1d1d1b;font-family:serif;padding:8vw"><h1>Page not found</h1><p><a href="/">Return to the Paper Portfolio</a></p></body></html>')
print(f'Built {len(list((ROOT/"src/pages").rglob("*.html")))} routes with local assets.')
