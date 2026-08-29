/* ============================================================
   星座连线 Loading 动画 —— 极简黑白版
   纯白背景 + 黑色圆点 + 黑色直线，无任何发光/渐变/阴影
   ============================================================ */
(function() {
  var canvas = document.getElementById("constellationCanvas");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");

  var W, H;
  var rafId = null;
  var stopped = false;

  /* ===== 13个星座数据 ===== */
  var constellations = [
    {
      name: "URSA MAJOR", nameCN: "大熊座",
      desc: "北斗七星 · 全年可见的导航星座",
      facts: ["北斗七星勺口两颗星延长5倍即北极星", "大熊座是北天最大的星座之一", "玉衡是北斗七星中最亮的一颗"],
      stars: [
        {x:0.15,y:0.43,mag:2.4,label:"天璇"},
        {x:0.2,y:0.28,mag:1.8,label:"天枢"},
        {x:0.42,y:0.48,mag:2.4},
        {x:0.4,y:0.33,mag:2.4},
        {x:0.58,y:0.38,mag:1.8,label:"玉衡"},
        {x:0.74,y:0.32,mag:2.2,label:"开阳"},
        {x:0.87,y:0.25,mag:1.9,label:"摇光"}
      ],
      links: [[0,1],[1,3],[3,2],[2,0],[3,4],[4,5],[5,6]]
    },
    {
      name: "ORION", nameCN: "猎户座",
      desc: "冬季之王 · 腰带三星最易辨认",
      facts: ["参宿四是红超巨星，直径是太阳的1000倍", "猎户座大星云M42是肉眼可见的星云", "参宿七是全天第7亮星"],
      stars: [
        {x:0.3333,y:0.1333,mag:0.5,label:"参宿四"},
        {x:0.6667,y:0.1806,mag:2.0},
        {x:0.25,y:0.375,mag:2.1},
        {x:0.7778,y:0.3611,mag:2.2},
        {x:0.3889,y:0.4944,mag:2.2},
        {x:0.5,y:0.4944,mag:2.2},
        {x:0.6111,y:0.4861,mag:2.2},
        {x:0.2917,y:0.8056,mag:2.1},
        {x:0.7083,y:0.8194,mag:0.18,label:"参宿七"}
      ],
      links: [[0,1],[0,2],[1,3],[2,4],[4,5],[5,6],[3,6],[4,7],[6,8]]
    },
    {
      name: "CASSIOPEIA", nameCN: "仙后座",
      desc: "W 形标志 · 北天拱极星座",
      facts: ["仙后座呈W形，与北斗七星隔北极星相对", "仙后座是埃塞俄比亚王后卡西欧佩亚", "拱极星座全年可见"],
      stars: [
        {x:0.125,y:0.4063,mag:2.3,label:"策"},
        {x:0.3125,y:0.5938,mag:2.2,label:"王良一"},
        {x:0.5,y:0.3594,mag:2.5},
        {x:0.6875,y:0.6094,mag:2.7},
        {x:0.8906,y:0.3906,mag:3.3,label:"阁道二"}
      ],
      links: [[0,1],[1,2],[2,3],[3,4]]
    },
    {
      name: "SCORPIUS", nameCN: "天蝎座",
      desc: "夏季之王 · S 形蝎尾极壮观",
      facts: ["心宿二是红超巨星，被称为火星的敌手", "天蝎座是黄道十二宫第八宫", "蝎尾毒钩由三颗星组成"],
      stars: [
        {x:0.1563,y:0.1563,mag:2.9},
        {x:0.2656,y:0.2031,mag:2.6},
        {x:0.3438,y:0.1406,mag:2.9},
        {x:0.3125,y:0.2969,mag:0.96,label:"心宿二"},
        {x:0.3594,y:0.4063,mag:2.8},
        {x:0.375,y:0.5156,mag:2.7},
        {x:0.4375,y:0.6094,mag:2.4},
        {x:0.5313,y:0.6719,mag:2.7},
        {x:0.6563,y:0.7031,mag:2.4},
        {x:0.7656,y:0.7656,mag:2.7},
        {x:0.8125,y:0.8594,mag:2.7},
        {x:0.7813,y:0.9375,mag:2.7},
        {x:0.8438,y:0.9063,mag:1.6,label:"尾宿"}
      ],
      links: [[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]]
    },
    {
      name: "CYGNUS", nameCN: "天鹅座",
      desc: "北十字 · 夏季大三角成员",
      facts: ["天津四是全天第19亮星，距离约2600光年", "天鹅座呈十字形，又称北十字", "是夏季大三角的顶点之一"],
      stars: [
        {x:0.5,y:0.125,mag:1.25,label:"天津四"},
        {x:0.5,y:0.3438,mag:2.5},
        {x:0.5,y:0.5938,mag:2.2},
        {x:0.5,y:0.8438,mag:3.0},
        {x:0.1875,y:0.4531,mag:2.5},
        {x:0.8438,y:0.4375,mag:2.5}
      ],
      links: [[0,1],[1,2],[2,3],[4,2],[2,5]]
    },
    {
      name: "TAURUS", nameCN: "金牛座",
      desc: "冬季 · V 形牛脸 · 昴星团",
      facts: ["毕宿五是红巨星，呈橙红色", "昴星团M45是肉眼可见的疏散星团", "金牛座是黄道十二宫第二宫"],
      stars: [
        {x:0.4643,y:0.5,mag:0.85,label:"毕宿五"},
        {x:0.3571,y:0.3571,mag:2.9},
        {x:0.6071,y:0.375,mag:2.9},
        {x:0.6071,y:0.5357,mag:3.0},
        {x:0.75,y:0.5536,mag:3.4},
        {x:0.25,y:0.2857,mag:2.8},
        {x:0.6964,y:0.2679,mag:2.8}
      ],
      links: [[0,1],[0,2],[0,3],[3,4],[1,5],[2,6]]
    },
    {
      name: "LYRA", nameCN: "天琴座",
      desc: "夏季大三角 · 织女星璀璨夺目",
      facts: ["织女星是全天第5亮星，曾是北极星", "天琴座M57是著名的环状星云", "织女星是夏季大三角的顶点之一"],
      stars: [
        {x:0.5,y:0.12,mag:0.03,label:"织女星"},
        {x:0.35,y:0.42,mag:3.3},
        {x:0.62,y:0.38,mag:3.5},
        {x:0.32,y:0.72,mag:3.2},
        {x:0.65,y:0.68,mag:3.4}
      ],
      links: [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]]
    },
    {
      name: "CRUX", nameCN: "南十字座",
      desc: "面积最小 · 南半球标志星座",
      facts: ["南十字座是全天面积最小的星座", "十字架二是全天第13亮星", "南半球航海的重要导航标志"],
      stars: [
        {x:0.5,y:0.1875,mag:2.8},
        {x:0.5,y:0.7188,mag:0.76,label:"十字架二"},
        {x:0.2813,y:0.4531,mag:2.8},
        {x:0.7344,y:0.4375,mag:1.25,label:"十字架三"},
        {x:0.5469,y:0.4688,mag:3.6}
      ],
      links: [[0,1],[2,3]]
    },
    {
      name: "GEMINI", nameCN: "双子座",
      desc: "黄道第三宫 · 双胞胎并肩而立",
      facts: ["北河二、北河三代表双胞胎", "双子座流星雨每年12月出现", "北河三是全天第17亮星"],
      stars: [
        {x:0.22,y:0.18,mag:1.9,label:"北河二"},
        {x:0.22,y:0.48,mag:2.9},
        {x:0.22,y:0.78,mag:3.1},
        {x:0.78,y:0.16,mag:1.14,label:"北河三"},
        {x:0.78,y:0.46,mag:2.9},
        {x:0.78,y:0.76,mag:3.2},
        {x:0.5,y:0.32,mag:3.5},
        {x:0.5,y:0.62,mag:3.6}
      ],
      links: [[0,1],[1,2],[3,4],[4,5],[0,6],[3,6],[1,7],[4,7],[6,7]]
    },
    {
      name: "LEO", nameCN: "狮子座",
      desc: "黄道第五宫 · 镰刀形雄狮",
      facts: ["轩辕十四是全天第21亮星", "狮子座流星雨被誉为流星雨之王", "镰刀形星群是春季夜空标志"],
      stars: [
        {x:0.18,y:0.32,mag:2.9},
        {x:0.28,y:0.22,mag:2.5},
        {x:0.42,y:0.26,mag:3.0},
        {x:0.52,y:0.36,mag:2.6},
        {x:0.48,y:0.52,mag:1.35,label:"轩辕十四"},
        {x:0.34,y:0.58,mag:2.5},
        {x:0.58,y:0.68,mag:2.4},
        {x:0.72,y:0.62,mag:2.6}
      ],
      links: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[4,6],[6,7]]
    },
    {
      name: "ANDROMEDA", nameCN: "仙女座",
      desc: "秋季星座 · 仙女座星系闻名",
      facts: ["仙女座星系M31离银河系最近", "壁宿二是秋季四边形顶点", "希腊神话中被锁在岩石上的公主"],
      stars: [
        {x:0.12,y:0.32,mag:2.1},
        {x:0.28,y:0.4,mag:2.5},
        {x:0.48,y:0.46,mag:2.0,label:"壁宿二"},
        {x:0.68,y:0.4,mag:2.5},
        {x:0.85,y:0.3,mag:2.8},
        {x:0.48,y:0.62,mag:3.0},
        {x:0.62,y:0.72,mag:3.2}
      ],
      links: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6]]
    },
    {
      name: "PEGASUS", nameCN: "飞马座",
      desc: "秋季四边形 · 飞马腾空",
      facts: ["飞马座大四边形是秋季夜空标志", "希腊神话中英雄珀尔修斯的坐骑", "飞马座51b是首颗系外行星"],
      stars: [
        {x:0.28,y:0.28,mag:2.4},
        {x:0.72,y:0.26,mag:2.5},
        {x:0.74,y:0.66,mag:2.4,label:"壁宿一"},
        {x:0.26,y:0.68,mag:2.8},
        {x:0.1,y:0.52,mag:3.0},
        {x:0.9,y:0.48,mag:3.2}
      ],
      links: [[0,1],[1,2],[2,3],[3,0],[0,4],[1,5]]
    },
    {
      name: "CAPRICORNUS", nameCN: "摩羯座",
      desc: "黄道第十宫 · 海山羊",
      facts: ["摩羯座象征坚韧与野心", "形象为海山羊，上羊下鱼", "摩羯座α星距离约39光年"],
      stars: [
        {x:0.28,y:0.32,mag:3.0},
        {x:0.46,y:0.26,mag:2.9},
        {x:0.62,y:0.36,mag:3.1},
        {x:0.58,y:0.52,mag:2.8},
        {x:0.42,y:0.58,mag:3.0},
        {x:0.28,y:0.52,mag:3.2},
        {x:0.18,y:0.42,mag:3.3},
        {x:0.68,y:0.68,mag:2.9},
        {x:0.78,y:0.78,mag:3.1}
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

  /* ===== Canvas 初始化（DPR高清支持） ===== */
  function resizeCanvas() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resizeCanvas();
  var resizeTimer = null;
  window.addEventListener("resize", function() {
    resizeCanvas();
  });

  /* ===== 状态 ===== */
  var currentIndex = 0;
  var phase = "drawing"; // drawing | labeling | holding | fading
  var drawProgress = 0;
  var holdTimer = 0;
  var fadeAlpha = 1;
  var labelAlpha = 0;
  var time = 0;

  var nameEl = document.getElementById("constellationName");
  var nameCNEl = document.getElementById("constellationNameCN");
  var descEl = document.getElementById("constellationFact");

  function getCurrent() {
    return constellations[currentIndex % constellations.length];
  }

  /* 归一化坐标转Canvas坐标 */
  function toCanvas(star) {
    var scale = Math.min(W, H) * 0.5;
    var ox = (W - scale) / 2;
    var oy = (H - scale) / 2;
    return { x: ox + star.x * scale, y: oy + star.y * scale };
  }

  /* ===== 绘制：纯白背景 ===== */
  function drawBackground() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);
  }

  /* ===== 绘制星座：黑色直线 + 黑色圆点 ===== */
  function drawConstellation(c, progress, alpha, showLabels) {
    var totalSeg = c.links.length;
    var starsDrawn = {};

    /* 计算星座中心，用于标签定位（标签放在外侧，避免与连线重合） */
    var cx = 0, cy = 0;
    c.stars.forEach(function(s) { cx += s.x; cy += s.y; });
    cx /= c.stars.length;
    cy /= c.stars.length;

    /* 连线：纯黑色直线，逐段绘制 */
    c.links.forEach(function(link, i) {
      var seg = Math.max(0, Math.min(1, progress * totalSeg - i));
      if (seg <= 0) return;

      var from = toCanvas(c.stars[link[0]]);
      var to = toCanvas(c.stars[link[1]]);
      var curX = from.x + (to.x - from.x) * seg;
      var curY = from.y + (to.y - from.y) * seg;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(curX, curY);
      ctx.strokeStyle = "rgba(0,0,0," + (0.85 * alpha) + ")";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      starsDrawn[link[0]] = true;
      if (seg >= 1) starsDrawn[link[1]] = true;

      /* 绘制中的移动点：纯黑小圆点 */
      if (seg > 0 && seg < 1) {
        ctx.beginPath();
        ctx.arc(curX, curY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
        ctx.fill();
      }
    });

    /* 主星：纯黑色圆点，无任何发光/阴影 */
    c.stars.forEach(function(star, i) {
      if (!starsDrawn[i]) return;
      var pos = toCanvas(star);
      var mag = star.mag !== undefined ? star.mag : 3;
      var size = Math.max(1.5, 5.5 - mag * 0.9);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
      ctx.fill();

      /* 星名标签：放在星座外侧，避免与连线重合 */
      if (showLabels && star.label && labelAlpha > 0) {
        ctx.font = '11px "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.fillStyle = "rgba(0,0,0," + (0.65 * alpha * labelAlpha) + ")";
        /* 计算从中心到该星的方向，标签放在远离中心的一侧 */
        var dx = star.x - cx;
        var dy = star.y - cy;
        var labelX, labelY, align;
        if (Math.abs(dy) > Math.abs(dx)) {
          /* 垂直方向为主：标签在上或下 */
          if (dy < 0) {
            /* 星在中心上方，标签放更上方 */
            labelX = pos.x;
            labelY = pos.y - size - 8;
            align = "center";
          } else {
            /* 星在中心下方，标签放更下方 */
            labelX = pos.x;
            labelY = pos.y + size + 12;
            align = "center";
          }
        } else {
          /* 水平方向为主：标签在左或右 */
          if (dx < 0) {
            /* 星在中心左侧，标签放更左侧 */
            labelX = pos.x - size - 8;
            labelY = pos.y + 4;
            align = "right";
          } else {
            /* 星在中心右侧，标签放更右侧 */
            labelX = pos.x + size + 8;
            labelY = pos.y + 4;
            align = "left";
          }
        }
        /* 边界保护：如果标签超出画布，换到另一侧 */
        var textWidth = ctx.measureText(star.label).width;
        if (align === "left" && labelX + textWidth > W - 10) {
          labelX = pos.x - size - 8;
          align = "right";
        } else if (align === "right" && labelX - textWidth < 10) {
          labelX = pos.x + size + 8;
          align = "left";
        }
        if (align === "center" && labelY < 15) {
          labelY = pos.y + size + 12;
        } else if (align === "center" && labelY > H - 10) {
          labelY = pos.y - size - 8;
        }
        ctx.textAlign = align;
        ctx.fillText(star.label, labelX, labelY);
      }
    });
  }

  /* ===== 动画循环 ===== */
  function animate() {
    if (stopped) return;
    time++;
    var c = getCurrent();

    drawBackground();

    switch (phase) {
      case "drawing":
        drawProgress += 0.004;
        drawConstellation(c, drawProgress, 1, false);
        if (drawProgress >= 1.05) {
          phase = "labeling";
          labelAlpha = 0;
        }
        break;

      case "labeling":
        labelAlpha = Math.min(1, labelAlpha + 0.02);
        drawConstellation(c, 1, 1, true);
        if (labelAlpha >= 1) {
          phase = "holding";
          holdTimer = 0;
        }
        break;

      case "holding":
        drawConstellation(c, 1, 1, true);
        holdTimer++;
        if (holdTimer > 160) {
          phase = "fading";
          fadeAlpha = 1;
        }
        break;

      case "fading":
        fadeAlpha -= 0.012;
        labelAlpha = Math.max(0, labelAlpha - 0.025);
        drawConstellation(c, 1, Math.max(0, fadeAlpha), true);
        if (fadeAlpha <= 0) {
          phase = "drawing";
          drawProgress = 0;
          labelAlpha = 0;
          currentIndex++;
          var next = getCurrent();
          /* 随机选一条介绍 */
          var fact = next.facts[Math.floor(Math.random() * next.facts.length)];
          nameCNEl.style.opacity = "0";
          nameEl.style.opacity = "0";
          descEl.style.opacity = "0";
          setTimeout(function() {
            nameCNEl.textContent = next.nameCN;
            nameEl.textContent = next.name;
            descEl.textContent = fact;
            nameCNEl.style.opacity = "";
            nameEl.style.opacity = "";
            descEl.style.opacity = "";
          }, 300);
        }
        break;
    }

    rafId = requestAnimationFrame(animate);
  }

  /* 初始化文字 */
  var first = getCurrent();
  var firstFact = first.facts[Math.floor(Math.random() * first.facts.length)];
  if (nameCNEl) nameCNEl.textContent = first.nameCN;
  if (nameEl) nameEl.textContent = first.name;
  if (descEl) descEl.textContent = firstFact;

  animate();

  /* ===== 对外停止接口 ===== */
  window.stopConstellationCanvas = function() {
    stopped = true;
    if (rafId) cancelAnimationFrame(rafId);
  };
})();
