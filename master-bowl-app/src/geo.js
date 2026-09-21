/* Pet Bowl Master — parametric geometry engine.
   A direct port of petbowl.py rev E, built without CSG: every part is one
   closed cross-section profile swept around a superellipse, so the result is
   watertight by construction. Runs in the browser and in node. */
(function (root) {
'use strict';

var TAU = Math.PI * 2;

/* ---------------------------------------------------------------- params */
function derive(u) {
  var P = {};
  P.n        = u.nSuper;
  P.wall     = u.wall;
  P.shellA   = u.holderW / 2;

  P.bowlD    = u.bowlD;
  P.bowlDep  = u.bowlDepth;
  P.taper    = 0.5;
  P.seatLipR = u.bowlD / 2 - 5;          // bowl lands here, on its own flank
  P.seatOpenR= P.seatLipR + 8;           // opening at the top face
  P.drop     = (u.bowlD / 2 - P.seatLipR) / P.taper;   // rim sits this far up

  P.trayH    = u.trayH;
  P.trayWall = 3;
  P.trayFloor= 2.6;
  P.pedTopZ  = u.trayH - 3;      // foot always lands 3 mm below the tray rim
  P.rimZ     = P.trayH - 1 - P.pedTopZ;   // tray's top outer EDGE, in body coords

  P.seatLipZ = u.rimHeight - P.pedTopZ - P.drop;
  P.bodyH    = P.seatLipZ + 8;
  P.plateZ   = P.bodyH - 5;
  P.topFill  = 6;
  P.botCham  = 1.5;
  P.collarT  = u.wall;

  P.trayOutA = P.shellA - 3;             // body overhangs 3 mm per side
  P.troughW  = 11;
  P.pedOutA  = P.trayOutA - P.trayWall - P.troughW;
  P.footA    = P.pedOutA - 4;
  P.pedInA   = P.footA - 11;
  P.lipOutA  = P.footA - u.wall - 1.5;
  P.lipInA   = P.lipOutA - 4;
  P.lipTopZ  = P.pedTopZ + 5;

  P.moatGap  = u.moatGap;
  P.coveMarg = 0.5;
  P.voidSlope= 0.85;
  P.footTopZ = 2;

  P.handles  = u.handles;
  P.handleL  = u.handleLen;
  P.handleH  = u.handleH;
  // centre the opening in the clear wall between the cove and the top plate,
  // so changing tray height or bowl height keeps it where the hand goes
  P.handleLo = P.rimZ + P.moatGap + 4;
  P.handleHi = P.plateZ - 5;
  P.handleZc = (P.handleLo + P.handleHi) / 2;
  return P;
}

function validate(P) {
  var w = [];
  if (P.footA > P.trayOutA - P.moatGap)
    w.push({k: 'moat', m: 'Holder too narrow for this moat gap — the foot would sit under the tray rim.'});
  if (P.shellA - P.topFill - P.seatOpenR < 4)
    w.push({k: 'rim', m: 'Top rim is under 4 mm wide. Widen the holder or use a smaller bowl.'});
  if (P.seatLipZ < P.rimZ + P.moatGap + 6)
    w.push({k: 'height', m: 'Too short for this moat gap — raise the bowl height.'});
  if (P.handles && P.handleH > P.handleHi - P.handleLo)
    w.push({k: 'handle', m: 'No clear wall left for handles this tall — shorten them, or raise the bowl height.'});
  if (P.footA - P.wall <= P.lipOutA)
    w.push({k: 'lip', m: 'Wall too thick for the locating lip at this size.'});
  if (P.trayH - P.trayFloor < 7)
    w.push({k: 'tray', m: 'Trough under 7 mm deep — it will need topping up often in dry season.'});
  return w;
}

function fillDepth(P) {          // sensible water level for this trough
  return Math.max(4, Math.min(18, P.trayH - P.trayFloor - 3));
}

/* ------------------------------------------------------------- profiles */
function clearanceLimit(P, z) {
  // Largest half-width allowed at z while staying moatGap away from the
  // tray's top outer rim. This curve is what makes the visible gap equal the
  // ant barrier instead of several times larger.
  var dz = Math.abs(z - P.rimZ);
  if (dz >= P.moatGap) return P.shellA;
  return Math.min(P.shellA,
    P.trayOutA - Math.sqrt(P.moatGap * P.moatGap - dz * dz) - P.coveMarg);
}

function aOuter(P, z) {
  var ramp = P.footA + Math.max(z - P.footTopZ, 0) * 2.5;
  var a = Math.max(P.footA, Math.min(ramp, clearanceLimit(P, z), P.shellA));
  var rr = P.topFill, H = P.bodyH;
  if (z > H - rr) {
    var d = Math.min(z - (H - rr), rr);
    a -= rr - Math.sqrt(Math.max(rr * rr - d * d, 0));
  }
  var lr = 1.2, zl = P.rimZ + P.moatGap;            // soften the cove lip
  if (z >= zl && z < zl + lr) {
    var e = z - (zl + lr);
    a -= lr - Math.sqrt(Math.max(lr * lr - e * e, 0));
  }
  if (z < P.botCham) a -= (P.botCham - z);
  return a;
}

function skinLevels(P) {
  var zs = [], i;
  var coveTop = P.rimZ + P.moatGap + 2;
  for (i = 0; i <= 3; i++) zs.push(P.botCham * i / 3);
  for (i = 1; i <= 30; i++) zs.push(P.botCham + (coveTop - P.botCham) * i / 30);
  for (i = 1; i <= 6; i++) zs.push(coveTop + (P.bodyH - P.topFill - coveTop) * i / 6);
  for (i = 1; i <= 8; i++) zs.push(P.bodyH - P.topFill + P.topFill * i / 8);
  if (P.handles && P.handleL > 4) {
    // the handle outline is cut cell by cell, so it is only as smooth as the
    // rows crossing it — sample the band finely or the ellipse comes out as a
    // staircase
    var z0 = P.handleZc - P.handleH / 2 - 1.5, z1 = P.handleZc + P.handleH / 2 + 1.5;
    var n = Math.max(32, Math.ceil((z1 - z0) / 0.42));
    for (i = 0; i <= n; i++) zs.push(z0 + (z1 - z0) * i / n);
  }
  zs.sort(function (a, b) { return a - b; });
  return zs.filter(function (z, k, arr) {
    return z >= 0 && z <= P.bodyH && (k === 0 || z - arr[k - 1] > 1e-4);
  });
}

function voidLevels(P, zs) {
  // inner wall: `wall` inside the outer face, but never narrowing downward
  // faster than voidSlope, so the cove prints inverted without support
  var v = [], i;
  for (i = 0; i < zs.length; i++) {
    var cap = aOuter(P, zs[i]) - P.wall;
    v.push(i === 0 ? cap : Math.min(cap, v[i - 1] + P.voidSlope * (zs[i] - zs[i - 1])));
  }
  return v;
}

/* ------------------------------------------------------------ mesh core */
function seShape(n, seg) {           // superellipse radius factor per angle
  var k = new Float64Array(seg), t;
  for (var i = 0; i < seg; i++) {
    t = TAU * i / seg;
    k[i] = 1 / Math.pow(Math.pow(Math.abs(Math.cos(t)), n) +
                        Math.pow(Math.abs(Math.sin(t)), n), 1 / n);
  }
  return k;
}

function Mesh() { this.p = []; this.f = []; }
Mesh.prototype.v = function (x, y, z) { this.p.push(x, y, z); return this.p.length / 3 - 1; };
Mesh.prototype.tri = function (a, b, c) { this.f.push(a, b, c); };
Mesh.prototype.quad = function (a, b, c, d) { this.f.push(a, b, c, a, c, d); };
Mesh.prototype.count = function () { return this.f.length / 3; };

function signedVolume(m) {
  var p = m.p, f = m.f, v = 0;
  for (var i = 0; i < f.length; i += 3) {
    var a = f[i] * 3, b = f[i + 1] * 3, c = f[i + 2] * 3;
    v += (p[a] * (p[b + 1] * p[c + 2] - p[b + 2] * p[c + 1])
        - p[a + 1] * (p[b] * p[c + 2] - p[b + 2] * p[c])
        + p[a + 2] * (p[b] * p[c + 1] - p[b + 1] * p[c])) / 6;
  }
  return v;
}

function flip(m) { for (var i = 0; i < m.f.length; i += 3) { var t = m.f[i + 1]; m.f[i + 1] = m.f[i + 2]; m.f[i + 2] = t; } }

/* Sweep a closed (a, z, mode) profile around the superellipse.
   mode 1 = follows the squircle, 0 = circular. `skip(i, p)` may drop a quad;
   dropped regions are walled by the caller. */
function sweep(prof, n, seg, skip, wall) {
  var m = new Mesh(), k = seShape(n, seg), i, j, t, r;
  var M = prof.length;
  for (i = 0; i < seg; i++) {
    t = TAU * i / seg;
    var ct = Math.cos(t), st = Math.sin(t);
    for (j = 0; j < M; j++) {
      r = prof[j].a * (1 + prof[j].m * (k[i] - 1));
      m.v(r * ct, r * st, prof[j].z);
    }
  }
  var id = function (i2, j2) { return ((i2 % seg) * M) + j2; };
  for (i = 0; i < seg; i++) {
    for (j = 0; j < M; j++) {
      var j2 = (j + 1) % M;
      if (skip && skip(i, j)) continue;
      m.quad(id(i, j), id(i + 1, j), id(i + 1, j2), id(i, j2));
    }
  }
  if (wall) wall(m, id, seg, M);
  if (signedVolume(m) < 0) flip(m);
  return m;
}

/* ----------------------------------------------------------- Part A body */
function buildBody(P, seg) {
  var zs = skinLevels(P), vs = voidLevels(P, zs), i;
  var K = zs.length;
  var prof = [];
  var outerStart = 0;
  for (i = 0; i < K; i++) prof.push({a: aOuter(P, zs[i]), z: zs[i], m: 1});
  var aTop = aOuter(P, P.bodyH);
  prof.push({a: P.seatOpenR, z: P.bodyH, m: 0});                  // top face
  prof.push({a: P.seatLipR, z: P.seatLipZ, m: 0});                // 45 deg seat
  var off = P.collarT * Math.SQRT2;
  prof.push({a: P.seatLipR + off, z: P.seatLipZ, m: 0});          // collar lip
  prof.push({a: P.seatLipR + off + (P.plateZ - P.seatLipZ), z: P.plateZ, m: 0});
  var vAtPlate = 0;
  for (i = 0; i < K; i++) if (zs[i] <= P.plateZ) vAtPlate = vs[i];
  prof.push({a: vAtPlate, z: P.plateZ, m: 1});                    // plate under
  var innerStart = prof.length;
  var innerZ = [], innerV = [];
  for (i = K - 1; i >= 0; i--) if (zs[i] < P.plateZ) { innerZ.push(zs[i]); innerV.push(vs[i]); }
  for (i = 0; i < innerZ.length; i++) prof.push({a: innerV[i], z: innerZ[i], m: 1});

  // profile index of the outer skin / inner skin at each z level
  var outIdx = [], inIdx = [];
  for (i = 0; i < K; i++) {
    outIdx.push(outerStart + i);
    var w = innerZ.indexOf(zs[i]);
    inIdx.push(w < 0 ? -1 : innerStart + w);
  }

  /* handle openings, defined in (arc, z) parameter space so the hole cut out
     of the outer skin and the one cut out of the inner skin match exactly */
  var SEGC = seg;
  var holeCell = null;
  if (P.handles && P.handleL > 4) {
    var ra = P.handleL / 2, rb = P.handleH / 2;   // ellipse semi-axes
    var inHole = function (th, z) {
      for (var c = 0; c < 2; c++) {
        var d = th - c * Math.PI;
        d = Math.atan2(Math.sin(d), Math.cos(d)) * P.shellA;   // arc length
        var u = d / ra, w = (z - P.handleZc) / rb;
        if (u * u + w * w <= 1) return true;
      }
      return false;
    };
    holeCell = function (i2, k) {
      var th = TAU * (i2 + 0.5) / SEGC;
      var z = (zs[k] + zs[k + 1]) / 2;
      return inHole(th, z);
    };
  }

  var skip = null, wallFn = null;
  if (holeCell) {
    var mask = [];
    for (i = 0; i < seg; i++) {
      mask.push(new Uint8Array(K));
      for (var k = 0; k < K - 1; k++) if (holeCell(i, k) && inIdx[k] >= 0 && inIdx[k + 1] >= 0) mask[i][k] = 1;
    }
    var skipOut = [];
    for (i = 0; i < seg; i++) skipOut.push(new Uint8Array(prof.length));
    for (i = 0; i < seg; i++) {
      for (var k3 = 0; k3 < K - 1; k3++) if (mask[i][k3]) {
        skipOut[i][outIdx[k3]] = 1;
        skipOut[i][inIdx[k3 + 1]] = 1;   // inner skin runs the other way
      }
    }
    skip = function (i2, j) { return skipOut[i2][j] === 1; };

    wallFn = function (m, id, segN, M) {
      var quads = [];
      for (var a = 0; a < segN; a++) for (var b = 0; b < K - 1; b++) {
        if (!mask[a][b]) continue;
        var oL = outIdx[b], oH = outIdx[b + 1], iL = inIdx[b], iH = inIdx[b + 1];
        // theta-direction walls
        if (!mask[(a - 1 + segN) % segN][b])
          quads.push([id(a, oL), id(a, oH), id(a, iH), id(a, iL)]);
        if (!mask[(a + 1) % segN][b])
          quads.push([id(a + 1, oH), id(a + 1, oL), id(a + 1, iL), id(a + 1, iH)]);
        // z-direction walls
        if (b === 0 || !mask[a][b - 1])
          quads.push([id(a + 1, oL), id(a, oL), id(a, iL), id(a + 1, iL)]);
        if (b === K - 2 || !mask[a][b + 1])
          quads.push([id(a, oH), id(a + 1, oH), id(a + 1, iH), id(a, iH)]);
      }
      for (var q = 0; q < quads.length; q++) m.quad(quads[q][3], quads[q][2], quads[q][1], quads[q][0]);
    };
  }
  return sweep(prof, P.n, seg, skip, wallFn);
}

/* ----------------------------------------------------------- Part B tray */
function buildTray(P, seg) {
  var A = P.trayOutA, W = P.trayWall, F = P.trayFloor, H = P.trayH;
  var prof = [
    {a: 0,          z: 0,  m: 0},
    {a: A - 1.5,    z: 0,  m: 1},
    {a: A,          z: 1.5, m: 1},
    {a: A,          z: H - 1, m: 1},
    {a: A - 1,      z: H,  m: 1},
    {a: A - W,      z: H,  m: 1},
    {a: A - W,      z: F,  m: 1},
    {a: P.pedOutA,  z: F,  m: 1},
    {a: P.pedOutA,  z: P.pedTopZ, m: 1},
    {a: P.lipOutA,  z: P.pedTopZ, m: 1},
    {a: P.lipOutA,  z: P.lipTopZ - 1, m: 1},
    {a: P.lipOutA - 1, z: P.lipTopZ, m: 1},
    {a: P.lipInA,   z: P.lipTopZ, m: 1},
    {a: P.lipInA,   z: P.pedTopZ, m: 1},
    {a: P.pedInA,   z: P.pedTopZ, m: 1},
    {a: P.pedInA,   z: F,  m: 1},
    {a: 0,          z: F,  m: 0}
  ];
  var m = sweepAxis(prof, P.n, seg);
  return m;
}

/* sweep for a profile that touches the axis: r = 0 points collapse to one vertex */
function sweepAxis(prof, n, seg) {
  var m = new Mesh(), k = seShape(n, seg), i, j;
  var M = prof.length, axis = [], idx = [];
  for (j = 0; j < M; j++) axis.push(prof[j].a < 1e-9);
  for (j = 0; j < M; j++) idx.push(axis[j] ? m.v(0, 0, prof[j].z) : -1);
  var ringBase = m.p.length / 3;
  for (i = 0; i < seg; i++) {
    var t = TAU * i / seg, ct = Math.cos(t), st = Math.sin(t);
    for (j = 0; j < M; j++) {
      if (axis[j]) continue;
      var r = prof[j].a * (1 + prof[j].m * (k[i] - 1));
      m.v(r * ct, r * st, prof[j].z);
    }
  }
  var nr = 0, map = [];
  for (j = 0; j < M; j++) { map.push(axis[j] ? -1 : nr); if (!axis[j]) nr++; }
  var id = function (i2, j2) {
    return axis[j2] ? idx[j2] : ringBase + (i2 % seg) * nr + map[j2];
  };
  for (i = 0; i < seg; i++) for (j = 0; j < M; j++) {
    var j2 = (j + 1) % M;
    if (axis[j] && axis[j2]) continue;
    if (axis[j])      m.tri(id(i, j), id(i + 1, j2), id(i, j2));
    else if (axis[j2]) m.tri(id(i, j), id(i + 1, j), id(i, j2));
    else               m.quad(id(i, j), id(i + 1, j), id(i + 1, j2), id(i, j2));
  }
  if (signedVolume(m) < 0) flip(m);
  return m;
}

/* -------------------------------------------------------------- name art */
/* How far the artwork bites DOWN into the rim. 0.25 mm is enough to weld a
   raised solid to the body, but at a relief depth near zero that 0.25 would be
   the whole solid — one layer, too thin to read as a colour. So keep the total
   at 0.6 mm minimum. This is a no-op at every depth the slider used to reach:
   from 0.35 mm up, 0.6 - emboss is already under 0.25. */
function seatBite(emboss) { return Math.max(0.25, 0.6 - emboss); }

function box(m, corners) {                       // corners: 4 bottom, 4 top
  var b = [], i;
  for (i = 0; i < 8; i++) b.push(m.v(corners[i][0], corners[i][1], corners[i][2]));
  m.quad(b[3], b[2], b[1], b[0]);                // bottom
  m.quad(b[4], b[5], b[6], b[7]);                // top
  m.quad(b[0], b[1], b[5], b[4]);
  m.quad(b[1], b[2], b[6], b[5]);
  m.quad(b[2], b[3], b[7], b[6]);
  m.quad(b[3], b[0], b[4], b[7]);
}

/* Map a rectangle of the text bitmap onto the rim band and extrude it.
   u runs along the arc, v across the band width. */
/* Sweeps a field of unit-square rects onto the flat top ring as closed boxes.
   Nothing here is text-specific — the name engraver and the SVG logo both
   feed it, which is how the logo inherits the watertight guarantee. */
function nameMesh(P, rects, opt) {
  var m = new Mesh();
  var z0 = P.bodyH - seatBite(opt.emboss), z1 = P.bodyH + opt.emboss;
  var rMid = opt.bandR, bw = opt.bandW;
  var arc = opt.arcLen;                       // total arc length of the band
  var th0 = opt.thetaC;
  for (var q = 0; q < rects.length; q++) {
    var R = rects[q];
    var s0 = (R.x0 - 0.5) * arc, s1 = (R.x1 - 0.5) * arc;
    var r0 = rMid + (R.y0 - 0.5) * bw, r1 = rMid + (R.y1 - 0.5) * bw;
    var steps = Math.max(1, Math.ceil(Math.abs(s1 - s0) / (rMid * 0.035)));
    for (var st = 0; st < steps; st++) {
      var a0 = th0 + (s0 + (s1 - s0) * st / steps) / rMid;
      var a1 = th0 + (s0 + (s1 - s0) * (st + 1) / steps) / rMid;
      var pts = [], ang = [a0, a1];
      for (var e = 0; e < 2; e++) {
        for (var f = 0; f < 2; f++) {
          var rr = f === 0 ? r0 : r1, aa = e === 0 ? a0 : a1;
          pts.push([rr * Math.cos(aa), rr * Math.sin(aa)]);
        }
      }
      var o = [pts[0], pts[1], pts[3], pts[2]];
      box(m, [
        [o[0][0], o[0][1], z0], [o[1][0], o[1][1], z0], [o[2][0], o[2][1], z0], [o[3][0], o[3][1], z0],
        [o[0][0], o[0][1], z1], [o[1][0], o[1][1], z1], [o[2][0], o[2][1], z1], [o[3][0], o[3][1], z1]
      ]);
    }
  }
  return m;
}

/* Lays the same rect field on the top face as a plane instead of an arc, so
   the artwork keeps its proportions — a square logo stays square.

   The axis convention is nameMesh's, so switching modes never mirrors or
   flips the artwork: u runs along the baseline (counter-clockwise tangential
   when rot is the position angle) and v points outward across it. That pair
   is left-handed, which is why the corner cycle below runs the opposite way
   round from the obvious one — it has to, to keep the boxes wound outward. */
function flatMesh(P, rects, opt) {
  var m = new Mesh();
  var z0 = P.bodyH - seatBite(opt.emboss), z1 = P.bodyH + opt.emboss;
  var ux = -Math.sin(opt.rot), uy = Math.cos(opt.rot);
  var vx = Math.cos(opt.rot), vy = Math.sin(opt.rot);
  var pt = function (u, v) { return [opt.cx + u * ux + v * vx, opt.cy + u * uy + v * vy]; };
  for (var q = 0; q < rects.length; q++) {
    var R = rects[q];
    var u0 = (R.x0 - 0.5) * opt.w, u1 = (R.x1 - 0.5) * opt.w;
    var v0 = (R.y0 - 0.5) * opt.h, v1 = (R.y1 - 0.5) * opt.h;
    var o = [pt(u0, v0), pt(u0, v1), pt(u1, v1), pt(u1, v0)];
    box(m, [
      [o[0][0], o[0][1], z0], [o[1][0], o[1][1], z0], [o[2][0], o[2][1], z0], [o[3][0], o[3][1], z0],
      [o[0][0], o[0][1], z1], [o[1][0], o[1][1], z1], [o[2][0], o[2][1], z1], [o[3][0], o[3][1], z1]
    ]);
  }
  return m;
}

/* Corners of a flat placement, in flatMesh's frame. */
function flatCorners(cx, cy, w, h, rot) {
  var ux = -Math.sin(rot), uy = Math.cos(rot);
  var vx = Math.cos(rot), vy = Math.sin(rot), p = [], i;
  for (i = 0; i < 4; i++) {
    var u = (i === 0 || i === 3 ? -1 : 1) * w / 2;
    var v = (i < 2 ? -1 : 1) * h / 2;
    p.push([cx + u * ux + v * vx, cy + u * uy + v * vy]);
  }
  return p;
}

/* Does a flat placement stay on the top face? That face is an annulus between
   a CIRCULAR bowl opening and a SQUIRCLE outer edge, so each edge needs its
   own test. */
function fitsTop(P, cx, cy, w, h, rot, margin) {
  var mg = margin || 0, pts = flatCorners(cx, cy, w, h, rot), i;
  // outer: the superellipse region is convex, so the corners settle it
  var aTop = P.shellA - P.topFill, n = P.n;
  for (i = 0; i < 4; i++) {
    var x = pts[i][0], y = pts[i][1], t = Math.atan2(y, x);
    var k = 1 / Math.pow(Math.pow(Math.abs(Math.cos(t)), n) +
                         Math.pow(Math.abs(Math.sin(t)), n), 1 / n);
    if (Math.hypot(x, y) > aTop * k - mg) return false;
  }
  // inner: must stay OUTSIDE the seat opening. The nearest point to the centre
  // can fall mid-edge, so a corner-only test would wrongly pass a rectangle
  // whose long edge cuts across the bowl opening.
  for (i = 0; i < 4; i++) {
    var a = pts[i], b = pts[(i + 1) % 4];
    var dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
    var u2 = L2 > 0 ? -(a[0] * dx + a[1] * dy) / L2 : 0;
    u2 = Math.max(0, Math.min(1, u2));
    if (Math.hypot(a[0] + dx * u2, a[1] + dy * u2) < P.seatOpenR + mg) return false;
  }
  return true;
}

/* Greedy rectangle decomposition of a binary mask — keeps the prism count
   in the hundreds instead of one box per pixel. */
function maskToRects(mask, W, H) {
  var used = new Uint8Array(W * H), rects = [], x, y, w, h, ok;
  for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
    if (!mask[y * W + x] || used[y * W + x]) continue;
    w = 0; while (x + w < W && mask[y * W + x + w] && !used[y * W + x + w]) w++;
    h = 1;
    while (y + h < H) {
      ok = true;
      for (var i = 0; i < w; i++)
        if (!mask[(y + h) * W + x + i] || used[(y + h) * W + x + i]) { ok = false; break; }
      if (!ok) break;
      h++;
    }
    for (var b = 0; b < h; b++) for (var a = 0; a < w; a++) used[(y + b) * W + x + a] = 1;
    rects.push({x0: x / W, x1: (x + w) / W, y0: y / H, y1: (y + h) / H});
  }
  return rects;
}

/* ---------------------------------------------------------- merged badge */
/* Composite two independently-normalised masks onto ONE grid at a single
   px/mm, so the name and the logo can share one plaque.

   Each input was scaled so its OWN ink bbox is exactly H rows tall, which
   means the two encode different mm-per-pixel (~7.0 vs ~7.2 at the default
   sliders, up to 4.7x apart at the extremes). This is where they go back on
   one ruler. They cannot simply be copied side by side.

   `pos` says where b sits relative to a. a is the reference piece: its block
   height comes back as padRef so the plaque border stays proportional to the
   LETTERING rather than to the whole badge — without that a stacked badge
   grows a 5.7 mm border and squeezes the name off the rim. */
function mergeArt(a, aMM, b, bMM, pos, opt) {
  var o = opt || {};
  var gapFrac = o.gapFrac === undefined ? 0.30 : o.gapFrac;
  var minGapMM = o.minGapMM === undefined ? 0.8 : o.minGapMM;
  var maxPx = o.maxPx || 260000, minPpmm = o.minPpmm || 2;

  if (!a && !b) return null;
  if (!a || !b) {                                 // solo: hand back the input as-is
    var s = a || b, sMM = a ? aMM : bMM, blk = {x: 0, y: 0, w: s.W, h: s.H};
    return {mask: s.mask, W: s.W, H: s.H, aspect: s.W / s.H, ppmm: s.H / sMM,
            heightMM: sMM, padRef: s.H, capped: false,
            blocks: {a: a ? blk : null, b: a ? null : blk}};
  }

  /* max, not min: the finer piece is copied 1:1 and the coarser is upsampled.
     Upsampling a binary mask invents nothing; downsampling drops features
     maskToRects would otherwise have carried. */
  var ppmm = Math.max(a.H / aMM, b.H / bMM), capped = false;
  var side = pos === 'left' || pos === 'right';
  var nw, nh, dw, dh, gp, W, H;

  /* Up to a few passes: sqrt(maxPx/area) is exact for area, but every block is
     rounded UP to a whole pixel and the gap is added on top, so one pass can
     land just over. The 0.995 makes each pass undershoot slightly and converge. */
  for (var pass = 0; pass < 6; pass++) {
    nh = Math.max(1, Math.round(aMM * ppmm));
    nw = Math.max(1, Math.round(aMM * a.aspect * ppmm));
    dh = Math.max(1, Math.round(bMM * ppmm));
    dw = Math.max(1, Math.round(bMM * b.aspect * ppmm));
    /* The 0.8 mm floor matches thinFraction's minMM: under RAISED relief this
       gap is bare rim between two solids, and anything thinner fuses in the
       slicer. Under recessed/inlay it is plaque material and unconstrained. */
    gp = Math.max(1, Math.round(Math.max(minGapMM, gapFrac * Math.min(aMM, bMM)) * ppmm));
    W = side ? nw + gp + dw : Math.max(nw, dw);
    H = side ? Math.max(nh, dh) : nh + gp + dh;
    if (W * H <= maxPx || ppmm <= minPpmm) break;
    capped = true;
    ppmm = Math.max(minPpmm, ppmm * Math.sqrt(maxPx / (W * H)) * 0.995);
  }

  /* Bitmap +x runs counter-clockwise along the rim, +y runs radially OUTWARD,
     so "above the text" is the smaller y. */
  var cy = function (h) { return (H - h) >> 1; }, cx = function (w) { return (W - w) >> 1; };
  var A, B;
  if (pos === 'left')       { B = {x: 0, y: cy(dh)}; A = {x: dw + gp, y: cy(nh)}; }
  else if (pos === 'right') { A = {x: 0, y: cy(nh)}; B = {x: nw + gp, y: cy(dh)}; }
  else if (pos === 'above') { B = {x: cx(dw), y: 0}; A = {x: cx(nw), y: dh + gp}; }
  else                      { A = {x: cx(nw), y: 0}; B = {x: cx(dw), y: nh + gp}; }
  A.w = nw; A.h = nh; B.w = dw; B.h = dh;

  var mask = new Uint8Array(W * H);
  blit(mask, W, a.mask, a.W, a.H, A);
  blit(mask, W, b.mask, b.W, b.H, B);

  return {mask: mask, W: W, H: H, aspect: W / H, ppmm: ppmm,
          heightMM: H / ppmm, padRef: nh, blocks: {a: A, b: B}, capped: capped};
}

/* Nearest-neighbour into a block, ORing so a block can never erase another.
   The clamps matter here in a way they do not in the two rasterisers: those
   only ever downsample, this one upsamples, and (y+0.5)*sh/dh can then reach
   sh exactly. */
function blit(dst, DW, src, sw, sh, blk) {
  for (var y = 0; y < blk.h; y++) {
    var sy = Math.min(sh - 1, Math.floor((y + 0.5) * sh / blk.h));
    var ro = sy * sw, wo = (blk.y + y) * DW + blk.x;
    for (var x = 0; x < blk.w; x++) {
      var sx = Math.min(sw - 1, Math.floor((x + 0.5) * sw / blk.w));
      if (src[ro + sx]) dst[wo + x] = 1;
    }
  }
}

/* Rects for either name style: raised letters, or a raised plaque with the
   letters left as gaps down to the rim face. */
function nameRects(mask, W, H, style, padPx, radPx) {
  if (style !== 'recessed') return maskToRects(mask, W, H);
  var inv = new Uint8Array(W * H), x, y;
  for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
    var inside = x >= padPx && x < W - padPx && y >= padPx && y < H - padPx;
    if (inside && radPx > 0) {           // rounded plaque corners
      var cx = Math.min(Math.max(x, padPx + radPx), W - padPx - radPx - 1);
      var cy = Math.min(Math.max(y, padPx + radPx), H - padPx - radPx - 1);
      var dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy > radPx * radPx) inside = false;
    }
    inv[y * W + x] = (inside && !mask[y * W + x]) ? 1 : 0;
  }
  return maskToRects(inv, W, H);
}

