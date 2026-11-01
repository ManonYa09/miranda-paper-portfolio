#!/usr/bin/env python3
"""Archive Miranda's public presentation resources and make an offline static edition.

Run from any directory: python3 scripts/sync_reference.py
Only fetches same-origin HTML pages and presentation dependencies. Analytics and
resource hints are removed before dependency discovery. Existing raw files are cached.
"""
from __future__ import annotations
import concurrent.futures, hashlib, html, json, mimetypes, re, time
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit, unquote, quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.niccolomiranda.com'
HOSTS = {'www.niccolomiranda.com', 'niccolomiranda.com'}
ASSET_HOSTS = {'cdn.prod.website-files.com','uploads-ssl.webflow.com','uploads.webflow.com','cdn.jsdelivr.net','cdnjs.cloudflare.com','d3e54v103j8qbb.cloudfront.net','unpkg.com','images.unsplash.com','assets.website-files.com'}
TRACK = re.compile(r'googletagmanager|google-analytics|gtag\(|dataLayer|hotjar|facebook.net|fbq\(|plausible.io|segment.com|clarity.ms', re.I)
URL = re.compile(r'https?://[^\s"\'<>`\\){}]+')
EXT = re.compile(r'\.(?:css|m?js|woff2?|ttf|otf|eot|jpe?g|png|webp|avif|gif|svg|mp4|webm|ico|json)(?:[?#]|$)',re.I)
records = {}
missing = []
removed = []
pages = {}

def canonical(url):
    p=urlsplit(html.unescape(url).rstrip('?'))
    return urlunsplit((p.scheme,p.netloc,p.path,p.query,''))

def request(url):
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={'User-Agent':'Mozilla/5.0 (faithful local portfolio recreation)'}), timeout=60) as r:
                return r.read(), r.headers.get('content-type',''), r.geturl()
        except Exception:
            if attempt == 2: raise
            time.sleep(attempt+1)

def route_path(route):
    return Path(route.strip('/')) / 'index.html' if route != '/' else Path('index.html')

class Links(HTMLParser):
    def __init__(self): super().__init__(); self.routes=set()
    def handle_starttag(self,tag,attrs):
        if tag != 'a': return
        href=dict(attrs).get('href','')
        if not href or href.startswith(('#','mailto:','tel:')): return
        p=urlsplit(urljoin(ORIGIN,href))
        if p.netloc in HOSTS and not EXT.search(p.path): self.routes.add(p.path.rstrip('/') or '/')

def sanitize(text):
    def script(m):
        if TRACK.search(m[0]):
            removed.append({'kind':'tracking-script','sample':m[0][:160]}); return ''
        return m[0]
    text=re.sub(r'<script\b[^>]*>[\s\S]*?</script>',script,text,flags=re.I)
    text=re.sub(r'<link\b[^>]*\brel=["\'](?:preconnect|dns-prefetch|prefetch|prerender)["\'][^>]*>','',text,flags=re.I)
    # Original Webflow badge status may be inherited from hosted metadata.
    text=re.sub(r'\sdata-wf-status=["\'][^"\']*["\']','',text)
    return text

def discover(text,base):
    for template in re.findall(r'<script[^>]*text/x-wf-template[^>]*>([\s\S]*?)</script>', text):
        text += unquote(template)
    found=set()
    for m in URL.finditer(text):
        raw=html.unescape(m[0]).rstrip(');,')
        p=urlsplit(raw)
        if p.netloc in ASSET_HOSTS and (EXT.search(raw) or p.netloc=='unpkg.com') and not TRACK.search(raw):
            found.add(canonical(raw))
    # Relative CSS assets and ES module specifiers are resolved against response URL.
    for pattern in [r'url\(\s*["\']?([^\s)"\']+)',r'(?:from\s*|import\s*\(?|export\s+[^;]+?from\s*)["\']([^"\']+)["\']']:
        for raw in re.findall(pattern,text):
            if raw.startswith(('data:','blob:','#')): continue
            if not (raw.startswith(('.', '/', 'https:')) or EXT.search(raw)): continue
            full=canonical(urljoin(base,raw))
            if urlsplit(full).netloc in ASSET_HOSTS and not TRACK.search(full): found.add(full)
    return found

