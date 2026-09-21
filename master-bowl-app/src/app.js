/* ============================== Pet Bowl Master — app ===================== */
(function () {
'use strict';
var G = window.PBM;

/* ------------------------------------------------------------------ i18n */
var STR = {
  en: {
    sub: 'Parametric ant-proof bowl holder · STL generator',
    save: 'Download STL set', saving: 'Building files…',
    preset: 'Preset', bowl: 'Stainless bowl', holder: 'Holder', moat: 'Ant moat',
    handle: 'Side handles', name: 'Name on the rim', logo: 'Logo on the rim', printer: 'Printer',
    bowlD: 'Rim diameter', bowlDepth: 'Bowl depth', holderW: 'Outer width',
    rimHeight: 'Bowl rim height', wall: 'Wall thickness', nSuper: 'Shape',
    moatGap: 'Air gap', trayH: 'Tray height', handles: 'Handle openings', handleLen: 'Length', handleH: 'Height',
    pname: 'Pet name', nfont: 'Lettering', nstyle: 'Relief', nameSize: 'Text height',
    emboss: 'Relief depth', bed: 'Bed size',
    raised: 'Raised letters', recessed: 'Recessed', inlay: 'Flat inlay',
    dStyle: 'Relief', dSize: 'Logo height', dRot: 'Rotation',
    dCombine: 'Share one plaque with the name', dPos: 'Logo position',
    pLeft: 'Left', pRight: 'Right', pAbove: 'Above', pBelow: 'Below',
    layout: 'Layout', curved: 'Curved', flat: 'Flat', nRot: 'Rotation',
    dDrop: 'Drop an SVG here, or click to choose', dClear: 'Remove',
    dRaised: 'Raised', dRecessed: 'Recessed', dInlay: 'Flat inlay',
    presets: ['Cat', 'Puppy', 'Medium dog', 'Large dog'],
    vAll: 'Assembly', vBody: 'Holder', vTray: 'Tray', vBowl: 'Bowl', vWater: 'Water',
    nBowl: 'Measure the <b>outside of the rim</b>. The bowl drops in and lands on its own flank, so a few millimetres out just seats it slightly higher.',
    nName: 'Thai and Latin both work — Thai vowels and tone marks sit above and below the line, so give Thai names a little more text height. <b>Curved</b> follows the rim; <b>Flat</b> lies straight. Drag it on the preview to move it.',
    nLogo: 'Filled shapes only — expand strokes to outlines before exporting. Sharing a plaque, <b>drag the badge</b> and the name and logo move together; on its own, drag the logo. Above and Below stack the two heights on a rim only about 10 mm wide — Left or Right has far more room.',
    moatNote: 'An ant climbing the tray reaches the rim and finds <b>{g} mm of open air</b> in every direction. Ants can’t jump, so that gap is the barrier — and the holder’s underside hugs it exactly, which is why the two parts sit so close.',
    shapeOf: function (n) { return n < 2.6 ? 'round' : n < 3.6 ? 'soft squircle' : n < 4.8 ? 'squircle' : 'boxy'; },
    stHolder: 'W × H', stRim: 'Rim height', stGap: 'Ant gap', stFil: 'Filament',
    spec: {
      a: 'Part A — holder', b: 'Part B — moat tray', moatCap: 'Moat capacity',
      seat: 'Bowl seat Ø', bed: 'Bed fit', orient: 'Print orientation',
      fits: 'fits with {m} mm spare', over: 'TOO BIG by {m} mm',
      aOri: 'inverted, top face down', bOri: 'as exported, floor down',
      est: 'est. filament', notes: '4 walls · 12 % infill · no supports',
      deep: 'of water', trough: 'trough'
    },
    dlOk: 'Saved. Slice Part A upside down.',
    dlNo: 'Downloads aren’t available in this view.',
    dlFail: 'Couldn’t save: '
  },
  th: {
    sub: 'ชามสัตว์เลี้ยงกันมด · สร้างไฟล์ STL',
    save: 'ดาวน์โหลดไฟล์ STL', saving: 'กำลังสร้างไฟล์…',
    preset: 'ขนาดสำเร็จรูป', bowl: 'ชามสเตนเลส', holder: 'ตัวฐาน', moat: 'ร่องน้ำกันมด',
    handle: 'ช่องจับด้านข้าง', name: 'ชื่อบนขอบ', logo: 'โลโก้บนขอบ', printer: 'เครื่องพิมพ์',
    bowlD: 'เส้นผ่าศูนย์กลางปากชาม', bowlDepth: 'ความลึกชาม', holderW: 'ความกว้างฐาน',
    rimHeight: 'ความสูงขอบชาม', wall: 'ความหนาผนัง', nSuper: 'รูปทรง',
    moatGap: 'ระยะช่องว่าง', trayH: 'ความสูงถาด', handles: 'เปิดช่องจับ', handleLen: 'ความยาว', handleH: 'ความสูง',
    pname: 'ชื่อสัตว์เลี้ยง', nfont: 'แบบอักษร', nstyle: 'ลักษณะตัวอักษร', nameSize: 'ความสูงตัวอักษร',
    emboss: 'ความนูน/ลึก', bed: 'ขนาดฐานพิมพ์',
    raised: 'ตัวนูน', recessed: 'ตัวจม', inlay: 'ฝังเรียบ',
    dStyle: 'ลักษณะโลโก้', dSize: 'ความสูงโลโก้', dRot: 'การหมุน',
    dCombine: 'ใช้แผ่นป้ายร่วมกับชื่อ', dPos: 'ตำแหน่งโลโก้',
    pLeft: 'ซ้าย', pRight: 'ขวา', pAbove: 'บน', pBelow: 'ล่าง',
    layout: 'การจัดวาง', curved: 'โค้งตามขอบ', flat: 'แบนราบ', nRot: 'การหมุน',
    dDrop: 'ลากไฟล์ SVG มาวางที่นี่ หรือคลิกเพื่อเลือก', dClear: 'ลบออก',
    dRaised: 'นูน', dRecessed: 'จม', dInlay: 'ฝังเรียบ',
    presets: ['แมว', 'ลูกสุนัข', 'สุนัขกลาง', 'สุนัขใหญ่'],
    vAll: 'ประกอบ', vBody: 'ตัวฐาน', vTray: 'ถาด', vBowl: 'ชาม', vWater: 'น้ำ',
    nBowl: 'วัด<b>ขอบนอกของชาม</b> ชามจะวางลงบนผนังเอียงของตัวมันเอง คลาดเคลื่อนเล็กน้อยแค่ทำให้ชามสูงขึ้นนิดเดียว',
    nName: 'ใช้ได้ทั้งไทยและอังกฤษ — สระและวรรณยุกต์ไทยอยู่บนและล่างบรรทัด จึงควรเพิ่มความสูงตัวอักษรสักหน่อย <b>โค้งตามขอบ</b> จะโค้งไปตามขอบ ส่วน <b>แบนราบ</b> จะวางตรง ลากบนภาพตัวอย่างเพื่อย้ายตำแหน่ง',
    nLogo: 'ใช้รูปทรงทึบเท่านั้น — แปลงเส้น (stroke) ให้เป็นรูปทรงก่อนส่งออก เมื่อใช้แผ่นป้ายร่วมกัน ให้<b>ลากแผ่นป้าย</b> ชื่อและโลโก้จะเลื่อนไปด้วยกัน ถ้าแยกกันให้ลากโลโก้ การวางบนหรือล่างจะบวกความสูงทั้งสองเข้าด้วยกัน แต่ขอบชามกว้างราว 10 มม. เท่านั้น — ซ้ายหรือขวาจึงมีที่มากกว่ามาก',
    moatNote: 'มดที่ไต่ขึ้นถาดจะเจอ<b>ช่องว่าง {g} มม.</b> รอบด้าน มดกระโดดไม่ได้ ช่องว่างนี้จึงเป็นกำแพงกันมด และใต้ตัวฐานถูกออกแบบให้แนบช่องนี้พอดี สองชิ้นจึงชิดกันมาก',
    shapeOf: function (n) { return n < 2.6 ? 'กลม' : n < 3.6 ? 'มนนุ่ม' : n < 4.8 ? 'สี่เหลี่ยมมน' : 'เหลี่ยม'; },
    stHolder: 'กว้าง × สูง', stRim: 'ความสูงขอบ', stGap: 'ช่องกันมด', stFil: 'เส้นพลาสติก',
    spec: {
      a: 'ชิ้น A — ตัวฐาน', b: 'ชิ้น B — ถาดน้ำ', moatCap: 'ความจุร่องน้ำ',
      seat: 'ปากรับชาม Ø', bed: 'พอดีฐานพิมพ์', orient: 'ทิศทางการพิมพ์',
      fits: 'เหลือ {m} มม.', over: 'ใหญ่เกิน {m} มม.',
      aOri: 'คว่ำ เอาหน้าบนลงฐาน', bOri: 'ตามไฟล์ เอาพื้นลงฐาน',
      est: 'ประมาณเส้นพลาสติก', notes: 'ผนัง 4 ชั้น · อินฟิล 12% · ไม่ต้องซัพพอร์ต',
      deep: 'ระดับน้ำ', trough: 'ร่องลึก'
    },
    dlOk: 'บันทึกแล้ว — พิมพ์ชิ้น A แบบคว่ำ',
    dlNo: 'ดาวน์โหลดไม่พร้อมใช้งานในหน้านี้',
    dlFail: 'บันทึกไม่สำเร็จ: '
  }
};
var lang = 'en', T = STR.en;

/* ----------------------------------------------------------------- state */
var S = {
  bowlD: 130, bowlDepth: 45, holderW: 174, rimHeight: 89, moatGap: 11,
  wall: 3.5, nSuper: 4, trayH: 16, handles: true, handleLen: 80, handleH: 26,
  pname: 'โมจิ', nfont: 'Kanit', nstyle: 'raised', nameSize: 8, emboss: 0.8,
  nLayout: 'curved', nTheta: -Math.PI / 2, nR: null, nRot: 0,
  dOn: false, dStyle: 'raised', dSize: 10, dRot: 0, dTheta: 0, dR: null,
  dLayout: 'flat', dCombine: true, dPos: 'left',
  bed: 256, view: 'all', showBowl: true, showWater: true
};
var PRESETS = [
  {bowlD: 110, bowlDepth: 38, holderW: 150, rimHeight: 78, handleLen: 62, handleH: 22, nameSize: 7},
  {bowlD: 130, bowlDepth: 45, holderW: 174, rimHeight: 89, handleLen: 80, handleH: 26, nameSize: 8},
  {bowlD: 150, bowlDepth: 52, holderW: 198, rimHeight: 105, handleLen: 90, handleH: 28, nameSize: 9},
  {bowlD: 180, bowlDepth: 60, holderW: 236, rimHeight: 128, handleLen: 104, handleH: 32, nameSize: 11}
];
var $ = function (id) { return document.getElementById(id); };

/* ------------------------------------------------------------- webgl bit */
var gl = null, prog = null, U = {}, objs = {};
var cam = {yaw: -1.15, pitch: 0.36, dist: 380, tz: 45, zoom: 1, base: 380};

function mul(a, b) {
  var o = new Float32Array(16), i, j, k;
  for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) {
    var s = 0; for (k = 0; k < 4; k++) s += a[k * 4 + j] * b[i * 4 + k];
    o[i * 4 + j] = s;
  }
  return o;
}
function perspective(f, asp, n, fa) {
  var t = 1 / Math.tan(f / 2);
  return new Float32Array([t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, 2 * fa * n / (n - fa), 0]);
}
var FOV = 0.62;
/* Eye and camera axes. viewMat draws with these and camRay picks with them,
   so a pick can never land somewhere the render did not put the pixel. */
function camBasis(dist) {
  var cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
  var cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
  var e = [dist * cp * cy, dist * cp * sy, dist * sp + cam.tz];
  var z = [e[0], e[1], e[2] - cam.tz], L = Math.hypot(z[0], z[1], z[2]) || 1;
  z = [z[0] / L, z[1] / L, z[2] / L];
  var x = [-z[1], z[0], 0];                    // up is +Z, so up × z reduces to this
  L = Math.hypot(x[0], x[1], x[2]) || 1; x = [x[0] / L, x[1] / L, x[2] / L];
  var y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
  return {e: e, x: x, y: y, z: z};
}
/* Narrow windows pull the camera back so the model still fits. */
function effDist(asp) { return cam.dist * (asp < 1.25 ? 1.25 / Math.max(asp, 0.4) : 1); }
function viewMat(dist) {
  var b = camBasis(dist), x = b.x, y = b.y, z = b.z, e = b.e;
  return new Float32Array([
    x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0,
    -(x[0] * e[0] + x[1] * e[1] + x[2] * e[2]),
    -(y[0] * e[0] + y[1] * e[1] + y[2] * e[2]),
    -(z[0] * e[0] + z[1] * e[1] + z[2] * e[2]), 1
  ]);
}

var VS = '#version 300 es\nin vec3 aPos;uniform mat4 uP,uV;out vec3 vP;\
void main(){vec4 p=uV*vec4(aPos,1.0);vP=p.xyz;gl_Position=uP*p;}';
var FS = '#version 300 es\nprecision highp float;in vec3 vP;uniform vec3 uC;uniform float uS,uA;out vec4 o;\
void main(){vec3 n=normalize(cross(dFdx(vP),dFdy(vP)));vec3 v=normalize(-vP);if(dot(n,v)<0.0)n=-n;\
vec3 l1=normalize(vec3(-0.35,0.55,0.75)),l2=normalize(vec3(0.7,-0.4,0.2));\
float d=max(dot(n,l1),0.0)*0.82+max(dot(n,l2),0.0)*0.22;\
vec3 h=normalize(l1+v);float s=pow(max(dot(n,h),0.0),uS)*0.4;\
float f=pow(1.0-max(dot(n,v),0.0),3.0)*0.16;\
o=vec4(uC*(0.24+d)+vec3(s+f),uA);}';

function initGL(cv) {
  gl = cv.getContext('webgl2', {antialias: true, alpha: false, depth: true});
  if (!gl) return false;
  function sh(t, src) {
    var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.bindAttribLocation(prog, 0, 'aPos');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  gl.useProgram(prog);
  U.P = gl.getUniformLocation(prog, 'uP'); U.V = gl.getUniformLocation(prog, 'uV');
  U.C = gl.getUniformLocation(prog, 'uC'); U.S = gl.getUniformLocation(prog, 'uS');
  U.A = gl.getUniformLocation(prog, 'uA');
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
  return true;
}

function upload(key, mesh) {
  var o = objs[key];
  if (!o) { o = objs[key] = {vao: gl.createVertexArray(), vb: gl.createBuffer(), ib: gl.createBuffer()}; }
  gl.bindVertexArray(o.vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, o.vb);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.p), gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, o.ib);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(mesh.f), gl.DYNAMIC_DRAW);
  gl.bindVertexArray(null);
  o.n = mesh.f.length;
}

