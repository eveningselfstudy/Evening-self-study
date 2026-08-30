const SITE_ENABLED = false;
/* ============================================================
   主页主逻辑：初始化、页面跳转过渡、操作按钮、加载页控制
   ============================================================ */

/* ===== 简单字符串哈希（djb2算法） ===== */
function simpleHash(str) {
  var hash = 5381;
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & 0xffffffff;
  }
  return hash.toString(16);
}

/* ===== 多层全文件资源更新检测 ===== */
/* 第一层：所有文件 HEAD 请求（Last-Modified + ETag + Content-Length）
   第二层：文本文件内容哈希（JS/CSS/HTML/SVG/数据）
   第三层：index.html 内容哈希（兜底） */
async function checkResourceUpdate() {
  /* 所有需要检测的资源文件 */
  var resources = [
    /* HTML */
    "index.html", "settings.html",
    /* CSS */
    "PageStyle/Global/variables.css",
    "PageStyle/Global/reset.css",
    "PageStyle/Global/layout.css",
    "PageStyle/Global/responsive.css",
    "PageStyle/ProfileCard/profile.css",
    "PageStyle/MusicPlayer/music.css",
    "PageStyle/ArticleBlocks/blocks.css",
    "PageStyle/SearchView/search.css",
    "PageStyle/Settings/settings.css",
    /* JS */
    "Scripts/theme.js",
    "Scripts/icon-loader.js",
    "Scripts/carousel.js",
    "Scripts/music.js",
    "Scripts/search.js",
    "Scripts/constellation-canvas.js",
    "Scripts/settings.js",
    "Scripts/main.js",
    /* 数据 */
    "Resources/Articles/articles.js",
    "Resources/Music/playlist.js",
    "Resources/Preview/preview.js",
    "Resources/Tags/tags.js",
    /* 图片 */
    "Resources/Background/bp.jpeg",
    "Resources/Avatar/avatar.jpg",
    "Resources/Articles/1.jpeg",
    "Resources/Music/1.jpg",
    /* 音乐 */
    "Resources/Music/1.mp3",
    /* SVG 图标 */
    "Resources/Icons/github.svg",
    "Resources/Icons/settings.svg",
    "Resources/Icons/docs.svg",
    "Resources/Icons/more.svg",
    "Resources/Icons/search.svg",
    "Resources/Icons/back.svg",
    "Resources/Icons/play.svg",
    "Resources/Icons/pause.svg",
    "Resources/Icons/prev.svg",
    "Resources/Icons/next.svg",
    "Resources/Icons/chevron-left.svg",
    "Resources/Icons/chevron-right.svg",
    /* Service Worker */
    "sw.js"
  ];

  var hasUpdate = false;
  var isTextFile = function(url) {
    return /\.(js|css|html|json|svg|txt)$/i.test(url);
  };

  for (var i = 0; i < resources.length; i++) {
    var url = resources[i];
    try {
      /* ===== 第一层：HEAD 请求检测元数据 ===== */
      var headRes = await fetch(url, { method: "HEAD", cache: "no-cache" });
      var lastMod = headRes.headers.get("Last-Modified") || "";
      var etag = headRes.headers.get("ETag") || "";
      var contentLen = headRes.headers.get("Content-Length") || "";
      var headFingerprint = lastMod + "|" + etag + "|" + contentLen;
      var cachedHead = localStorage.getItem("head_" + url);

      if (cachedHead && cachedHead !== headFingerprint) {
        hasUpdate = true;
      }
      if (headFingerprint) localStorage.setItem("head_" + url, headFingerprint);

      /* ===== 第二层：文本文件内容哈希（djb2全内容哈希） ===== */
      if (isTextFile(url)) {
        var contentRes = await fetch(url, { cache: "no-cache" });
        var text = await contentRes.text();
        var hash = simpleHash(text);
        var cachedHash = localStorage.getItem("hash_" + url);
        if (cachedHash && cachedHash !== hash) {
          hasUpdate = true;
        }
        localStorage.setItem("hash_" + url, hash);
      }
    } catch(e) {
      /* 单个文件检测失败不影响其他 */
    }
  }

  /* ===== 第三层：index.html 内容哈希（兜底） ===== */
  try {
    var indexRes = await fetch("index.html", { cache: "no-cache" });
    var indexText = await indexRes.text();
    var indexHash = simpleHash(indexText);
    var cachedIndex = localStorage.getItem("site_content_hash");
    if (cachedIndex && cachedIndex !== indexHash) {
      hasUpdate = true;
    }
    localStorage.setItem("site_content_hash", indexHash);
  } catch(e) {}

  if (hasUpdate) {
    setLoadingText("检测到更新，正在刷新...");
    setTimeout(function() { window.location.reload(true); }, 500);
    return true;
  }
  return false;
}