def asset_name(url):
    name=unquote(urlsplit(url).path.split('/')[-1]) or 'asset'
    name=re.sub(r'[^a-zA-Z0-9._-]','-',name)
    if not Path(name).suffix: name += '.js' if 'unpkg.com/' in url else '.bin'
    return hashlib.sha256(url.encode()).hexdigest()[:10]+'-'+name

def sanitize_vendor(text):
    # Public bundle modules are isolated CommonJS wrappers. Remove hosted editor
    # and badge integrations while retaining the interaction engine and utilities.
    pattern = r'var (\w+)=s\(\(\w+,\w+\)=>\{var \w+=rt\(\);\w+\.define\("(?:brand|edit)",[\s\S]*?(?=var \w+=s\(\()'
    return re.sub(pattern, lambda m: 'var '+m[1]+'=s(()=>{});', text)

def fetch_asset(url):
    name=asset_name(url); rawpath=ROOT/'reference/assets'/name
    try:
        if rawpath.exists():
            data=rawpath.read_bytes(); ct=mimetypes.guess_type(name)[0] or ''; resolved=url
        else:
            data,ct,resolved=request(url); rawpath.parent.mkdir(parents=True,exist_ok=True); rawpath.write_bytes(data)
        record={'url':url,'resolved_url':resolved,'local':'/assets/'+name,'bytes':len(data),'content_type':ct,'sha256':hashlib.sha256(data).hexdigest()}
        text=data.decode('utf-8') if any(x in name for x in ('.css','.js','.mjs')) else None
        if text and 'webflow.' in url and '.js' in name: text=sanitize_vendor(text)
        return record, text, None
    except Exception as e: return None,None,{'url':url,'error':str(e)}

def replace_resources(text,base):
    # Longest first avoids partial replacements of image srcsets / URL query variants.
    for url,r in sorted(records.items(),key=lambda x:len(x[0]),reverse=True):
        text=text.replace(url,r['local']).replace(html.escape(url,quote=True),r['local'])
    def relative(m):
        raw=m.group(2)
        if raw.startswith(('/assets/','data:','blob:','#')): return m[0]
        full=canonical(urljoin(base,raw))
        return m[1]+records[full]['local']+m[3] if full in records else m[0]
    text=re.sub(r'(url\(\s*["\']?)([^\s)"\']+)(["\']?\s*\))',relative,text)
    text=re.sub(r'((?:from\s*|import\s*\(?)["\'])([^"\']+)(["\'])',relative,text)
    return text

def externalize(text):
    def script(m):
        attrs,body=m[1],m[2]
        if 'src=' in attrs or not body.strip() or 'application/ld+json' in attrs or 'text/x-wf-template' in attrs: return m[0]
        digest=hashlib.sha256(body.encode()).hexdigest()[:12]
        # Names reflect readable behavior roles to ease maintenance.
        role='bootstrap'
        for test,name in [('PaperCurtainEffect','paper-curtain'),('onNavClick','navigation'),('initSmoothScroll','smooth-scroll'),('butterSlider','carousels'),('setPathnameClass','route-class'),('100vh Fix','viewport'),('locomotive.stop','opening-scroll'),("window.scrollTo(0, 0)",'opening-lock')]:
            if test in body: role=name; break
        filename=f'reference-{role}-{digest}.js'
        (ROOT/'src/runtime'/filename).write_text(body)
        (ROOT/'dist/assets'/filename).write_text(body)
        return f'<script{attrs} src="/assets/{filename}"></script>'
    def style(m):
        body=m[1]; digest=hashlib.sha256(body.encode()).hexdigest()[:12]; filename=f'reference-inline-{digest}.css'
        (ROOT/'src/styles'/filename).write_text(body)
        (ROOT/'dist/assets'/filename).write_text(body)
        return f'<link rel="stylesheet" href="/assets/{filename}"/>'
    text=re.sub(r'<script\b([^>]*)>([\s\S]*?)</script>',script,text,flags=re.I)
    return re.sub(r'<style\b[^>]*>([\s\S]*?)</style>',style,text,flags=re.I)