var colCache = {}, colProbe = null;
function css(v) {
  if (colCache[v]) return colCache[v];
  if (!colProbe) colProbe = document.createElement('canvas').getContext('2d');
  colProbe.fillStyle = '#000';
  colProbe.fillStyle = getComputedStyle(document.body).getPropertyValue(v).trim();
  var c = colProbe.fillStyle;
  return (colCache[v] = [parseInt(c.slice(1, 3), 16) / 255,
                         parseInt(c.slice(3, 5), 16) / 255,
                         parseInt(c.slice(5, 7), 16) / 255]);
}

function draw() {
  if (!gl) return;
  var cv = gl.canvas, dpr = Math.min(devicePixelRatio || 1, 2);
  var w = Math.round(cv.clientWidth * dpr), h = Math.round(cv.clientHeight * dpr);
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
  gl.viewport(0, 0, w, h);
  var bg = css('--well');
  gl.clearColor(bg[0], bg[1], bg[2], 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(prog);
  var asp = w / h;
  gl.uniformMatrix4fv(U.P, false, perspective(FOV, asp, 20, 4000));
  gl.uniformMatrix4fv(U.V, false, viewMat(effDist(asp)));
  var order = [
    ['tray', '--tray-mat', 26, S.view !== 'body'],
    ['body', '--body-mat', 44, S.view !== 'tray'],
    ['name', '--name-mat', 60, S.view !== 'tray'],
    ['decal', '--name-mat', 60, S.view !== 'tray'],
    ['nameInlay', '--inlay-mat', 60, S.view !== 'tray'],
    ['decalInlay', '--inlay-mat', 60, S.view !== 'tray'],
    ['bowl', '--steel', 90, S.showBowl && S.view !== 'tray'],
    ['water', '--accent', 70, S.showWater && S.view !== 'body']
  ];
  /* At a relief depth of 0 the artwork's top face is exactly coplanar with the
     rim, which z-fights. A depth bias lets the art win without moving it — the
     exported geometry stays flush, only the raster order changes. */
  var artKey = {name: 1, decal: 1, nameInlay: 1, decalInlay: 1};
  gl.polygonOffset(-1, -1);
  for (var i = 0; i < order.length; i++) {
    var k = order[i][0], o = objs[k];
    if (!o || !o.n || !order[i][3]) continue;
    if (artKey[k]) gl.enable(gl.POLYGON_OFFSET_FILL); else gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.uniform3fv(U.C, css(order[i][1]));
    gl.uniform1f(U.S, order[i][2]);
    gl.uniform1f(U.A, 1);
    gl.bindVertexArray(o.vao);
    gl.drawElements(gl.TRIANGLES, o.n, gl.UNSIGNED_INT, 0);
  }
  gl.disable(gl.POLYGON_OFFSET_FILL);
  gl.bindVertexArray(null);
}

/* ------------------------------------------------------------- extra art */
function bowlMesh(P) {
  var m = new G.Mesh(), N = 96, i, t;
  var rim = P.bowlD / 2, dep = P.bowlDep, k = P.taper, th = 1.2;
  var prof = [
    {a: rim, z: 0}, {a: rim - k * dep, z: -dep},
    {a: rim - k * dep - th, z: -dep + th}, {a: rim - th, z: -0.6}
  ];
  var M = prof.length;
  for (i = 0; i < N; i++) {
    t = Math.PI * 2 * i / N;
    for (var j = 0; j < M; j++) m.v(prof[j].a * Math.cos(t), prof[j].a * Math.sin(t), prof[j].z);
  }
  var id = function (a, b) { return (a % N) * M + b; };
  for (i = 0; i < N; i++) for (var j2 = 0; j2 < M; j2++) {
    var q = (j2 + 1) % M;
    m.quad(id(i, j2), id(i + 1, j2), id(i + 1, q), id(i, q));
  }
  if (G.signedVolume(m) < 0) for (i = 0; i < m.f.length; i += 3) { var x = m.f[i + 1]; m.f[i + 1] = m.f[i + 2]; m.f[i + 2] = x; }
  return m;
}

function waterMesh(P, depth) {
  var m = new G.Mesh(), N = 128, i;
  var ro = P.trayOutA - P.trayWall - 0.3, ri = P.pedOutA + 0.3;
  var z0 = P.trayFloor - P.pedTopZ, z1 = z0 + depth;
  var n = P.n;
  var sr = function (a, t) { return a / Math.pow(Math.pow(Math.abs(Math.cos(t)), n) + Math.pow(Math.abs(Math.sin(t)), n), 1 / n); };
  for (i = 0; i < N; i++) {
    var t = Math.PI * 2 * i / N;
    var a = sr(ri, t), b = sr(ro, t);
    m.v(a * Math.cos(t), a * Math.sin(t), z0); m.v(b * Math.cos(t), b * Math.sin(t), z0);
    m.v(a * Math.cos(t), a * Math.sin(t), z1); m.v(b * Math.cos(t), b * Math.sin(t), z1);
  }
  var id = function (a, b) { return (a % N) * 4 + b; };
  for (i = 0; i < N; i++) {
    m.quad(id(i, 2), id(i + 1, 2), id(i + 1, 3), id(i, 3));   // top
    m.quad(id(i, 1), id(i + 1, 1), id(i + 1, 3), id(i, 3));   // outer
    m.quad(id(i, 0), id(i, 2), id(i + 1, 2), id(i + 1, 0));   // inner
  }
  return m;
}

/* ------------------------------------------------------------ name plate */
var nameCv = document.createElement('canvas');
function rasterName(text, font, targetH) {
  var big = 220, pad = 60;
  var ctx = nameCv.getContext('2d', {willReadFrequently: true});
  var f = '600 ' + big + 'px "' + font + '", "IBM Plex Sans Thai", sans-serif';
  ctx.font = f;
  var w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  nameCv.width = Math.max(w, 40); nameCv.height = big * 2.2;
  ctx = nameCv.getContext('2d', {willReadFrequently: true});
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, nameCv.width, nameCv.height);
  ctx.font = f; ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, pad, big * 1.45);
  var d = ctx.getImageData(0, 0, nameCv.width, nameCv.height).data;
  var x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, x, y;
  for (y = 0; y < nameCv.height; y++) for (x = 0; x < nameCv.width; x++) {
    if (d[(y * nameCv.width + x) * 4] > 120) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  if (x1 < 0) return null;
  var sw = x1 - x0 + 1, sh = y1 - y0 + 1;
  var H = targetH, W = Math.max(2, Math.round(sw / sh * H));
  var mask = new Uint8Array(W * H);
  for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
    var sx = x0 + Math.floor((x + 0.5) * sw / W), sy = y0 + Math.floor((y + 0.5) * sh / H);
    mask[y * W + x] = d[(sy * nameCv.width + sx) * 4] > 120 ? 1 : 0;
  }
  return {mask: mask, W: W, H: H, aspect: sw / sh};
}

