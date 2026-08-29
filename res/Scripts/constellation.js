/* ============================================================
   星座绘制 Loading —— 多星座数据与循环渲染
   ============================================================ */

const CONSTELLATIONS = [
  {
    name: "北斗七星",
    stars: [
      {x:30,y:55},{x:58,y:46},{x:85,y:49},{x:112,y:54},
      {x:138,y:66},{x:132,y:88},{x:105,y:92}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
    facts: [
      "北斗七星属于大熊座，是北半球最易辨认的星群",
      "勺口两星连线延长5倍，即可找到北极星",
      "古代航海与旅行者常用北斗来辨别方向"
    ]
  },
  {
    name: "摩羯座",
    stars: [
      {x:50,y:42},{x:72,y:36},{x:92,y:42},{x:102,y:58},
      {x:88,y:74},{x:66,y:70},{x:54,y:56}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]],
    facts: [
      "摩羯座是黄道十二宫第十宫，象征坚韧与野心",
      "摩羯座形象为海山羊，上身为羊下身为鱼",
      "摩羯座α星是全天第40亮星，距地约39光年"
    ]
  },
  {
    name: "水瓶座",
    stars: [
      {x:58,y:38},{x:78,y:32},{x:98,y:38},{x:108,y:54},
      {x:94,y:70},{x:74,y:68},{x:58,y:54}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],
    facts: [
      "水瓶座是黄道十二宫第十一宫，象征创新与独立",
      "水瓶座形象为持水者，倾倒生命之水",
      "水瓶座最亮星是虚宿一，距离约540光年"
    ]
  },
  {
    name: "双鱼座",
    stars: [
      {x:42,y:52},{x:58,y:42},{x:74,y:52},{x:90,y:60},
      {x:106,y:52},{x:122,y:42},{x:138,y:52},{x:90,y:78}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[3,7]],
    facts: [
      "双鱼座是黄道十二宫第十二宫，象征感性与共情",
      "双鱼座形象为两条被丝带相连的鱼",
      "春分点当前位于双鱼座附近，是天文重要标记"
    ]
  },
  {
    name: "白羊座",
    stars: [
      {x:68,y:48},{x:84,y:38},{x:100,y:48},{x:96,y:66},
      {x:80,y:72},{x:68,y:62}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
    facts: [
      "白羊座是黄道十二宫第一宫，象征勇气与开始",
      "白羊座最亮星是娄宿三，距离约66光年",
      "白羊座形象为公羊，金色羊毛是希腊神话宝物"
    ]
  },
  {
    name: "金牛座",
    stars: [
      {x:56,y:52},{x:72,y:42},{x:88,y:46},{x:104,y:42},
      {x:120,y:52},{x:98,y:66},{x:78,y:66}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,0]],
    facts: [
      "金牛座是黄道十二宫第二宫，象征稳重与享受",
      "金牛座包含昴星团，是最著名的疏散星团之一",
      "金牛座α星毕宿五是全天第14亮星，呈橙红色"
    ]
  },
  {
    name: "双子座",
    stars: [
      {x:58,y:36},{x:74,y:36},{x:58,y:72},{x:74,y:72},
      {x:98,y:36},{x:114,y:36},{x:98,y:72},{x:114,y:72}
    ],
    lines: [[0,1],[0,2],[1,3],[2,3],[4,5],[4,6],[5,7],[6,7],[1,4],[3,6]],
    facts: [
      "双子座是黄道十二宫第三宫，象征交流与多变",
      "双子座两颗最亮星北河二、北河三代表双胞胎",
      "双子座流星雨每年12月出现，是年度三大流星雨之一"
    ]
  },
  {
    name: "巨蟹座",
    stars: [
      {x:68,y:56},{x:84,y:46},{x:100,y:56},{x:94,y:72},
      {x:74,y:72},{x:58,y:62},{x:110,y:62}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[2,6]],
    facts: [
      "巨蟹座是黄道十二宫第四宫，象征保护与情感",
      "巨蟹座包含蜂巢星团，肉眼可见如一团薄雾",
      "巨蟹座是黄道十二宫中最暗的星座，没有亮于3等的星"
    ]
  },
  {
    name: "狮子座",
    stars: [
      {x:46,y:52},{x:62,y:42},{x:78,y:46},{x:92,y:42},
      {x:108,y:52},{x:102,y:66},{x:82,y:72},{x:62,y:66}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0]],
    facts: [
      "狮子座是黄道十二宫第五宫，象征自信与领导力",
      "狮子座α星轩辕十四是全天第21亮星，呈蓝白色",
      "狮子座流星雨每年11月出现，被誉为流星雨之王"
    ]
  },
  {
    name: "处女座",
    stars: [
      {x:78,y:38},{x:94,y:46},{x:104,y:60},{x:94,y:76},
      {x:74,y:76},{x:64,y:62},{x:68,y:46}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,5]],
    facts: [
      "处女座是黄道十二宫第六宫，象征细致与分析",
      "处女座α星角宿一是全天第16亮星，呈蓝白色",
      "处女座包含室女座星系团，是离我们最近的星系团"
    ]
  },
  {
    name: "天秤座",
    stars: [
      {x:66,y:42},{x:98,y:42},{x:82,y:56},{x:58,y:72},
      {x:106,y:72},{x:82,y:82}
    ],
    lines: [[0,1],[0,2],[1,2],[2,3],[2,4],[3,5],[4,5]],
    facts: [
      "天秤座是黄道十二宫第七宫，象征平衡与公正",
      "天秤座是唯一以物品而非生物命名的黄道星座",
      "天秤座最亮星氐宿一距离约77光年，呈淡绿色"
    ]
  },
  {
    name: "天蝎座",
    stars: [
      {x:36,y:58},{x:52,y:52},{x:68,y:56},{x:84,y:52},
      {x:100,y:56},{x:116,y:52},{x:132,y:56},{x:142,y:46},{x:148,y:36}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]],
    facts: [
      "天蝎座是黄道十二宫第八宫，象征深邃与蜕变",
      "天蝎座α星心宿二是全天第16亮星，呈火红色",
      "天蝎座是夏季夜空中最壮观的星座之一"
    ]
  },
  {
    name: "射手座",
    stars: [
      {x:46,y:62},{x:62,y:52},{x:78,y:56},{x:92,y:46},
      {x:108,y:52},{x:124,y:42},{x:140,y:38},{x:96,y:72},{x:76,y:78}
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[2,7],[7,8]],
    facts: [
      "射手座是黄道十二宫第九宫，象征自由与探索",
      "射手座形象为半人马，正拉弓瞄准天蝎座",
      "射手座包含银河系中心方向，是星云最密集的天区"
    ]
  }
];

