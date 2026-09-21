"""Rebuild "Pet Bowl Master.html" from the three source files.

    python build.py

shell.html  markup + all CSS
geo.js      parametric geometry engine (also runs in node for testing)
app.js      UI, WebGL viewer, name engraver, STL + zip export
"""
import os
here = os.path.dirname(os.path.abspath(__file__))
read = lambda f: open(os.path.join(here, f), encoding='utf-8').read()
inner = read('shell.html') + "\n<script>\n" + read('geo.js') + \
        "\n</script>\n<script>\n" + read('app.js') + "\n</script>\n"
doc = ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
       '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
       '</head>\n<body style="margin:0">\n' + inner + '</body>\n</html>\n')
open(os.path.join(here, '..', 'Pet Bowl Master.html'), 'w', encoding='utf-8').write(doc)
print('wrote Pet Bowl Master.html', len(doc), 'bytes')