def main():
    for d in ('reference/pages','reference/assets','src/pages','src/runtime','src/styles','dist/assets'): (ROOT/d).mkdir(parents=True,exist_ok=True)
    # Remove only importer-owned extracts; leave local application additions intact.
    for folder in ('src/runtime','src/styles','dist/assets'):
        for old in (ROOT/folder).glob('reference-*'): old.unlink()
    pending={'/','/work','/about','/legal'}
    while pending:
        route=sorted(pending)[0]; pending.remove(route)
        if route in pages: continue
        rawpath=ROOT/'reference/pages'/route_path(route)
        try:
            if rawpath.exists(): text=rawpath.read_text()
            else:
                data,ct,resolved=request(ORIGIN+route); text=data.decode('utf-8'); rawpath.parent.mkdir(parents=True,exist_ok=True); rawpath.write_text(text)
            clean=sanitize(text); pages[route]=clean
            links=Links(); links.feed(clean); pending |= links.routes - pages.keys()
            print('page',route,flush=True)
        except Exception as e:
            missing.append({'route':route,'error':str(e)}); pages[route]=None
    todo=set()
    for route,text in pages.items():
        if text: todo |= discover(text,ORIGIN+route)
    processed=set(); asset_text={}
    while todo:
        batch=sorted(todo-processed); todo=set()
        if not batch: break
        with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:
            for url,(record,text,error) in zip(batch,pool.map(fetch_asset,batch)):
                processed.add(url)
                if error: missing.append(error); print('MISSING',error,flush=True); continue
                records[url]=record
                if text is not None:
                    asset_text[url]=text; todo |= discover(text,record['resolved_url'])-processed
        print('assets fetched',len(records),'next dependencies',len(todo),flush=True)
    for url,r in records.items():
        dest=ROOT/'dist'/r['local'].lstrip('/')
        if url in asset_text:
            text=replace_resources(asset_text[url],r['resolved_url'])
            # Disable Webflow branding module without altering interactions/animation data.
            if 'webflow.' in url:
                text=re.sub(r'Webflow\.define\("brand",function\(e\)\{', 'Webflow.define("brand",function(e){return {};', text)
            dest.write_text(text)
        else: dest.write_bytes((ROOT/'reference/assets'/Path(r['local']).name).read_bytes())
    for route,text in pages.items():
        if text is None: continue
        text=replace_resources(text,ORIGIN+route)
        text=re.sub(r'(<script[^>]*text/x-wf-template[^>]*>)([\s\S]*?)(</script>)', lambda m: m[1]+quote(replace_resources(unquote(m[2]), ORIGIN+route), safe="~()*!.'-")+m[3], text)
        # Leave external destinations intact; only same-origin navigation becomes local.
        text=re.sub(r'((?:href|action)=["\'])https?://(?:www\.)?niccolomiranda\.com(?=/|["\'])',r'\1',text)
        text=externalize(text)
        for target in ('src/pages','dist'):
            dest=ROOT/target/route_path(route); dest.parent.mkdir(parents=True,exist_ok=True); dest.write_text(text)
    inventory={'reference_origin':ORIGIN,'captured_at':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'routes':[{'route':r,'source':str(Path('src/pages')/route_path(r)),'available':bool(t)} for r,t in sorted(pages.items())], 'assets':sorted(records.values(),key=lambda r:r['url']),'missing':missing,'removed_integrations':removed}
    (ROOT/'reference/asset-inventory.json').write_text(json.dumps(inventory,indent=2)+'\n')
    print(json.dumps({'routes':list(sorted(pages)),'assets':len(records),'missing':missing},indent=2))
if __name__=='__main__': main()
