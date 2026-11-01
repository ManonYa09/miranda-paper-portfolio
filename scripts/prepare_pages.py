"""Prepare a separate GitHub Pages output with repository-relative URLs."""
from pathlib import Path
import re, shutil
root = Path(__file__).resolve().parents[1]
out = root / 'pages-dist'
if out.exists(): shutil.rmtree(out)
shutil.copytree(root / 'dist', out)
base = '/miranda-paper-portfolio'
for p in out.rglob('*'):
    if p.is_file() and p.suffix in {'.html', '.css', '.js', '.mjs', '.json', '.svg'}:
        text = p.read_text()
        text = re.sub(r'(?<=[\s\"\x27(=])/(assets/|work(?=[/\"\x27?#\s])|about(?=[/\"\x27?#\s])|legal(?=[/\"\x27?#\s]))', lambda m: base + '/' + m[1], text)
        text = re.sub(r'(href=[\"\x27])/(?=[\"\x27?#])', lambda m: m[1] + base + '/', text)
        text = text.replace('%2Fassets%2F', '%2Fmiranda-paper-portfolio%2Fassets%2F')
        p.write_text(text)
(out / '.nojekyll').touch()
print('GitHub Pages output ready')