/* ------------------------------------------------------------ STL export */
function toSTL(meshes) {
  var n = 0, i;
  for (i = 0; i < meshes.length; i++) n += meshes[i].count();
  var buf = new ArrayBuffer(84 + n * 50), dv = new DataView(buf), o = 84;
  dv.setUint32(80, n, true);
  for (var k = 0; k < meshes.length; k++) {
    var m = meshes[k], p = m.p, f = m.f;
    for (i = 0; i < f.length; i += 3) {
      var a = f[i] * 3, b = f[i + 1] * 3, c = f[i + 2] * 3;
      var ux = p[b] - p[a], uy = p[b + 1] - p[a + 1], uz = p[b + 2] - p[a + 2];
      var vx = p[c] - p[a], vy = p[c + 1] - p[a + 1], vz = p[c + 2] - p[a + 2];
      var nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      var L = Math.hypot(nx, ny, nz) || 1;
      dv.setFloat32(o, nx / L, true); dv.setFloat32(o + 4, ny / L, true); dv.setFloat32(o + 8, nz / L, true);
      dv.setFloat32(o + 12, p[a], true);     dv.setFloat32(o + 16, p[a + 1], true); dv.setFloat32(o + 20, p[a + 2], true);
      dv.setFloat32(o + 24, p[b], true);     dv.setFloat32(o + 28, p[b + 1], true); dv.setFloat32(o + 32, p[b + 2], true);
      dv.setFloat32(o + 36, p[c], true);     dv.setFloat32(o + 40, p[c + 1], true); dv.setFloat32(o + 44, p[c + 2], true);
      o += 50;
    }
  }
  return buf;
}

root.PBM = {
  derive: derive, validate: validate, buildBody: buildBody, buildTray: buildTray,
  nameMesh: nameMesh, flatMesh: flatMesh, fitsTop: fitsTop, flatCorners: flatCorners,
  maskToRects: maskToRects, nameRects: nameRects, mergeArt: mergeArt, toSTL: toSTL,
  fillDepth: fillDepth,
  signedVolume: signedVolume, aOuter: aOuter, clearanceLimit: clearanceLimit,
  Mesh: Mesh
};
})(typeof module !== 'undefined' ? module.exports : window);