/* 更新等待词（带淡入淡出） */
function setLoadingText(text) {
  var el = document.getElementById("loadingText");
  if (!el) return;
  el.style.opacity = "0";
  setTimeout(function() {
    el.textContent = text;
    el.style.opacity = "1";
  }, 250);
}

/* ===== 页面初始化 + 资源加载完成检测 ===== */
document.addEventListener("DOMContentLoaded", async function() {
  document.body.classList.add("page-enter");

  /* 自动检测资源更新（后台并行，不阻塞加载） */
  checkResourceUpdate();

  /* 根据访问状态显示初始等待词 */
  var isFirstVisit = !localStorage.getItem("blog_visited");
  if (isFirstVisit) {
    setLoadingText("首次加载较慢，请耐心等待");
  } else {
    setLoadingText("正在检查资源更新");
  }

  /* 阶段1：加载图标 */
  setLoadingText("正在加载图标资源");
  await injectIcons();

  /* 阶段2：初始化组件 */
  setLoadingText("正在初始化页面组件");
  initCarousels();
  initMusic();
  renderTags();
  renderTimeline();

  /* 阶段3：加载图片 */
  setLoadingText("正在加载图片资源");
  await waitForAllImages();

  /* 标记已访问 */
  localStorage.setItem("blog_visited", "1");

  /* 阶段4：即将完成 */
  setLoadingText("即将完成");

  /* 停止Canvas星座动画 */
  if (window.stopConstellationCanvas) window.stopConstellationCanvas();

  /* 延迟淡出加载页 */
  setTimeout(function() {
    /* 网站开关：false时永远停在加载页，保持正常加载状态 */
    if (typeof SITE_ENABLED !== "undefined" && !SITE_ENABLED) {
      return;
    }
    var loadingScreen = document.getElementById("loadingScreen");
    if (loadingScreen) loadingScreen.classList.add("hidden");
  }, 400);
});

/* 等待页面所有 img 元素加载完成 */
function waitForAllImages() {
  return new Promise(function(resolve) {
    var images = document.querySelectorAll("img");
    if (images.length === 0) { resolve(); return; }
    var loaded = 0;
    var total = images.length;
    function checkDone() {
      loaded++;
      if (loaded >= total) resolve();
    }
    images.forEach(function(img) {
      if (img.complete && img.naturalWidth > 0) {
        checkDone();
      } else {
        img.addEventListener("load", checkDone);
        img.addEventListener("error", checkDone);
      }
    });
    /* 超时保护：最多等8秒 */
    setTimeout(resolve, 8000);
  });
}

/* ===== 页面跳转过渡 ===== */
function navigateTo(url) {
  document.body.classList.remove("page-enter");
  document.body.classList.add("page-leave");
  setTimeout(() => {
    window.location.href = url;
  }, 280);
}

/* 设置按钮：跳转设置页（带过渡动画） */
function openSettings() {
  navigateTo("settings.html");
}

/* 操作按钮处理 */
function handleAction(type) {
  switch (type) {
    case 'settings':
      openSettings();
      break;
    case 'github':
      window.open("https://github.com/eveningselfstudy/Evening-self-study", "_blank");
      break;
    case 'docs':
      window.open("https://www.kdocs.cn/l/cnuFStaqc8R2", "_blank");
      break;
  }
}

/* ESC 关闭搜索 */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && searchOpen) toggleSearch();
});

/* ===== 自动检测资源更新 ===== */
(function() {
  /* 从当前页面提取当前版本号 */
  var currentVersion = "";
  var scripts = document.querySelectorAll("script[src]");
  for (var i = 0; i < scripts.length; i++) {
    var src = scripts[i].getAttribute("src");
    var m = src.match(/\?v=(\d+)/);
    if (m) { currentVersion = m[1]; break; }
  }
  if (!currentVersion) return;

  /* 页面加载3秒后，fetch当前HTML检查是否有新版本 */
  setTimeout(function() {
    fetch(window.location.pathname + "?t=" + Date.now(), { cache: "no-store" })
      .then(function(res) { return res.text(); })
      .then(function(html) {
        var newMatch = html.match(/\?v=(\d+)/);
        if (newMatch && newMatch[1] !== currentVersion) {
          /* 检测到新版本，自动刷新 */
          window.location.reload();
        }
      })
      .catch(function() { /* 检测失败忽略 */ });
  }, 3000);
})();
