PET BOWL MASTER — offline copy
==============================

Pet Bowl Master.html
    Double-click it. That is the whole app — no install, no server.
    Set the sizes, type the pet's name, press "Download STL set" and you
    get a zip with body.stl, tray.stl and print-notes.txt — plus
    inlay.stl if you picked the Flat inlay relief.

    You can also drop an SVG logo onto the page — it is embossed into the
    same top rim as the name. By default the two SHARE ONE PLAQUE: a single
    badge holding the logo and the name together, placed and styled as one
    object. Turn "Share one plaque with the name" off to go back to two
    independent pieces. Drag the badge — or either piece when separate — on
    the 3D preview to move it anywhere round the ring.

    Each has three reliefs:
        Raised      the artwork stands proud of the rim.
        Recessed    a raised plaque with the artwork left as gaps.
        Flat inlay  the plaque, plus the artwork filling its gaps
                    exactly — level, no bump. See ABOUT FLAT INLAY.

    Each can be laid out two ways:
        Curved  wraps round the rim. Natural for text.
        Flat    lies straight, undistorted. What you want for a logo —
                curved bends a square into a banana.
    The name defaults to Curved, the logo to Flat.

    Works offline. The one thing that needs internet is the lettering:
    the Kanit and IBM Plex fonts come from Google Fonts. Offline, Thai
    still renders using a Windows system font, so names work either
    way — they just look slightly different from the online version.

    Tested in Chrome and Edge. Needs WebGL2 for the 3D preview; if the
    preview is blank the download still works.

src\
    The three source files the page is built from, plus build.py.
    shell.html  markup and all the CSS
    geo.js      the parametric geometry engine — this is the real model.
                It also runs under node, which is how it was verified:
                    node -e "const {PBM}=require('./geo.js'); ..."
    app.js      UI, WebGL viewer, name and SVG logo engravers,
                STL and zip writers

    Edit any of them, then:  python src\build.py
    That regenerates "Pet Bowl Master.html".

ABOUT body.stl
    It contains the holder as one watertight shell, plus one small closed
    solid per letter stroke (or, for Flat inlay, per plaque piece) — and, if you added one, per piece of the logo
    — sitting in the rim. All of them are watertight with consistent
    winding; the slicer unions them when it loads the file. So if it
    reports "134 objects" or offers to repair the mesh, that is the
    lettering and the logo, and you can decline. Where two of those solids
    touch, four faces meet along one edge; that is normal for a file of
    separate solids and is not a hole. tray.stl is always a single shell.

ABOUT FLAT vs CURVED
    Both go through one pipeline: rasterise, decompose into rectangles,
    extrude each as a closed box. Only the last step differs — geo.js
    nameMesh() bends the rect field round the ring, flatMesh() lays it on a
    plane. Both use the same axis convention, so switching modes never
    mirrors or flips the artwork.

    Flat has less room than curved, because the top face is an annulus: a
    straight rectangle runs off it long before an arc band does, and the
    face is a CIRCLE on the inside (the bowl seat) but a SQUIRCLE outside.
    So the flat area varies a lot with position — for the Puppy preset,
    roughly 90 x 9 mm along a flat side but 50 x 17 mm at a corner. Flat
    artwork is scaled down automatically to fit wherever you drag it, and
    the app says so. If it shrinks too much, drag it to a corner.

ABOUT THE SHARED PLAQUE
    With "Share one plaque" on, the Name panel drives the whole badge — its
    position, Layout, Relief and Rotation. The Logo panel keeps only its
    height, plus "Logo position": Left, Right, Above or Below the name.

    Both size sliders keep their meaning. Text height sets the lettering,
    Logo height sets the logo, and the plaque wraps whatever the two come
    out as.

    THE RIM IS NARROW — about 10 mm on the Puppy preset, 8 mm on Cat. Left
    and Right only need the TALLER of the two pieces, so they fit easily.
    Above and Below need both heights ADDED TOGETHER plus a gap, which at
    the default 8 mm text and 10 mm logo is 20.4 mm — more than twice the
    room. The badge is then scaled down to fit and the name ends up around
    4 mm. The app says so, and shows what each piece actually lands at
    beside its slider. If you want stacking, use a big bowl or small sizes.

    Under the hood the two bitmaps are composited onto ONE grid at a single
    pixel-per-mm before anything else happens. They arrive on different
    scales — each is normalised so its own artwork is exactly 56 or 72 rows
    tall — so they cannot simply be laid side by side. The finer of the two
    is copied untouched and the coarser is scaled up to match; scaling down
    would throw away detail. After that it is one piece of artwork and goes
    through exactly the same path as a name on its own.

ABOUT FLAT INLAY
    Raised and recessed both read as one colour unless you swap filament
    at a layer, and a swap recolours everything above it — fine for
    raised letters, useless for artwork that is level with its
    surroundings. Two colours inside ONE layer needs two parts.

    So Flat inlay splits the artwork in two:
        body.stl    carries the plaque — the artwork's complement,
                    i.e. the background with the artwork left as holes.
        inlay.stl   carries the artwork itself, at the same height.

    They are generated from one padded bitmap, one as the mask and one
    as its inverse, then swept with the identical placement. So they
    tile the same patch of rim with no overlap and no gap, and their top
    faces land at the same z — by construction, with no boolean. Drag or
    rotate the piece and both halves move together.

    RELIEF DEPTH 0 is the extreme of this: the plaque goes level with the
    rim too, so nothing stands proud anywhere and the marking is purely a
    colour change on a smooth surface. The solids are still 0.6 mm thick —
    they sit down inside the rim rather than on top of it, which is enough
    for the second filament to cover cleanly. At depth 0 with Raised or
    Recessed the artwork simply merges into the holder and disappears, and
    the app says so.

    In the slicer: load body.stl, add inlay.stl as a PART of it, assign
    the part your second filament. Both files share one origin, so do
    not re-centre the part. One extruder only? Print inlay.stl alone in
    the second colour and glue it into the recess — it is the same fit.

ABOUT THE SVG LOGO
    It is rasterised, then decomposed into rectangles and swept onto the
    ring as closed boxes — the same path the lettering takes, so it comes
    out watertight by construction too.

    Use filled shapes. A stroke-only drawing rasterises as hairlines; the
    app measures how much of the artwork is finer than 0.8 mm (by eroding
    and dilating it back) and warns you, because a 0.4 mm nozzle drops
    anything thinner. Expand strokes to outlines before exporting.

    An SVG that pulls in an external bitmap will not work — the browser
    blocks or taints it. Embed the artwork as paths.

WHAT THE MODEL GUARANTEES
    Every part is one closed cross-section swept around a superellipse,
    so both STLs come out watertight with consistent winding — no CSG,
    no repair step. Verified across bowl 110-180 mm, round through boxy,
    tray 10-34 mm, handles on and off.

    The ant gap is the design driver, not a by-product: the holder's
    underside hugs a sphere of that radius centred on the tray's top
    outer edge, so the visible gap between the two parts IS the barrier.

PRINTING
    Part A   INVERTED — top face on the bed. No supports.
    Part B   as exported, floor down. 12 bottom layers so the trough
             holds water. No supports.
    PETG or ASA for Part B; it sits in standing water permanently.

    Full settings are written into print-notes.txt with every download.
