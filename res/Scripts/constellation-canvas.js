/* ============================================================
   星座绘制 Loading —— Canvas 版（浅色治愈系）
   融合：连线渐变光晕、亮星十字光芒、流星、多星座循环、随机介绍
   ============================================================ */

(function() {
  var canvas = document.getElementById("constellationCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var W, H;
  var bgStars = [];
  var BG_STAR_COUNT = 200;

  /* ===== 星座数据（8个经典星座，每个3条介绍） ===== */
  var constellations = [
    {
      name: "URSA MAJOR", nameCN: "大熊座",
      desc: "北斗七星 · 全年可见的导航星座",
      themeColor: [30, 30, 30],
      facts: [
        "北斗七星属于大熊座，是北半球最易辨认的星群",
        "勺口两星连线延长5倍，即可找到北极星",
        "古代航海与旅行者常用北斗来辨别方向"
      ],
      stars: [
        {x:0.15,y:0.43,mag:2.4,color:"#ffffff",label:"天璇"},
        {x:0.2,y:0.28,mag:1.8,color:"#ffffff",label:"天枢"},
        {x:0.42,y:0.48,mag:2.4,color:"#ffffff"},
        {x:0.4,y:0.33,mag:2.4,color:"#ffffff"},
        {x:0.58,y:0.38,mag:1.8,color:"#ffffff",label:"玉衡"},
        {x:0.74,y:0.32,mag:2.2,color:"#ffffff",label:"开阳"},
        {x:0.87,y:0.25,mag:1.9,color:"#ffffff",label:"摇光"}
      ],
      links: [[0,1],[1,3],[3,2],[2,0],[3,4],[4,5],[5,6]],
      pointer: { fromA: 0, fromB: 1, label: "北极星" }
    },
    {
      name: "ORION", nameCN: "猎户座",
      desc: "冬季之王 · 腰带三星最易辨认",
      themeColor: [30, 30, 30],
      facts: [
        "猎户座是冬季夜空中最壮观的星座，腰带三星连成一线",
        "参宿四是红超巨星，参宿七是蓝超巨星，一红一蓝交相辉映",
        "猎户座大星云M42是肉眼可见的恒星诞生区"
      ],
      stars: [
        {x:0.3333,y:0.1333,mag:0.5,color:"#1a1a1a",label:"参宿四"},
        {x:0.6667,y:0.1806,mag:2.0,color:"#ffffff"},
        {x:0.25,y:0.375,mag:2.1,color:"#ffffff"},
        {x:0.7778,y:0.3611,mag:2.2,color:"#444444"},
        {x:0.3889,y:0.4944,mag:2.2,color:"#444444"},
        {x:0.5,y:0.4944,mag:2.2,color:"#444444"},
        {x:0.6111,y:0.4861,mag:2.2,color:"#444444"},
        {x:0.2917,y:0.8056,mag:2.1,color:"#ffffff"},
        {x:0.7083,y:0.8194,mag:0.18,color:"#333333",label:"参宿七"}
      ],
      links: [[0,1],[0,2],[1,3],[2,4],[4,5],[5,6],[3,6],[4,7],[6,8]]
    },
    {
      name: "CASSIOPEIA", nameCN: "仙后座",
      desc: "W 形标志 · 北天拱极星座",
      themeColor: [30, 30, 30],
      facts: [
        "仙后座呈W形，是北天最易辨认的星座之一",
        "仙后座与大熊座隔北极星相望，全年可见",
        "仙后座γ星是著名的变星，亮度会周期性变化"
      ],
      stars: [
        {x:0.125,y:0.4063,mag:2.3,color:"#ffffff",label:"策"},
        {x:0.3125,y:0.5938,mag:2.2,color:"#555555",label:"王良一"},
        {x:0.5,y:0.3594,mag:2.5,color:"#444444"},
        {x:0.6875,y:0.6094,mag:2.7,color:"#ffffff"},
        {x:0.8906,y:0.3906,mag:3.3,color:"#ffffff",label:"阁道二"}
      ],
      links: [[0,1],[1,2],[2,3],[3,4]]
    },
    {
      name: "SCORPIUS", nameCN: "天蝎座",
      desc: "夏季之王 · S 形蝎尾极壮观",
      themeColor: [30, 30, 30],
      facts: [
        "天蝎座是夏季夜空中最壮观的星座，S形蝎尾栩栩如生",
        "心宿二是红超巨星，呈现火红色，古称'大火'",
        "天蝎座尾端的毒钩由几颗亮星组成，极为醒目"
      ],
      stars: [
        {x:0.1563,y:0.1563,mag:2.9,color:"#444444"},
        {x:0.2656,y:0.2031,mag:2.6,color:"#444444"},
        {x:0.3438,y:0.1406,mag:2.9,color:"#444444"},
        {x:0.3125,y:0.2969,mag:0.96,color:"#1a1a1a",label:"心宿二"},
        {x:0.3594,y:0.4063,mag:2.8,color:"#666666"},
        {x:0.375,y:0.5156,mag:2.7,color:"#666666"},
        {x:0.4375,y:0.6094,mag:2.4,color:"#444444"},
        {x:0.5313,y:0.6719,mag:2.7,color:"#666666"},
        {x:0.6563,y:0.7031,mag:2.4,color:"#444444"},
        {x:0.7656,y:0.7656,mag:2.7,color:"#666666"},
        {x:0.8125,y:0.8594,mag:2.7,color:"#666666"},
        {x:0.7813,y:0.9375,mag:2.7,color:"#666666"},
        {x:0.8438,y:0.9063,mag:1.6,color:"#444444",label:"尾宿"}
      ],
      links: [[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]]
    },
    {
      name: "CYGNUS", nameCN: "天鹅座",
      desc: "北十字 · 夏季大三角成员",
      themeColor: [30, 30, 30],
      facts: [
        "天鹅座呈十字形，又称北十字，是夏季大三角成员之一",
        "天津四是全天第19亮星，距离约2600光年",
        "天鹅座位于银河中，是观测星云的好目标"
      ],
      stars: [
        {x:0.5,y:0.125,mag:1.25,color:"#1a1a1a",label:"天津四"},
        {x:0.5,y:0.3438,mag:2.5,color:"#444444"},
        {x:0.5,y:0.5938,mag:2.2,color:"#ffffff"},
        {x:0.5,y:0.8438,mag:3.0,color:"#666666"},
        {x:0.1875,y:0.4531,mag:2.5,color:"#444444"},
        {x:0.8438,y:0.4375,mag:2.5,color:"#444444"}
      ],
      links: [[0,1],[1,2],[2,3],[4,2],[2,5]]
    },
    {
      name: "TAURUS", nameCN: "金牛座",
      desc: "冬季 · V 形牛脸 · 昴星团",
      themeColor: [30, 30, 30],
      facts: [
        "金牛座V形牛脸由毕星团组成，毕宿五是牛的眼睛",
        "昴星团M45是最著名的疏散星团，肉眼可见六七颗星",
        "金牛座是黄道十二宫第二宫，象征稳重与享受"
      ],
      stars: [
        {x:0.4643,y:0.5,mag:0.85,color:"#1a1a1a",label:"毕宿五"},
        {x:0.3571,y:0.3571,mag:2.9,color:"#666666"},
        {x:0.6071,y:0.375,mag:2.9,color:"#666666"},
        {x:0.6071,y:0.5357,mag:3.0,color:"#666666"},
        {x:0.75,y:0.5536,mag:3.4,color:"#666666"},
        {x:0.25,y:0.2857,mag:2.8,color:"#444444"},
        {x:0.6964,y:0.2679,mag:2.8,color:"#444444"}
      ],
      links: [[0,1],[0,2],[0,3],[3,4],[1,5],[2,6]],
      cluster: { x:0.8643, y:0.4286, r:0.05, count:8 }
    },
    {
      name: "LYRA", nameCN: "天琴座",
      desc: "夏季大三角 · 织女星璀璨夺目",
      themeColor: [30, 30, 30],
      facts: [
        "织女星是全天第五亮星，呈蓝白色，曾是北极星",
        "天琴座是夏季大三角成员，与天鹅座、天鹰座相望",
        "天琴座M57环状星云是最著名的行星状星云之一"
      ],
      stars: [
        {x:0.5,y:0.12,mag:0.03,color:"#111111",label:"织女星"},
        {x:0.35,y:0.42,mag:3.3,color:"#666666"},
        {x:0.62,y:0.38,mag:3.5,color:"#666666"},
        {x:0.32,y:0.72,mag:3.2,color:"#666666"},
        {x:0.65,y:0.68,mag:3.4,color:"#666666"}
      ],
      links: [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]]
    },
    {
      name: "CRUX", nameCN: "南十字座",
      desc: "面积最小 · 南半球标志星座",
      themeColor: [30, 30, 30],
      facts: [
        "南十字座是全天88星座中面积最小的星座",
        "十字架二是全天第13亮星，呈蓝白色",
        "南十字座是南半球的标志，北半球大部分地区不可见"
      ],
      stars: [
        {x:0.5,y:0.1875,mag:2.8,color:"#444444"},
        {x:0.5,y:0.7188,mag:0.76,color:"#333333",label:"十字架二"},
        {x:0.2813,y:0.4531,mag:2.8,color:"#444444"},
        {x:0.7344,y:0.4375,mag:1.25,color:"#ffffff",label:"十字架三"},
        {x:0.5469,y:0.4688,mag:3.6,color:"#777777"}
      ],
      links: [[0,1],[2,3]]
    },
    {
      name: "GEMINI", nameCN: "双子座",
      desc: "黄道第三宫 · 双胞胎并肩而立",
      themeColor: [30, 30, 30],
      facts: [
        "双子座两颗最亮星北河二、北河三代表双胞胎",
        "双子座流星雨每年12月出现，是年度三大流星雨之一",
        "北河三是全天第17亮星，呈橙黄色"
      ],
      stars: [
        {x:0.22,y:0.18,mag:1.9,color:"#111111",label:"北河二"},
        {x:0.22,y:0.48,mag:2.9,color:"#444444"},
        {x:0.22,y:0.78,mag:3.1,color:"#555555"},
        {x:0.78,y:0.16,mag:1.14,color:"#111111",label:"北河三"},
        {x:0.78,y:0.46,mag:2.9,color:"#444444"},
        {x:0.78,y:0.76,mag:3.2,color:"#555555"},
        {x:0.5,y:0.32,mag:3.5,color:"#666666"},
        {x:0.5,y:0.62,mag:3.6,color:"#666666"}
      ],
      links: [[0,1],[1,2],[3,4],[4,5],[0,6],[3,6],[1,7],[4,7],[6,7]]
    },
    {
      name: "LEO", nameCN: "狮子座",
      desc: "黄道第五宫 · 镰刀形雄狮",
      themeColor: [30, 30, 30],
      facts: [
        "狮子座轩辕十四是全天第21亮星，呈蓝白色",
        "狮子座流星雨每年11月出现，被誉为流星雨之王",
        "狮子座镰刀形星群是春季夜空最醒目的标志"
      ],
      stars: [
        {x:0.18,y:0.32,mag:2.9,color:"#444444"},
        {x:0.28,y:0.22,mag:2.5,color:"#333333"},
        {x:0.42,y:0.26,mag:3.0,color:"#555555"},
        {x:0.52,y:0.36,mag:2.6,color:"#333333"},
        {x:0.48,y:0.52,mag:1.35,color:"#111111",label:"轩辕十四"},
        {x:0.34,y:0.58,mag:2.5,color:"#444444"},
        {x:0.58,y:0.68,mag:2.4,color:"#333333"},
        {x:0.72,y:0.62,mag:2.6,color:"#444444"}
      ],
      links: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[4,6],[6,7]]
    },
    {
      name: "ANDROMEDA", nameCN: "仙女座",
      desc: "秋季星座 · 仙女座星系闻名",
      themeColor: [30, 30, 30],
      facts: [
        "仙女座星系M31是离银河系最近的大型旋涡星系",
        "仙女座α星壁宿二是秋季四边形的顶点之一",
        "仙女座在希腊神话中是被锁在岩石上的公主"
      ],
      stars: [
        {x:0.12,y:0.32,mag:2.1,color:"#333333"},
        {x:0.28,y:0.4,mag:2.5,color:"#444444"},
        {x:0.48,y:0.46,mag:2.0,color:"#111111",label:"壁宿二"},
        {x:0.68,y:0.4,mag:2.5,color:"#444444"},
        {x:0.85,y:0.3,mag:2.8,color:"#555555"},
        {x:0.48,y:0.62,mag:3.0,color:"#555555"},
        {x:0.62,y:0.72,mag:3.2,color:"#666666"}
      ],
      links: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6]]
    },
    {
      name: "PEGASUS", nameCN: "飞马座",
      desc: "秋季四边形 · 飞马腾空",
      themeColor: [30, 30, 30],
      facts: [
        "飞马座大四边形是秋季夜空最醒目的标志",
        "飞马座在希腊神话中是英雄珀尔修斯的坐骑",
        "飞马座51b是人类发现的第一颗太阳系外行星"
      ],
      stars: [
        {x:0.28,y:0.28,mag:2.4,color:"#333333"},
        {x:0.72,y:0.26,mag:2.5,color:"#333333"},
        {x:0.74,y:0.66,mag:2.4,color:"#333333",label:"壁宿一"},
        {x:0.26,y:0.68,mag:2.8,color:"#444444"},
        {x:0.1,y:0.52,mag:3.0,color:"#555555"},
        {x:0.9,y:0.48,mag:3.2,color:"#666666"}
      ],
      links: [[0,1],[1,2],[2,3],[3,0],[0,4],[1,5]]
    },
    {
      name: "CAPRICORNUS", nameCN: "摩羯座",
      desc: "黄道第十宫 · 海山羊",
      themeColor: [30, 30, 30],
      facts: [
        "摩羯座是黄道十二宫第十宫，象征坚韧与野心",
        "摩羯座形象为海山羊，上身为羊下身为鱼",
        "摩羯座α星是全天第40亮星，距离约39光年"
      ],
      stars: [
        {x:0.28,y:0.32,mag:3.0,color:"#555555"},
        {x:0.46,y:0.26,mag:2.9,color:"#444444"},
        {x:0.62,y:0.36,mag:3.1,color:"#555555"},
        {x:0.58,y:0.52,mag:2.8,color:"#444444"},
        {x:0.42,y:0.58,mag:3.0,color:"#555555"},
        {x:0.28,y:0.52,mag:3.2,color:"#666666"},
        {x:0.18,y:0.42,mag:3.3,color:"#666666"},
        {x:0.68,y:0.68,mag:2.9,color:"#444444"},
        {x:0.78,y:0.78,mag:3.1,color:"#555555"}
      ],
      links: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[3,7],[7,8]]
    }

  ];

  /* ===== 随机打乱星座顺序 ===== */
  for (var i = constellations.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = constellations[i];
    constellations[i] = constellations[j];
    constellations[j] = tmp;
  }

  /* ===== 初始化画布 ===== */
  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  var resizeTimer = null;
  window.addEventListener("resize", function() {
    resizeCanvas();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initBgStars, 200);
  });

  /* ===== 背景星星 ===== */
  function createBgStar() {
    var roll = Math.random();
    var r = 200, g = 200, b = 200;
    if (roll < 0.15) { r = 180; g = 180; b = 180; }
    else if (roll < 0.25) { r = 220; g = 220; b = 220; }
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.3 + 0.4,
      alpha: Math.random() * 0.4 + 0.15,
      twinkleSpeed: Math.random() * 0.025 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      r: r, g: g, b: b
    };
  }
  function initBgStars() {
    bgStars = [];
    for (var i = 0; i < BG_STAR_COUNT; i++) bgStars.push(createBgStar());
  }
  initBgStars();

  /* ===== 状态机 ===== */
  var currentIndex = 0;
  var phase = "drawing"; // drawing | labeling | holding | fading
  var drawProgress = 0;
  var holdTimer = 0;
  var fadeAlpha = 1;
  var labelAlpha = 0;
  var currentFact = "";

  var nameCNEl = document.getElementById("constellationNameCN");
  var nameEl = document.getElementById("constellationName");
  var factEl = document.getElementById("constellationFact");

  function getCurrent() {
    return constellations[currentIndex % constellations.length];
  }

  function toCanvas(star) {
    var scale = Math.min(W, H) * 0.5;
    var ox = (W - scale) / 2;
    var oy = (H - scale) / 2 - 20;
    return { x: ox + star.x * scale, y: oy + star.y * scale };
  }

  /* ===== 绘制背景（浅色治愈系） ===== */
  function drawBackground(t) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
    bgStars.forEach(function(s) {
      var tw = Math.sin(t * s.twinkleSpeed + s.twinklePhase);
      var a = s.alpha * (0.5 + tw * 0.5);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + s.r + "," + s.g + "," + s.b + "," + a + ")";
      ctx.fill();
    });
  }

  /* ===== 绘制星座 ===== */
  function drawConstellation(t, c, progress, alpha, showLabels) {
    var totalSeg = c.links.length;
    var starsDrawn = {};
    var tc = c.themeColor || [100, 160, 230];

    c.links.forEach(function(link, i) {
      var seg = Math.max(0, Math.min(1, progress * totalSeg - i));
      if (seg <= 0) return;
      var from = toCanvas(c.stars[link[0]]);
      var to = toCanvas(c.stars[link[1]]);
      var curX = from.x + (to.x - from.x) * seg;
      var curY = from.y + (to.y - from.y) * seg;

      var lineGrad = ctx.createLinearGradient(from.x, from.y, curX, curY);
      lineGrad.addColorStop(0, "rgba(" + tc[0] + "," + tc[1] + "," + tc[2] + "," + 0.5 * alpha + ")");
      lineGrad.addColorStop(1, "rgba(" + tc[0] + "," + tc[1] + "," + tc[2] + "," + 0.8 * alpha + ")");
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(curX, curY);
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      /* 外发光 */
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(curX, curY);
      ctx.strokeStyle = "rgba(" + tc[0] + "," + tc[1] + "," + tc[2] + "," + 0.1 * alpha + ")";
      ctx.lineWidth = 6;
      ctx.stroke();

      starsDrawn[link[0]] = true;
      if (seg >= 1) starsDrawn[link[1]] = true;

      /* 绘制端点光点 */
      if (seg > 0 && seg < 1) {
        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(30,30,30," + alpha + ")";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(curX, curY, 7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + tc[0] + "," + tc[1] + "," + tc[2] + "," + 0.15 * alpha + ")";
        ctx.fill();
      }
    });

    /* 星团 */
    if (c.cluster && progress > 0.3) {
      var cp = toCanvas(c.cluster);
      var scale = Math.min(W, H) * 0.5;
      var ca = Math.min(1, (progress - 0.3) * 3) * alpha;
      var cr = c.cluster.r * scale;
      for (var k = 0; k < c.cluster.count; k++) {
        var angle = (k / c.cluster.count) * Math.PI * 2 + t * 0.001;
        var dist = cr * (0.3 + (k % 3) * 0.25);
        var sx = cp.x + Math.cos(angle) * dist;
        var sy = cp.y + Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(120,120,120," + 0.5 * ca + ")";
        ctx.fill();
      }
    }

    /* 主星 */
    c.stars.forEach(function(star, i) {
      if (!starsDrawn[i]) return;
      var pos = toCanvas(star);
      var mag = star.mag !== undefined ? star.mag : 3;
      var baseSize = Math.max(1.5, 5.5 - mag * 0.9);
      var pulse = Math.sin(t * 0.025 + i * 1.7) * 0.2 + 1;
      var size = baseSize * pulse;
      var col = star.color || "#ffffff";

      /* 光晕 */
      var glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 6);
      glow.addColorStop(0, hexToRgba(col, 0.35 * alpha));
      glow.addColorStop(0.4, hexToRgba(col, 0.08 * alpha));
      glow.addColorStop(1, hexToRgba(col, 0));
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size * 6, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      /* 亮星十字光芒 */
      if (mag < 2) {
        var sLen = size * 7;
        var sLen2 = size * 4;
        ctx.strokeStyle = hexToRgba(col, 0.2 * alpha);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(pos.x - sLen, pos.y);
        ctx.lineTo(pos.x + sLen, pos.y);
        ctx.moveTo(pos.x, pos.y - sLen);
        ctx.lineTo(pos.x, pos.y + sLen);
        ctx.moveTo(pos.x - sLen2, pos.y - sLen2);
        ctx.lineTo(pos.x + sLen2, pos.y + sLen2);
        ctx.moveTo(pos.x + sLen2, pos.y - sLen2);
        ctx.lineTo(pos.x - sLen2, pos.y + sLen2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(col, alpha);
      ctx.fill();

      if (showLabels && star.label && labelAlpha > 0) {
        ctx.font = '11px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.fillStyle = hexToRgba(col, 0.65 * alpha * labelAlpha);
        ctx.textAlign = "center";
        ctx.fillText(star.label, pos.x, pos.y - size * 5 - 6);
      }
    });

    /* 大熊座北极星指向 */
    if (c.pointer && progress > 0.9) {
      var pa = Math.min(1, (progress - 0.9) * 10) * alpha * 0.4;
      var fromA = toCanvas(c.stars[c.pointer.fromA]);
      var fromB = toCanvas(c.stars[c.pointer.fromB]);
      var dx = fromB.x - fromA.x;
      var dy = fromB.y - fromA.y;
      var len = Math.sqrt(dx * dx + dy * dy);
      var endX = fromB.x + (dx / len) * len * 4;
      var endY = fromB.y + (dy / len) * len * 4;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(fromB.x, fromB.y);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = "rgba(180,150,80," + pa + ")";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(200,170,80," + pa * 1.5 + ")";
      ctx.fill();
      if (showLabels && labelAlpha > 0) {
        ctx.font = '10px "PingFang SC", sans-serif';
        ctx.fillStyle = "rgba(180,150,80," + pa * labelAlpha * 2 + ")";
        ctx.textAlign = "center";
        ctx.fillText("北极星", endX, endY - 10);
      }
    }
  }

  /* ===== 流星 ===== */
  var shootingStars = [];
  function updateShootingStars() {
    if (Math.random() < 0.003) {
      shootingStars.push({
        x: Math.random() * W * 0.8 + W * 0.1,
        y: 0,
        vx: (Math.random() - 0.35) * 6,
        vy: Math.random() * 4 + 3,
        life: 1,
        len: Math.random() * 50 + 30
      });
    }
    shootingStars = shootingStars.filter(function(s) {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.014;
      if (s.life > 0) {
        var tx = s.x - s.vx * (s.len / 8);
        var ty = s.y - s.vy * (s.len / 8);
        var g = ctx.createLinearGradient(tx, ty, s.x, s.y);
        g.addColorStop(0, "rgba(150,180,220,0)");
        g.addColorStop(1, "rgba(150,180,220," + s.life * 0.5 + ")");
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180,200,230," + s.life + ")";
        ctx.fill();
      }
      return s.life > 0;
    });
  }

  function hexToRgba(hex, a) {
    if (hex.indexOf("rgba") === 0 || hex.indexOf("rgb") === 0) {
      return hex.replace(/[\d.]+\)$/, a + ")");
    }
    var c = hex.replace("#", "");
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    var n = parseInt(c, 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ===== 更新文字 ===== */
  function updateText(c) {
    if (nameCNEl) nameCNEl.textContent = c.nameCN;
    if (nameEl) nameEl.textContent = c.name;
    if (factEl) {
      currentFact = c.facts[Math.floor(Math.random() * c.facts.length)];
      factEl.textContent = currentFact;
    }
  }

  /* ===== 主循环 ===== */
  var time = 0;
  var running = true;
  var rafId = null;
  function animate() {
    if (!running) return;
    time++;
    var c = getCurrent();
    drawBackground(time);
    updateShootingStars();

    switch (phase) {
      case "drawing":
        drawProgress += 0.0045;
        drawConstellation(time, c, drawProgress, 1, false);
        if (drawProgress >= 1.05) {
          phase = "labeling";
          labelAlpha = 0;
        }
        break;
      case "labeling":
        labelAlpha = Math.min(1, labelAlpha + 0.02);
        drawConstellation(time, c, 1, 1, true);
        if (labelAlpha >= 1) {
          phase = "holding";
          holdTimer = 0;
        }
        break;
      case "holding":
        drawConstellation(time, c, 1, 1, true);
        holdTimer++;
        if (holdTimer > 150) {
          phase = "fading";
          fadeAlpha = 1;
        }
        break;
      case "fading":
        fadeAlpha -= 0.012;
        labelAlpha = Math.max(0, labelAlpha - 0.025);
        drawConstellation(time, c, 1, Math.max(0, fadeAlpha), true);
        if (fadeAlpha <= 0) {
          phase = "drawing";
          drawProgress = 0;
          labelAlpha = 0;
          currentIndex++;
          updateText(getCurrent());
        }
        break;
    }
    rafId = requestAnimationFrame(animate);
  }

  /* 初始化文字并启动 */
  updateText(getCurrent());
  animate();

  /* 暴露停止/启动方法 */
  window.stopConstellationCanvas = function() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  };
  window.startConstellationCanvas = function() {
    if (running) return;
    running = true;
    animate();
  };
})();