/* ------------------------------------------------------------ svg logo */
/* SVG -> binary mask. The file is drawn through an <img>, never injected into
   the page, so any script inside it stays inert. The threshold is on ALPHA,
   not luminance: logo art is coloured on a transparent ground, and the name
   engraver's luminance test would throw most of it away. */
function rasterSVG(svgText, targetH, rotDeg) {
  return new Promise(function (resolve, reject) {
    var url = URL.createObjectURL(new Blob([svgText], {type: 'image/svg+xml'}));
    var img = new Image();
    var done = function (fn, arg) { URL.revokeObjectURL(url); fn(arg); };
    img.onerror = function () { done(reject, new Error('unreadable')); };
    img.onload = function () {
      var big = 512;
      var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
      if (!iw || !ih) { iw = big; ih = big; }
      var sc = big / Math.max(iw, ih);
      var dw = Math.max(1, Math.round(iw * sc)), dh = Math.max(1, Math.round(ih * sc));
      var rad = (rotDeg || 0) * Math.PI / 180;
      var ca = Math.abs(Math.cos(rad)), sa = Math.abs(Math.sin(rad));
      var CW = Math.ceil(dw * ca + dh * sa), CH = Math.ceil(dw * sa + dh * ca);
      var cv = document.createElement('canvas');
      cv.width = CW; cv.height = CH;
      var ctx = cv.getContext('2d', {willReadFrequently: true});
      ctx.translate(CW / 2, CH / 2); ctx.rotate(rad);
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
      var d;
      try { d = ctx.getImageData(0, 0, CW, CH).data; }
      catch (err) { done(reject, new Error('tainted')); return; }   // external ref
      var x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1, x, y;
      for (y = 0; y < CH; y++) for (x = 0; x < CW; x++) {
        if (d[(y * CW + x) * 4 + 3] > 128) {
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
      if (x1 < 0) { done(resolve, null); return; }                  // nothing opaque
      var sw = x1 - x0 + 1, sh = y1 - y0 + 1;
      var H = targetH, W = Math.max(2, Math.round(sw / sh * H));
      var mask = new Uint8Array(W * H);
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
        var sx = x0 + Math.floor((x + 0.5) * sw / W), sy = y0 + Math.floor((y + 0.5) * sh / H);
        mask[y * W + x] = d[(sy * CW + sx) * 4 + 3] > 128 ? 1 : 0;
      }
      done(resolve, {mask: mask, W: W, H: H, aspect: sw / sh});
    };
    // viewBox-only files have no intrinsic size and would rasterise at 0x0
    var vb = /viewBox\s*=\s*["']\s*[-\d.eE+]+[\s,]+[-\d.eE+]+[\s,]+([-\d.eE+]+)[\s,]+([-\d.eE+]+)/.exec(svgText);
    if (vb) {
      var vw = parseFloat(vb[1]), vh = parseFloat(vb[2]);
      if (vw > 0 && vh > 0) {
        var s0 = 512 / Math.max(vw, vh);
        img.width = Math.max(1, Math.round(vw * s0));
        img.height = Math.max(1, Math.round(vh * s0));
      }
    }
    img.src = url;
  });
}

/* ------------------------------------------------------------ zip writer */
var CRCT = (function () {
  var t = new Uint32Array(256), c, n, k;
  for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
  return t;
})();
function crc32(u8) {
  var c = 0xFFFFFFFF;
  for (var i = 0; i < u8.length; i++) c = CRCT[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function zip(files) {
  var parts = [], central = [], off = 0, i;
  var enc = new TextEncoder();
  for (i = 0; i < files.length; i++) {
    var nm = enc.encode(files[i].name), da = files[i].data, cr = crc32(da);
    var lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0, true);
    lh.setUint16(8, 0, true); lh.setUint16(10, 0, true); lh.setUint16(12, 0, true);
    lh.setUint32(14, cr, true); lh.setUint32(18, da.length, true); lh.setUint32(22, da.length, true);
    lh.setUint16(26, nm.length, true); lh.setUint16(28, 0, true);
    parts.push(new Uint8Array(lh.buffer), nm, da);
    var ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true);
    ch.setUint32(16, cr, true); ch.setUint32(20, da.length, true); ch.setUint32(24, da.length, true);
    ch.setUint16(28, nm.length, true); ch.setUint32(42, off, true);
    central.push(new Uint8Array(ch.buffer), nm);
    off += 30 + nm.length + da.length;
  }
  var cs = 0;
  for (i = 0; i < central.length; i++) cs += central[i].length;
  var eo = new DataView(new ArrayBuffer(22));
  eo.setUint32(0, 0x06054b50, true);
  eo.setUint16(8, files.length, true); eo.setUint16(10, files.length, true);
  eo.setUint32(12, cs, true); eo.setUint32(16, off, true);
  return new Blob(parts.concat(central, [new Uint8Array(eo.buffer)]), {type: 'application/zip'});
}

/* ---------------------------------------------------------------- build */
var P = null, warnings = [], lastName = null, buildTimer = null, seatShrunk = false;
var lastDecal = null, decalSrc = null, decalFile = '';
var nameFoot = null, decalFoot = null, decalShrunk = false, decalThin = 0, decalNote = null;
var artDropped = false;              // place() found no room at all and returned null
var comboCache = null, rectCache = [], decalBakedRot = 0;

/* Intent vs fact. willCombine() deliberately does NOT read lastDecal, so it is
   safe to call from inside the rasteriser that is about to produce lastDecal —
   on a first SVG load lastDecal is still null and a combined()-based rule would
   bake the wrong rotation and only agree with itself on the second load. */
function willCombine() { return S.dCombine && !!decalSrc && !!lastName && !!S.pname.trim(); }
function combined() { return willCombine() && S.dOn && !!lastDecal; }

/* The merged badge raster, memoised. refreshArt() runs on every pointermove
   frame, and mergeArt + artRects per frame would eat the budget. rebuildName
   and rebuildDecal always assign a FRESH object, so object identity already
   encodes text, font, SVG source and baked rotation — nothing to invalidate by
   hand. Style, layout, rotation and position are absent from the key on
   purpose: they are consumed downstream, so the whole drag path is a hit. */
function comboRaster() {
  var c = comboCache;
  if (c && c.n === lastName && c.d === lastDecal &&
      c.nm === S.nameSize && c.dm === S.dSize && c.p === S.dPos) return c.r;
  var r = G.mergeArt(lastName, S.nameSize, lastDecal, S.dSize, S.dPos);
  comboCache = {n: lastName, d: lastDecal, nm: S.nameSize, dm: S.dSize, p: S.dPos, r: r};
  return r;
}

function seArea(a, n) {                      // area of a superellipse, numerically
  var s = 0, N = 512;
  for (var i = 0; i < N; i++) {
    var t = Math.PI * 2 * i / N;
    var r = a / Math.pow(Math.pow(Math.abs(Math.cos(t)), n) + Math.pow(Math.abs(Math.sin(t)), n), 1 / n);
    s += r * r;
  }
  return 0.5 * s * (Math.PI * 2 / N);
}

/* Rect field for one piece of artwork, plus how much larger the padded
   recessed plaque is than the artwork itself. Shared by the name and the
   logo, in both layouts. */
/* Two slots: an uncombined frame asks twice (name, logo), so a single slot
   would thrash to a 0 % hit rate. Safe to share the result — curvedPlace and
   flatPlace copy rects/inlay by reference and artMesh only reads them. */
function artRects(raster, style) {
  for (var i = 0; i < rectCache.length; i++)
    if (rectCache[i].r === raster && rectCache[i].s === style) return rectCache[i].v;
  var v = artRectsCompute(raster, style);
  rectCache.unshift({r: raster, s: style, v: v});
  if (rectCache.length > 2) rectCache.length = 2;
  return v;
}

function artRectsCompute(raster, style) {
  if (style === 'raised')
    return {rects: G.nameRects(raster.mask, raster.W, raster.H, 'raised', 0, 0), sx: 1, sy: 1};
  /* 'recessed' and 'inlay' are the two halves of one padded grid: the plaque
     is the artwork's complement inside it. Recessed ships only the plaque and
     leaves the letters as open gaps; inlay keeps BOTH halves, so they tile the
     same footprint with no overlap and no gap and their top faces land at the
     same z. That exactness is the whole feature — the inlay has to drop into
     the plaque without a boolean anywhere. */
  /* padRef lets a merged badge keep a border proportional to its LETTERING.
     Without it a stacked badge's 147 rows give a 5.7 mm border and push sy from
     1.22 to 1.56 — the difference between a usable badge and a 2.5 mm name.
     Undefined on a plain name/logo raster, so those paths are unchanged. */
  var ref = raster.padRef || raster.H;
  var pad = Math.round(ref * 0.28), rad = Math.round(ref * 0.3);
  var W2 = raster.W + pad * 2, H2 = raster.H + pad * 2;
  var m2 = new Uint8Array(W2 * H2);
  for (var y = 0; y < raster.H; y++) for (var x = 0; x < raster.W; x++)
    m2[(y + pad) * W2 + x + pad] = raster.mask[y * raster.W + x];
  return {rects: G.nameRects(m2, W2, H2, 'recessed', 1, rad),
          inlay: style === 'inlay' ? G.nameRects(m2, W2, H2, 'raised', 0, 0) : null,
          sx: W2 / raster.W, sy: H2 / raster.H};
}

function ringMid(Pp) { return (Pp.seatOpenR + Pp.shellA - Pp.topFill) / 2; }

/* Curved layout: the artwork wraps round the rim as an arc band. */
function curvedPlace(Pp, raster, style, sizeMM, theta, radius) {
  var flatOuter = Pp.shellA - Pp.topFill;
  var room = flatOuter - Pp.seatOpenR - 3;
  if (room < 3) return null;
  var a = artRects(raster, style);
  var bandW = Math.min(sizeMM, room / a.sy);
  var mid = ringMid(Pp);
  /* The radial clamp above used to shrink the artwork silently — only the arc
     clamp set the flag, so a default recessed name was quietly rendered at
     6.4 mm with nothing said. Both report now, and `why` says which. */
  var arc = bandW * raster.aspect, shrunk = bandW < sizeMM - 1e-9, why = shrunk ? 'radial' : '';
  var maxArc = Math.PI * 2 * mid * 0.55;
  if (arc > maxArc) { bandW *= maxArc / arc; arc = maxArc; shrunk = true; why = 'arc'; }
  var bw = bandW * a.sy, ar = arc * a.sx;
  var lo = Pp.seatOpenR + bw / 2 + 1, hi = flatOuter - bw / 2 - 0.5;
  var bandR = (radius === null || lo > hi) ? mid : Math.max(lo, Math.min(hi, radius));
  return {kind: 'arc', rects: a.rects, inlay: a.inlay, thetaC: theta, bandR: bandR, bw: bw, ar: ar,
          sizeMM: bandW, shrunk: shrunk, why: why};
}

/* Flat layout: the artwork lies on the top face undistorted. It can only
   shrink to fit — the face is an annulus, so a straight rectangle runs out of
   room long before an arc band does. */
function flatPlace(Pp, raster, style, sizeMM, theta, radius, userRot) {
  var a = artRects(raster, style);
  var rot = theta + userRot;
  var r = radius === null ? ringMid(Pp) : radius;
  var cx = r * Math.cos(theta), cy = r * Math.sin(theta);
  var h0 = sizeMM * a.sy, w0 = sizeMM * raster.aspect * a.sx;
  var f = 1, shrunk = false;
  if (!G.fitsTop(Pp, cx, cy, w0, h0, rot, 1)) {
    var lo = 0, hi = 1, i;
    for (i = 0; i < 16; i++) {
      var mid = (lo + hi) / 2;
      if (G.fitsTop(Pp, cx, cy, w0 * mid, h0 * mid, rot, 1)) lo = mid; else hi = mid;
    }
    f = lo; shrunk = true;
    if (f < 0.05) return null;                 // nowhere near enough room here
  }
  return {kind: 'flat', rects: a.rects, inlay: a.inlay, cx: cx, cy: cy,
          w: w0 * f, h: h0 * f, rot: rot, sizeMM: sizeMM * f, shrunk: shrunk,
          why: shrunk ? 'flat' : ''};
}

function place(Pp, raster, layout, style, sizeMM, theta, radius, userRot) {
  return layout === 'flat'
    ? flatPlace(Pp, raster, style, sizeMM, theta, radius, userRot)
    : curvedPlace(Pp, raster, style, sizeMM, theta, radius);
}

function artMesh(Pp, pl, rects) {
  var R = rects || pl.rects;
  return pl.kind === 'flat'
    ? G.flatMesh(Pp, R, {cx: pl.cx, cy: pl.cy, w: pl.w, h: pl.h, rot: pl.rot, emboss: S.emboss})
    : G.nameMesh(Pp, R, {bandR: pl.bandR, bandW: pl.bw, arcLen: pl.ar,
                         thetaC: pl.thetaC, emboss: S.emboss});
}

/* Plaque plus, for the inlay style, the artwork that fills its gaps. Both go
   through artMesh with the identical placement, which is what guarantees the
   two halves stay registered however the user drags or rotates the piece. */
function artPair(Pp, pl) {
  return {m: artMesh(Pp, pl), inlay: pl.inlay ? artMesh(Pp, pl, pl.inlay) : null};
}

/* When combined this builds the WHOLE badge — name and logo on one plaque, one
   placement, one relief. decalGeometry then stands down, which is also what
   collapses the drag targeting and the overlap warning (see below). */
function nameGeometry(Pp, seg) {
  seatShrunk = false; nameFoot = null;
  var comb = combined();
  if (comb) decalThin = 0;
  var art = comb ? comboRaster() : ((S.pname.trim() && lastName) ? lastName : null);
  if (!art) return null;
  var pl = place(Pp, art, S.nLayout, S.nstyle, comb ? art.heightMM : S.nameSize,
                 S.nTheta, S.nR, S.nRot * Math.PI / 180);
  if (!pl) { artDropped = true; return null; }
  seatShrunk = pl.shrunk;
  nameFoot = pl;
  if (comb) {
    /* The logo rides the badge, so it inherits the badge's shrink. Audit it at
       its OWN native 72 rows against the mm it actually lands at — more detail
       than the merged grid, and it measures the artwork the user can go and
       fix. Using blocks.b.h rather than S.dSize absorbs the block rounding and
       any resolution cap. Uncombined, this reduces to the original call. */
    var logoMM = art.blocks.b.h * (pl.sizeMM / art.H);
    decalThin = thinFraction(lastDecal.mask, lastDecal.W, lastDecal.H,
                             logoMM / lastDecal.H, 0.8);
  }
  return artPair(Pp, pl);
}

/* Chamfer 3-4 distance to the nearest seed pixel, in thirds of a pixel. */
function distTo(seed, W, H) {
  var N = W * H, d = new Int32Array(N), INF = 1 << 28, i, x, y;
  for (i = 0; i < N; i++) d[i] = seed[i] ? 0 : INF;
  var at = function (xx, yy) { return (xx < 0 || yy < 0 || xx >= W || yy >= H) ? INF : d[yy * W + xx]; };
  for (y = 0; y < H; y++) for (x = 0; x < W; x++)
    d[y * W + x] = Math.min(d[y * W + x], at(x - 1, y) + 3, at(x, y - 1) + 3, at(x - 1, y - 1) + 4, at(x + 1, y - 1) + 4);
  for (y = H - 1; y >= 0; y--) for (x = W - 1; x >= 0; x--)
    d[y * W + x] = Math.min(d[y * W + x], at(x + 1, y) + 3, at(x, y + 1) + 3, at(x + 1, y + 1) + 4, at(x - 1, y + 1) + 4);
  return d;
}

/* How much of the artwork a 0.4 mm nozzle would simply drop, as a fraction of
   its area. This is a morphological opening: erode by the minimum printable
   radius, dilate back, and whatever does not return was too fine to print.
   A plain "thinnest feature" number cannot do this job — every curved edge
   decomposes into one-pixel slivers, and a hairline hanging off a thick blob
   hides behind the thick part. Opening sees both. */
function thinFraction(mask, W, H, mmPerPx, minMM) {
  var r = (minMM / 2) / mmPerPx;                       // inscribed radius needed, px
  if (!(r > 0) || !isFinite(r)) return 0;
  var PW = W + 4, PH = H + 4, N = PW * PH, i, x, y;
  var art = new Uint8Array(N), bg = new Uint8Array(N), total = 0;
  for (y = 0; y < H; y++) for (x = 0; x < W; x++)
    if (mask[y * W + x]) { art[(y + 2) * PW + x + 2] = 1; total++; }
  if (!total) return 0;
  for (i = 0; i < N; i++) bg[i] = art[i] ? 0 : 1;      // pad ring counts as outside
  var din = distTo(bg, PW, PH), core = new Uint8Array(N), any = 0;
  for (i = 0; i < N; i++) if (art[i] && din[i] >= r * 3) { core[i] = 1; any = 1; }
  if (!any) return 1;
  var dout = distTo(core, PW, PH), lost = 0;
  for (i = 0; i < N; i++) if (art[i] && dout[i] > r * 3) lost++;
  return lost / total;
}

function decalGeometry(Pp) {
  decalShrunk = false; decalFoot = null;
  /* ORDER: nameGeometry must run first. When combined it owns decalThin and
     leaves decalFoot null, and that null is what makes clash() return false and
     pickItem() fall through to the name branch — so the badge drags as one
     object with no changes to either of them. */
  if (combined()) return null;
  decalThin = 0;
  if (!S.dOn || !lastDecal) return null;
  var pl = place(Pp, lastDecal, S.dLayout, S.dStyle, S.dSize, S.dTheta, S.dR, S.dRot * Math.PI / 180);
  if (!pl) { artDropped = true; return null; }
  decalShrunk = pl.shrunk;
  decalThin = thinFraction(lastDecal.mask, lastDecal.W, lastDecal.H,
                           pl.sizeMM / lastDecal.H, 0.8);
  decalFoot = pl;
  return artPair(Pp, pl);
}

function wrapPi(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

/* Corners of a footprint of either kind. An arc band is approximated by its
   tangential rectangle; that is rough for a band wrapping a long way round,
   but this only drives an advisory warning. */
function footCorners(f) {
  return f.kind === 'flat'
    ? G.flatCorners(f.cx, f.cy, f.w, f.h, f.rot)
    : G.flatCorners(f.bandR * Math.cos(f.thetaC), f.bandR * Math.sin(f.thetaC),
                    f.ar, f.bw, f.thetaC);
}

/* Separating-axis test between two convex quads. */
function quadsOverlap(A, B) {
  var polys = [A, B], i, j, k;
  for (i = 0; i < 2; i++) {
    var poly = polys[i];
    for (j = 0; j < 4; j++) {
      var p = poly[j], q = poly[(j + 1) % 4];
      var ax = -(q[1] - p[1]), ay = q[0] - p[0];       // edge normal
      var aLo = Infinity, aHi = -Infinity, bLo = Infinity, bHi = -Infinity;
      for (k = 0; k < 4; k++) {
        var da = A[k][0] * ax + A[k][1] * ay;
        var db = B[k][0] * ax + B[k][1] * ay;
        if (da < aLo) aLo = da; if (da > aHi) aHi = da;
        if (db < bLo) bLo = db; if (db > bHi) bHi = db;
      }
      if (aHi < bLo || bHi < aLo) return false;        // a gap: no overlap
    }
  }
  return true;
}

/* Two pieces of artwork that would fuse into one shape when sliced. */
function clash(a, b) {
  if (!a || !b) return false;
  return quadsOverlap(footCorners(a), footCorners(b));
}

function build(seg, withExtras) {
  P = G.derive(S);
  artDropped = false;
  warnings = G.validate(P);
  var body = G.buildBody(P, seg), tray = G.buildTray(P, seg);
  var name = nameGeometry(P, seg);
  var decal = decalGeometry(P);
  return {body: body, tray: tray, name: name, decal: decal};
}

/* Upload one artwork pair, blanking whichever half is not there. The inlay
   rides its own buffer so the viewer can paint it in the second filament. */
function putArt(key, pair, dz) {
  var ik = key + 'Inlay';
  if (pair) upload(key, shiftZ(pair.m, dz)); else if (objs[key]) objs[key].n = 0;
  if (pair && pair.inlay) upload(ik, shiftZ(pair.inlay, dz));
  else if (objs[ik]) objs[ik].n = 0;
}

function shiftZ(m, dz) {
  var o = {p: m.p.slice(), f: m.f};
  for (var i = 2; i < o.p.length; i += 3) o.p[i] += dz;
  return o;
}

/* Drag path: re-sweep just the artwork. A full build() is ~40k triangles and
   makes the drag stutter; name and logo are a few hundred boxes each. */
function refreshArt() {
  if (!P) return;
  artDropped = false;
  var n = nameGeometry(P), d = decalGeometry(P);
  if (!gl) return;
  putArt('name', n, P.pedTopZ);
  putArt('decal', d, P.pedTopZ);
  draw();
}

function refresh(quick) {
  var t0 = performance.now();
  var r = build(quick ? 256 : 512);
  if (gl) {
    var shift = shiftZ;
    upload('body', shift(r.body, P.pedTopZ));
    upload('tray', {p: r.tray.p, f: r.tray.f});
    putArt('name', r.name, P.pedTopZ);
    putArt('decal', r.decal, P.pedTopZ);
    var bm = bowlMesh(P);
    upload('bowl', shift(bm, P.pedTopZ + P.seatLipZ + P.drop));
    upload('water', shift(waterMesh(P, G.fillDepth(P)), P.pedTopZ));
    cam.tz = (P.pedTopZ + P.bodyH) * 0.42;
    cam.base = Math.max(S.holderW, P.pedTopZ + P.bodyH + 50) * 1.95;
    cam.dist = cam.base * cam.zoom;
    draw();
  }
  paintStats(r);
  return performance.now() - t0;
}

/* ---------------------------------------------------------------- stats */
function vol(m) { return G.signedVolume(m) / 1000; }
function fil(cm3) { return Math.round(cm3 * 0.55 * 1.27); }

function paintStats(r) {
  var bodyV = vol(r.body), trayV = vol(r.tray);
  var w = S.holderW, tw = P.trayOutA * 2;
  var total = P.pedTopZ + P.bodyH;
  var gap = S.moatGap;
  var gapFlag = gap >= 9 ? 'ok' : gap >= 7 ? 'warn' : 'crit';
  var over = Math.max(w, tw) - S.bed;
  var chips = [
    ['stHolder', Math.round(w) + ' × ' + Math.round(total), 'mm', ''],
    ['stRim', Math.round(S.rimHeight), 'mm', ''],
    ['stGap', gap.toFixed(1), 'mm', 'flag-' + gapFlag],
    ['stFil', '≈' + (fil(bodyV) + fil(trayV)), 'g', over > 0 ? 'flag-crit' : '']
  ];
  $('readout').innerHTML = chips.map(function (c) {
    return '<div class="stat ' + c[3] + '"><b>' + T[c[0]] + '</b><span>' + c[1] + '<em>' + c[2] + '</em></span></div>';
  }).join('');

  var fd = G.fillDepth(P);
  var moatCap = (seArea(P.trayOutA - P.trayWall, P.n) - seArea(P.pedOutA, P.n)) * fd / 1000;
  var sp = T.spec;
  var bedTxt = over > 0 ? sp.over.replace('{m}', Math.ceil(over)) : sp.fits.replace('{m}', Math.floor(-over));
  var rows = [
    [sp.a, Math.round(w) + ' × ' + Math.round(w) + ' × ' + Math.round(P.bodyH) + ' mm',
     Math.round(bodyV) + ' cm³ · ' + sp.est + ' ≈ ' + fil(bodyV) + ' g'],
    [sp.b, Math.round(tw) + ' × ' + Math.round(tw) + ' × ' + Math.round(P.lipTopZ) + ' mm',
     Math.round(trayV) + ' cm³ · ' + sp.est + ' ≈ ' + fil(trayV) + ' g'],
    [sp.moatCap, Math.round(moatCap) + ' ml', Math.round(fd) + ' mm ' + sp.deep + ' · ' + Math.round(P.trayH - P.trayFloor) + ' mm ' + sp.trough],
    [sp.seat, 'Ø' + Math.round(P.seatOpenR * 2) + ' mm', 'Ø' + Math.round(P.seatLipR * 2) + ' mm seat lip'],
    [sp.bed, bedTxt, S.bed + ' × ' + S.bed + ' mm'],
    [sp.orient, 'A: ' + sp.aOri, 'B: ' + sp.bOri]
  ];
  $('spec').innerHTML = rows.map(function (r2) {
    return '<div><dt>' + r2[0] + '</dt><dd>' + r2[1] + '</dd><dd><small>' + r2[2] + '</small></dd></div>';
  }).join('');

  var al = warnings.map(function (x) { return {c: 'crit', m: x.m}; });
  if (over > 0) al.push({c: 'crit', m: 'Wider than the ' + S.bed + ' mm bed by ' + Math.ceil(over) + ' mm.'});
  if (artDropped) al.push({c: 'crit', m: 'There is no room on the rim for the artwork at that size and position, so it was left off entirely. Make it smaller, or drag it somewhere wider.'});
  if (seatShrunk && nameFoot) {
    var what = combined() ? 'The badge' : 'The name';
    al.push({c: 'warn', m:
      nameFoot.why === 'flat'
        ? what + ' was scaled down to fit the flat area — the top face curves away, so a straight block runs out of room. Drag it to a corner for more space.'
      : nameFoot.why === 'arc'
        ? what + ' was shortened to fit the rim — it now wraps just over half way round.'
        : what + ' is taller than the ' + (P.shellA - P.topFill - P.seatOpenR).toFixed(0) + ' mm rim band, so the whole thing was scaled down.' +
          (combined() && (S.dPos === 'above' || S.dPos === 'below')
            ? ' Stacking the logo above or below adds both heights together — try Left or Right.'
            : ' Lower the text or logo height.')});
  }
  if (S.nameSize < 6 && S.pname.trim()) al.push({c: 'warn', m: 'Under 6 mm tall, fine strokes may not print cleanly at 0.4 mm nozzle.'});
  if (S.emboss < 0.2 && (S.pname.trim() || (S.dOn && lastDecal))) {
    var flushStyle = combined() ? S.nstyle : (S.pname.trim() ? S.nstyle : S.dStyle);
    al.push(flushStyle === 'inlay'
      ? {c: 'ok', m: 'Dead flush with the rim — no bump at all. The artwork is still a separate solid in inlay.stl, so assigning it a second filament is what makes it visible. This is Flat inlay doing exactly what it is for.'}
      : {c: 'warn', m: 'At this depth the artwork is level with the rim, so it merges into the holder and will not be visible at all. Switch the relief to Flat inlay to keep it as a flush second colour, or raise the depth above 0.2 mm.'});
  }
  if (decalNote) al.push({c: 'crit', m: decalNote});
  if (decalShrunk) al.push({c: 'warn', m: S.dLayout === 'flat'
    ? 'Logo scaled down to fit the flat area. The rim is widest at the corners — drag it there for more room.'
    : 'Logo narrowed to fit the rim — it now wraps just over half way round.'});
  if (decalThin > 0.015) al.push({c: 'warn', m: Math.round(decalThin * 100) +
    '% of the logo is finer than 0.8 mm — a 0.4 mm nozzle will drop those parts. ' +
    (combined() ? 'Raise Logo height (the name gives up room for it) or thicken the artwork.'
                : 'Scale it up or thicken the artwork.')});
  if (clash(nameFoot, decalFoot)) al.push({c: 'warn', m: 'The logo overlaps the name — they will fuse into one shape. Drag the logo clear of the front.'});
  if (gap < 8) al.push({c: 'warn', m: gap.toFixed(1) + ' mm stops small house ants but a large carpenter ant could bridge it.'});
  /* Once the badge is rim-limited the two sliders stop meaning millimetres and
     start meaning a ratio — the total is pinned to the rim band. Show what each
     piece actually lands at so that is legible instead of baffling. */
  if (combined() && seatShrunk && nameFoot) {
    var cr = comboRaster(), k = nameFoot.sizeMM / cr.heightMM;
    $('o-nameSize').textContent = S.nameSize.toFixed(1) + ' → ' + (S.nameSize * k).toFixed(1) + ' mm';
    $('o-dSize').textContent = S.dSize.toFixed(1) + ' → ' + (S.dSize * k).toFixed(1) + ' mm';
  }
  $('alerts').innerHTML = al.map(function (a) {
    return '<div class="alert ' + a.c + '"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 4.6v4M8 11.2v.1"/><circle cx="8" cy="8" r="6.4"/></svg><span>' + a.m + '</span></div>';
  }).join('');

  $('n-moat').innerHTML = T.moatNote.replace('{g}', gap.toFixed(1));
}

/* ------------------------------------------------------------------ i18n */
function applyLang() {
  T = STR[lang];
  document.documentElement.lang = lang === 'th' ? 'th' : 'en';
  $('sub').textContent = T.sub;
  $('save-t').textContent = T.save;
  var map = {
    'g-preset-t': 'preset', 'g-bowl-t': 'bowl', 'g-holder-t': 'holder', 'g-moat-t': 'moat',
    'g-handle-t': 'handle', 'g-name-t': 'name', 'g-logo-t': 'logo', 'g-print-t': 'printer',
    'l-bowlD': 'bowlD', 'l-bowlDepth': 'bowlDepth', 'l-holderW': 'holderW',
    'l-rimHeight': 'rimHeight', 'l-wall': 'wall', 'l-nSuper': 'nSuper', 'l-moatGap': 'moatGap',
    'l-trayH': 'trayH', 'l-handles': 'handles', 'l-handleLen': 'handleLen', 'l-handleH': 'handleH',
    'l-pname': 'pname', 'l-nfont': 'nfont', 'l-nstyle': 'nstyle',
    'l-nameSize': 'nameSize', 'l-emboss': 'emboss', 'l-bed': 'bed',
    'l-dStyle': 'dStyle', 'l-dSize': 'dSize', 'l-dRot': 'dRot',
    'l-dCombine': 'dCombine', 'l-dPos': 'dPos',
    'l-nLayout': 'layout', 'l-dLayout': 'layout', 'l-nRot': 'nRot'
  };
  for (var k in map) if ($(k)) $(k).textContent = T[map[k]];
  $('n-bowl').innerHTML = T.nBowl;
  $('n-name').innerHTML = T.nName;
  $('n-logo').innerHTML = T.nLogo;
  $('ns-raised').textContent = T.raised;
  $('ns-recessed').textContent = T.recessed;
  $('ns-inlay').textContent = T.inlay;
  $('d-drop-t').textContent = T.dDrop;
  $('dclear').textContent = T.dClear;
  $('ds-raised').textContent = T.dRaised;
  $('ds-recessed').textContent = T.dRecessed;
  $('ds-inlay').textContent = T.dInlay;
  $('dp-left').textContent = T.pLeft;
  $('dp-right').textContent = T.pRight;
  $('dp-above').textContent = T.pAbove;
  $('dp-below').textContent = T.pBelow;
  $('nl-curved').textContent = T.curved; $('nl-flat').textContent = T.flat;
  $('dl-curved').textContent = T.curved; $('dl-flat').textContent = T.flat;
  $('v-all').textContent = T.vAll; $('v-body').textContent = T.vBody; $('v-tray').textContent = T.vTray;
  $('v-bowl').textContent = T.vBowl; $('v-water').textContent = T.vWater;
  $('presets').innerHTML = T.presets.map(function (p, i) {
    return '<button data-i="' + i + '" aria-pressed="false">' + p + '</button>';
  }).join('');
  wirePresets();
  Array.prototype.forEach.call($('presets').children, function (b) {
    b.setAttribute('aria-pressed', String(PRESETS[+b.dataset.i].bowlD === S.bowlD &&
                                          PRESETS[+b.dataset.i].holderW === S.holderW));
  });
  syncOutputs();
  if (P) paintStats(build(256));
}

function syncOutputs() {
  var f1 = function (v) { return v.toFixed(1); };
  $('o-bowlD').textContent = S.bowlD + ' mm';
  $('o-bowlDepth').textContent = S.bowlDepth + ' mm';
  $('o-holderW').textContent = S.holderW + ' mm';
  $('o-rimHeight').textContent = S.rimHeight + ' mm';
  $('o-wall').textContent = f1(S.wall) + ' mm';
  $('o-nSuper').textContent = T.shapeOf(S.nSuper);
  $('o-moatGap').textContent = f1(S.moatGap) + ' mm';
  $('o-trayH').textContent = S.trayH + ' mm';
  $('o-handleLen').textContent = S.handleLen + ' mm';
  $('o-handleH').textContent = S.handleH + ' mm';
  $('o-nameSize').textContent = f1(S.nameSize) + ' mm';
  $('o-emboss').textContent = f1(S.emboss) + ' mm';
  $('o-dSize').textContent = f1(S.dSize) + ' mm';
  $('o-dRot').textContent = Math.round(S.dRot) + '°';
  $('o-nRot').textContent = Math.round(S.nRot) + '°';
}

/* ----------------------------------------------------------------- wiring */
function wirePresets() {
  Array.prototype.forEach.call($('presets').children, function (b) {
    b.onclick = function () {
      var p = PRESETS[+b.dataset.i];
      for (var k in p) S[k] = p[k];
      ['bowlD', 'bowlDepth', 'holderW', 'rimHeight', 'handleLen', 'handleH', 'nameSize'].forEach(function (k) {
        $(k).value = S[k];
      });
      Array.prototype.forEach.call($('presets').children, function (x) { x.setAttribute('aria-pressed', x === b); });
      syncOutputs(); schedule(false);
    };
  });
}

function schedule(quick) {
  clearTimeout(buildTimer);
  buildTimer = setTimeout(function () { refresh(quick); }, quick ? 16 : 60);
}

function slider(id, key, quick) {
  var el = $(id);
  el.value = S[key];
  el.addEventListener('input', function () {
    S[key] = parseFloat(el.value);
    syncOutputs();
    schedule(true);
  });
  el.addEventListener('change', function () { schedule(false); });
}

function pillGroup(id, key, after) {
  var g = $(id);
  Array.prototype.forEach.call(g.children, function (b) {
    b.setAttribute('aria-pressed', b.dataset.v === S[key]);
    b.onclick = function () {
      S[key] = b.dataset.v;
      Array.prototype.forEach.call(g.children, function (x) { x.setAttribute('aria-pressed', x === b); });
      if (after) after(); else schedule(false);
    };
  });
}

function toggle(id, key, after) {
  var b = $(id);
  b.onclick = function () {
    S[key] = !S[key];
    b.setAttribute('aria-pressed', String(S[key]));
    if (after) after(); else draw();
  };
}

function viewBtns() {
  var m = {'v-all': 'all', 'v-body': 'body', 'v-tray': 'tray'};
  Object.keys(m).forEach(function (id) {
    $(id).onclick = function () {
      S.view = m[id];
      Object.keys(m).forEach(function (j) { $(j).setAttribute('aria-pressed', String(j === id)); });
      draw();
    };
  });
  toggle('v-bowl', 'showBowl');
  toggle('v-water', 'showWater');
}

/* World-space ray through a canvas point, matching what draw() rendered. */
function camRay(cv, clientX, clientY) {
  var rc = cv.getBoundingClientRect();
  if (!rc.width || !rc.height) return null;
  var asp = cv.width / cv.height;
  var nx = (clientX - rc.left) / rc.width * 2 - 1;
  var ny = 1 - (clientY - rc.top) / rc.height * 2;
  var b = camBasis(effDist(asp)), t = Math.tan(FOV / 2), d = [], i;
  for (i = 0; i < 3; i++) d[i] = -b.z[i] + b.x[i] * nx * t * asp + b.y[i] * ny * t;
  var L = Math.hypot(d[0], d[1], d[2]) || 1;
  return {o: b.e, d: [d[0] / L, d[1] / L, d[2] / L]};
}

/* The top face is one flat plane, so placing the logo is a ray/plane hit —
   no mesh picking needed. Returns the polar position on that face. */
function pickTop(cv, clientX, clientY) {
  if (!P || !gl) return null;
  var r = camRay(cv, clientX, clientY);
  if (!r || Math.abs(r.d[2]) < 1e-6) return null;
  var t = (P.pedTopZ + P.bodyH - r.o[2]) / r.d[2];
  if (t <= 0) return null;
  var wx = r.o[0] + r.d[0] * t, wy = r.o[1] + r.d[1] * t;
  return {th: Math.atan2(wy, wx), r: Math.hypot(wx, wy)};
}

/* Is a point on the top face inside this footprint? Slack of 2 mm makes
   small artwork practical to grab. */
function overFoot(f, hit) {
  if (!f || !hit) return false;
  var SL = 2;
  if (f.kind === 'flat') {
    var x = hit.r * Math.cos(hit.th) - f.cx, y = hit.r * Math.sin(hit.th) - f.cy;
    var u = x * -Math.sin(f.rot) + y * Math.cos(f.rot);
    var v = x * Math.cos(f.rot) + y * Math.sin(f.rot);
    return Math.abs(u) <= f.w / 2 + SL && Math.abs(v) <= f.h / 2 + SL;
  }
  return Math.abs(wrapPi(hit.th - f.thetaC) * f.bandR) <= f.ar / 2 + SL &&
         Math.abs(hit.r - f.bandR) <= f.bw / 2 + SL;
}

/* Which piece of artwork is under the cursor. The logo wins a tie: it is the
   thing users place deliberately, and the name has a home position. */
function pickItem(hit) {
  if (!hit) return null;
  if (S.dOn && overFoot(decalFoot, hit)) return 'decal';
  if (S.pname.trim() && overFoot(nameFoot, hit)) return 'name';
  return null;
}

function orbit(cv) {
  var down = false, lx = 0, ly = 0, pts = {}, dragging = null;
  cv.addEventListener('pointerdown', function (e) {
    cv.setPointerCapture(e.pointerId); pts[e.pointerId] = [e.clientX, e.clientY];
    down = true; lx = e.clientX; ly = e.clientY;
    dragging = pickItem(pickTop(cv, e.clientX, e.clientY));
    cv.classList.toggle('grabbing', !!dragging);
  });
  cv.addEventListener('pointermove', function (e) {
    if (!down) { cv.classList.toggle('on-decal', !!pickItem(pickTop(cv, e.clientX, e.clientY))); return; }
    var ids = Object.keys(pts);
    pts[e.pointerId] = [e.clientX, e.clientY];
    if (ids.length >= 2) {
      var a = pts[ids[0]], b = pts[ids[1]];
      var d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (orbit.pd) { cam.zoom = Math.max(0.45, Math.min(2.6, cam.zoom * orbit.pd / d)); cam.dist = cam.base * cam.zoom; }
      orbit.pd = d; draw(); return;
    }
    if (dragging) {
      var hit = pickTop(cv, e.clientX, e.clientY);
      if (hit) {
        if (dragging === 'name') { S.nTheta = hit.th; S.nR = hit.r; }
        else { S.dTheta = hit.th; S.dR = hit.r; }
        refreshArt();
      }
      lx = e.clientX; ly = e.clientY; return;
    }
    cam.yaw -= (e.clientX - lx) * 0.008;
    cam.pitch = Math.max(-0.2, Math.min(1.45, cam.pitch + (e.clientY - ly) * 0.006));
    lx = e.clientX; ly = e.clientY; draw();
  });
  function up(e) {
    if (dragging) schedule(false);              // settle the stats after a drag
    down = false; dragging = null;
    cv.classList.remove('grabbing');
    delete pts[e.pointerId]; orbit.pd = 0;
  }
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', function (e) {
    e.preventDefault();
    cam.zoom = Math.max(0.45, Math.min(2.6, cam.zoom * (1 + Math.sign(e.deltaY) * 0.1)));
    cam.dist = cam.base * cam.zoom;
    draw();
  }, {passive: false});
}

/* ------------------------------------------------------------------ save */
var dl = null;
var standalone = !(window.claude && window.claude.use);
if (standalone) {
  // running as a local file: hand the browser a normal download instead
  dl = {save: function (req) {
    var url = URL.createObjectURL(req.data instanceof Blob ? req.data : new Blob([req.data]));
    var a = document.createElement('a');
    a.href = url; a.download = req.filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    return Promise.resolve({status: 'saved'});
  }};
} else {
  window.claude.use('downloads').then(function (d) {
    dl = d;
    if (!d) { $('save').disabled = true; $('save-t').textContent = STR[lang].dlNo; }
  });
}

function notes() {
  var L = [];
  L.push('PET BOWL MASTER — ' + (S.pname.trim() || 'unnamed') + '');
  L.push('generated ' + new Date().toISOString().slice(0, 10));
  L.push('');
  L.push('FITS A STAINLESS BOWL');
  L.push('  rim diameter      ' + S.bowlD + ' mm (outside of the rim)');
  L.push('  depth             ' + S.bowlDepth + ' mm');
  L.push('');
  L.push('PARTS');
  L.push('  body.stl   Part A — holder    ' + Math.round(S.holderW) + ' x ' + Math.round(S.holderW) + ' x ' + Math.round(P.bodyH) + ' mm');
  L.push('  tray.stl   Part B — moat tray ' + Math.round(P.trayOutA * 2) + ' x ' + Math.round(P.trayOutA * 2) + ' x ' + Math.round(P.lipTopZ) + ' mm');
  if (anyInlay())
    L.push('  inlay.stl  second-colour artwork for Part A — see FLAT INLAY');
  L.push('  bowl rim sits ' + S.rimHeight + ' mm above the floor');
  L.push('  tray height ' + S.trayH + ' mm, trough ' + (S.trayH - 2.6).toFixed(1) + ' mm deep');
  L.push('');
  L.push('ANT MOAT');
  L.push('  air gap           ' + S.moatGap.toFixed(1) + ' mm from the tray rim to any part of the holder.');
  L.push('  Ants cannot jump, so that gap is the barrier. It only works while');
  L.push('  the trough holds water — check it weekly in dry season.');
  L.push('  Lift Part A straight off to fill and clean.');
  L.push('');
  L.push('PRINTING — no supports on either part');
  L.push('  Part A   INVERTED, top face on the bed. Walls then lean inward,');
  L.push('           the seat chamfer is 45 deg, the handle arches self-bridge.');
  L.push('           0.2 mm layers, 4 walls, 12-15 % infill.');
  L.push('  Part B   as exported, floor down.');
  L.push('           0.2 mm layers, 4 walls, 12 bottom layers so the trough');
  L.push('           floor is watertight, 15 % infill, 5 mm brim.');
  L.push('');
  L.push('  Material PETG or ASA for Part B — it holds standing water and PLA');
  L.push('           creeps over months. Part A can be PLA indoors.');
  L.push('           Print the two in contrasting colours.');
  if (combined()) {
    var cart = comboRaster(), ck = nameFoot ? nameFoot.sizeMM / cart.heightMM : 1;
    L.push('  Badge    ' + styleWord(S.nstyle) + depthWord() +
           ' — the name and the logo share ONE plaque,');
    L.push('           ' + (S.nLayout === 'flat' ? 'laid flat' : 'wrapped round the rim') +
           ', logo ' + posWord(S.dPos) + ' the name, from ' + (decalFile || 'an SVG') + '.');
    L.push('           Asked for ' + S.nameSize.toFixed(1) + ' mm text / ' + S.dSize.toFixed(1) +
           ' mm logo; lands at ' + (S.nameSize * ck).toFixed(1) + ' / ' +
           (S.dSize * ck).toFixed(1) + ' mm after fitting the rim.');
    if (S.nstyle === 'inlay')
      L.push('           Second colour comes from inlay.stl — see FLAT INLAY below.');
    else
      L.push('           One filament change at that layer colours the whole badge.');
    if (decalThin > 0.01)
      L.push('           ' + Math.round(decalThin * 100) + ' % of the logo is finer than 0.8 mm and may not print.');
    L.push('           The badge ships as separate closed solids sitting in the rim.');
    L.push('           Every one is watertight; your slicer unions them on load.');
    L.push('           If it offers to "repair", you can say no.');
  } else if (S.pname.trim() && lastName) {
    L.push('  Name     ' + styleWord(S.nstyle) + depthWord() + '.');
    if (S.nstyle === 'inlay') {
      L.push('           Second colour comes from inlay.stl — see FLAT INLAY below.');
    } else {
      L.push('           A filament colour change at that layer gives two-tone');
      L.push('           lettering.');
    }
    L.push('           The lettering ships as separate closed solids sitting in the');
    L.push('           rim, so body.stl holds the holder plus one solid per letter');
    L.push('           stroke. Every one is watertight; your slicer unions them on');
    L.push('           load. If it offers to "repair", you can say no.');
  }
  if (S.dOn && lastDecal && !combined()) {
    L.push('  Logo     ' + styleWord(S.dStyle) + depthWord() + ', ' + S.dSize.toFixed(1) + ' mm tall, ' +
           (S.dLayout === 'flat' ? 'laid flat' : 'wrapped round the rim') + ', from');
    L.push('           ' + (decalFile || 'an SVG') + '. Same relief height as the name.');
    if (S.dStyle === 'inlay')
      L.push('           Second colour comes from inlay.stl — see FLAT INLAY below.');
    else if (S.nstyle !== 'inlay')
      L.push('           One filament change colours it and the name together.');
    if (decalThin > 0.01)
      L.push('           ' + Math.round(decalThin * 100) + ' % of it is finer than 0.8 mm and may not print.');
  }
  if (anyInlay()) {
    L.push('');
    L.push('FLAT INLAY');
    L.push('  The artwork is level with the plaque around it — no bump to catch');
    L.push('  dirt, and the colour edge is the artwork outline itself.');
    if (S.emboss < 0.05) {
      L.push('');
      L.push('  Relief depth is 0, so the plaque is level with the RIM as well —');
      L.push('  the whole badge is flush and the rim stays one smooth surface.');
      L.push('  Nothing stands proud at all; the marking is purely a colour');
      L.push('  change. The solids are still 0.6 mm thick, they just sit down');
      L.push('  inside the rim instead of on top of it, which is enough depth');
      L.push('  for the second filament to cover cleanly.');
    }
    L.push('');
    L.push('  That needs TWO filaments in one layer, so it cannot be done with a');
    L.push('  plain colour change at a layer — a change recolours the whole');
    L.push('  layer. inlay.stl is a separate part instead:');
    L.push('');
    L.push('    1. Load body.stl.');
    L.push('    2. Right-click it and add inlay.stl as a PART of that object');
    L.push('       (PrusaSlicer: Add part > Load; Bambu/Orca: Add part > Load).');
    L.push('       It lands in the right place — both files share one origin,');
    L.push('       so do NOT re-centre or move it.');
    L.push('    3. Assign the part your second filament.');
    L.push('');
    L.push('  The two never overlap: the plaque in body.stl is exactly the');
    L.push('  complement of the artwork, so they tile the same patch of rim');
    L.push('  with no gap and no double-extrusion. Tops land at one height.');
    L.push('');
    L.push('  Single extruder, no MMU/AMS? Print inlay.stl on its own in the');
    L.push('  second colour and glue it into the recess — same fit.');
  }
  L.push('');
  L.push('  All food and water stays in the stainless insert. Printed plastic');
  L.push('  never touches what the animal eats.');
  L.push('');
  L.push('SETTINGS USED');
  ['bowlD', 'bowlDepth', 'holderW', 'rimHeight', 'wall', 'nSuper', 'moatGap', 'trayH',
   'handles', 'handleLen', 'handleH', 'pname', 'nfont', 'nstyle', 'nameSize', 'emboss',
   'nLayout', 'nRot', 'dOn', 'dCombine', 'dPos', 'dLayout', 'dStyle', 'dSize', 'dRot'
  ].forEach(function (k) { L.push('  ' + (k + '                ').slice(0, 14) + ' ' + S[k]); });
  L.push('  ' + ('nPos            ').slice(0, 14) + ' ' + Math.round(S.nTheta * 180 / Math.PI) +
         ' deg, r ' + (S.nR === null ? 'auto' : S.nR.toFixed(1)));
  if (S.dOn && !combined())
    L.push('  ' + ('dPosAt          ').slice(0, 14) + ' ' + Math.round(S.dTheta * 180 / Math.PI) +
           ' deg, r ' + (S.dR === null ? 'auto' : S.dR.toFixed(1)));
  if (S.dOn) L.push('  ' + ('dFile           ').slice(0, 14) + ' ' + (decalFile || '(unnamed)'));
  return L.join('\n');
}

/* At a depth of 0 the artwork is level with the rim, so "0.0 mm deep" reads
   like a mistake. Say what it actually is. */
function depthWord() {
  return S.emboss < 0.05 ? 'flush with the top rim — level, no bump'
                         : S.emboss.toFixed(1) + ' mm on the top rim';
}

function styleWord(v) {
  return v === 'raised' ? 'raised ' : v === 'inlay' ? 'flat-inlaid ' : 'recessed ';
}

function posWord(v) {
  return v === 'left' ? 'left of' : v === 'right' ? 'right of' : v === 'above' ? 'above' : 'below';
}

function anyInlay() {
  /* Combined, the badge's relief is the NAME's; a stale S.dStyle must not make
     the notes promise an inlay.stl that the zip does not contain. */
  if (combined()) return S.nstyle === 'inlay';
  return (S.nstyle === 'inlay' && S.pname.trim() && lastName) ||
         (S.dStyle === 'inlay' && S.dOn && lastDecal);
}

function slug(s) {
  return (s || 'pet').trim().replace(/\s+/g, '-').replace(/[^\w฀-๿-]/g, '').slice(0, 24) || 'pet';
}

$('save').onclick = function () {
  if (!dl) return;
  var btn = $('save'), old = $('save-t').textContent;
  btn.disabled = true; $('save-t').textContent = T.saving;
  setTimeout(function () {
    try {
      var r = build(640);
      var bodyMeshes = [r.body], inlayMeshes = [];
      [r.name, r.decal].forEach(function (a) {
        if (!a) return;
        bodyMeshes.push(a.m);
        if (a.inlay) inlayMeshes.push(a.inlay);
      });
      var files = [
        {name: 'body.stl', data: new Uint8Array(G.toSTL(bodyMeshes))},
        {name: 'tray.stl', data: new Uint8Array(G.toSTL([r.tray]))},
        {name: 'print-notes.txt', data: new TextEncoder().encode(notes())}
      ];
      /* The inlay is a separate FILE, not another solid in body.stl. Anything
         inside body.stl gets unioned into one colour on load, which is exactly
         what the inlay must not be. */
      if (inlayMeshes.length)
        files.splice(1, 0, {name: 'inlay.stl', data: new Uint8Array(G.toSTL(inlayMeshes))});
      var blob = zip(files);
      dl.save({filename: 'pet-bowl-master-' + slug(S.pname) + '.zip', data: blob})
        .then(function () { flash(T.dlOk, 'ok'); })
        .catch(function (e) { if (e && e.code !== 'declined') flash(T.dlFail + (e.message || e.code), 'crit'); })
        .then(function () { btn.disabled = false; $('save-t').textContent = old; });
    } catch (err) {
      flash(T.dlFail + err.message, 'crit');
      btn.disabled = false; $('save-t').textContent = old;
    }
  }, 30);
};

function flash(msg, kind) {
  var d = document.createElement('div');
  d.className = 'alert ' + (kind === 'crit' ? 'crit' : '');
  d.innerHTML = '<span>' + msg + '</span>';
  $('alerts').prepend(d);
  setTimeout(function () { d.remove(); }, 6000);
}

/* ------------------------------------------------------------------ boot */
function boot() {
  var cv = $('gl');
  try { initGL(cv); } catch (e) { gl = null; }
  if (!gl) $('spin').textContent = 'This browser has no WebGL2 — the 3D preview is off, downloads still work.';
  applyLang();
  orbit(cv);
  viewBtns();
  ['bowlD', 'bowlDepth', 'holderW', 'rimHeight', 'wall', 'nSuper', 'moatGap', 'trayH', 'handleLen', 'handleH',
   'nameSize', 'emboss'].forEach(function (k) { slider(k, k); });
  $('handles').checked = S.handles;
  $('handles').onchange = function () { S.handles = $('handles').checked; schedule(false); };
  $('bed').value = S.bed;
  $('bed').onchange = function () { S.bed = +$('bed').value; refresh(true); };
  $('pname').value = S.pname;
  $('pname').addEventListener('input', function () {
    S.pname = $('pname').value;
    rebuildName();
  });
  pillGroup('nfont', 'nfont', rebuildName);
  pillGroup('nstyle', 'nstyle', function () { schedule(false); });
  pillGroup('nlayout', 'nLayout', function () { syncLayoutUI(); schedule(false); });
  $('nRot').value = S.nRot;
  $('nRot').addEventListener('input', function () {
    S.nRot = +$('nRot').value; syncOutputs(); refreshArt();
  });
  $('nRot').addEventListener('change', function () { schedule(false); });
  wireDecal(cv);
  syncLayoutUI();
  $('lang-en').onclick = function () { setLang('en'); };
  $('lang-th').onclick = function () { setLang('th'); };
  new ResizeObserver(draw).observe(cv);
  matchMedia('(prefers-color-scheme:dark)').addEventListener('change', function () { colCache = {}; draw(); });
  rebuildName();
}

function setLang(l) {
  lang = l;
  $('lang-en').setAttribute('aria-pressed', String(l === 'en'));
  $('lang-th').setAttribute('aria-pressed', String(l === 'th'));
  applyLang();
  schedule(false);
}

function rebuildName() {
  var txt = S.pname.trim();
  /* Emptying or filling the name flips willCombine(), which changes what the
     logo should have baked into it — with combine on and layout curved, typing
     the first letter has to un-bake a rotation the standalone logo was carrying. */
  if (!txt) { lastName = null; syncDecalUI(); syncDecalRaster(); return; }
  var fam = S.nfont;
  var go = function () {
    lastName = rasterName(txt, fam, 56);
    syncDecalUI();
    syncDecalRaster();
  };
  if (document.fonts && document.fonts.load) {
    document.fonts.load('600 220px "' + fam + '"', txt).then(go, go);
  } else go();
}

function syncLayoutUI() {
  $('nctl').hidden = S.nLayout !== 'flat';   // rotation is meaningless when curved
}

function syncDecalUI() {
  var has = !!(S.dOn && lastDecal), comb = combined();
  $('dhas').hidden = !has;
  $('dctl').hidden = !has;
  /* Effective state, not S.dCombine: clearing the name un-combines the logo, so
     its own controls must come back rather than stranding it with everything
     that governs it hidden. */
  $('dpos-f').hidden = !comb;
  $('dsolo').hidden = comb;
  $('dname').textContent = decalFile || '';
}

function clearDecal() {
  decalSrc = null; decalFile = ''; lastDecal = null; S.dOn = false;
  S.dTheta = 0; S.dR = null;
  decalSay(null);
  syncDecalUI();
}

/* paintStats rewrites #alerts on every rebuild, so a flash() would vanish a
   frame later. Anything about the logo belongs in the alert list instead. */
function decalSay(msg) {
  decalNote = msg || null;
  schedule(false);
}

function loadSVGFile(file) {
  if (!file) return;
  if (!/svg/i.test(file.type || '') && !/\.svg$/i.test(file.name || '')) {
    decalSay('That is not an SVG file.'); return;
  }
  if (file.size > 2e6) { decalSay('That SVG is over 2 MB — simplify it before importing.'); return; }
  file.text().then(function (txt) {
    decalSrc = txt; decalFile = file.name || 'logo.svg';
    return rebuildDecal();
  }).catch(function (e) { decalError(e); });
}

function decalError(e) {
  decalSrc = null; lastDecal = null; S.dOn = false; syncDecalUI();
  decalSay(e && e.message === 'tainted'
    ? 'That SVG pulls in an external image, so the browser will not let the app read the pixels. Export it as plain paths with the artwork embedded.'
    : 'Could not read that SVG.');
}

/* Curved standalone bakes the logo's rotation into the pixels, because
   curvedPlace has no rotation parameter. Inside a badge the whole plaque is
   bent or rotated as one and S.dRot is hidden, so bake nothing. */
function bakeRot() { return (willCombine() || S.dLayout === 'flat') ? 0 : S.dRot; }

/* Re-rasterise only when the baked angle would actually change. Everything that
   can move bakeRot() routes through here so no caller has to reason about it. */
function syncDecalRaster() {
  if (decalSrc && decalBakedRot !== bakeRot()) return rebuildDecal();
  schedule(false);
  return Promise.resolve();
}

function rebuildDecal() {
  if (!decalSrc) { lastDecal = null; S.dOn = false; syncDecalUI(); decalSay(null); return Promise.resolve(); }
  var rot = bakeRot();
  decalBakedRot = rot;
  return rasterSVG(decalSrc, 72, rot).then(function (r) {
    lastDecal = r;
    S.dOn = !!r;
    syncDecalUI();
    decalSay(r ? null : 'That SVG came out empty — nothing in it is filled, so there is nothing to emboss.');
  }, decalError);
}

function wireDecal(cv) {
  var dz = $('ddrop'), fi = $('dfile');
  dz.onclick = function () { fi.click(); };
  dz.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fi.click(); } };
  fi.addEventListener('change', function () { loadSVGFile(fi.files && fi.files[0]); fi.value = ''; });
  $('dclear').onclick = clearDecal;

  var drop = function (e) {
    e.preventDefault(); dz.classList.remove('over');
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) loadSVGFile(f);
  };
  [dz, cv].forEach(function (el) {
    el.addEventListener('dragover', function (e) { e.preventDefault(); dz.classList.add('over'); });
    el.addEventListener('dragleave', function () { dz.classList.remove('over'); });
    el.addEventListener('drop', drop);
  });
  // a file dropped anywhere else would navigate away from the app
  window.addEventListener('dragover', function (e) { e.preventDefault(); });
  window.addEventListener('drop', function (e) { e.preventDefault(); });

  $('dCombine').checked = S.dCombine;
  $('dCombine').onchange = function () {
    S.dCombine = $('dCombine').checked;
    syncDecalUI();
    syncDecalRaster();         // un-bakes dRot when joining a badge, re-bakes on leaving
  };
  pillGroup('dpos', 'dPos', function () { schedule(false); });
  pillGroup('dstyle', 'dStyle', function () { schedule(false); });
  pillGroup('dlayout', 'dLayout', function () {
    syncLayoutUI();
    syncDecalRaster();         // rotation is baked into the raster only when curved
  });
  slider('dSize', 'dSize');
  /* Flat mode rotates the placement, so it can follow the slider live. Curved
     mode has no rotation parameter, so it has to re-rasterise on release. */
  $('dRot').value = S.dRot;
  $('dRot').addEventListener('input', function () {
    S.dRot = +$('dRot').value; syncOutputs();
    if (S.dLayout === 'flat') refreshArt();
  });
  $('dRot').addEventListener('change', function () {
    if (S.dLayout === 'flat') schedule(false); else syncDecalRaster();
  });
  syncDecalUI();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