/* ===== 星座渲染与循环 ===== */
var currentConstellation = 0;
var constellationTimer = null;

function renderConstellation(index) {
  var data = CONSTELLATIONS[index];
  var svg = document.getElementById("constellationSvg");
  var dynamic = document.getElementById("constellationDynamic");
  var nameEl = document.getElementById("constellationName");
  var factEl = document.getElementById("constellationFact");
  if (!svg || !dynamic) return;

  /* 清空旧内容 */
  dynamic.innerHTML = "";
  nameEl.textContent = data.name;
  nameEl.style.animation = "none";
  nameEl.offsetHeight; /* 触发重排 */
  nameEl.style.animation = "";

  /* 随机选一条介绍 */
  var fact = data.facts[Math.floor(Math.random() * data.facts.length)];
  factEl.textContent = fact;
  factEl.style.animation = "none";
  factEl.offsetHeight;
  factEl.style.animation = "";

  /* 生成连线 */
  data.lines.forEach(function(pair, i) {
    var s1 = data.stars[pair[0]];
    var s2 = data.stars[pair[1]];
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", s1.x);
    line.setAttribute("y1", s1.y);
    line.setAttribute("x2", s2.x);
    line.setAttribute("y2", s2.y);
    line.setAttribute("class", "star-line");
    line.style.animationDelay = (0.8 + i * 0.25) + "s";
    dynamic.appendChild(line);
  });

  /* 生成主星 */
  data.stars.forEach(function(star, i) {
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", star.x);
    circle.setAttribute("cy", star.y);
    circle.setAttribute("r", i % 2 === 0 ? "3.5" : "4");
    circle.setAttribute("class", "main-star");
    circle.style.animationDelay = (0.1 + i * 0.12) + "s, " + (1.0 + i * 0.12) + "s";
    dynamic.appendChild(circle);
  });
}

function nextConstellation() {
  currentConstellation = (currentConstellation + 1) % CONSTELLATIONS.length;
  renderConstellation(currentConstellation);
}

function startConstellationLoop() {
  renderConstellation(0);
  /* 每个星座展示6秒后切换 */
  constellationTimer = setInterval(nextConstellation, 6000);
}

function stopConstellationLoop() {
  if (constellationTimer) {
    clearInterval(constellationTimer);
    constellationTimer = null;
  }
}
