/* ============================================================
   主页主逻辑：初始化、页面跳转过渡、操作按钮、加载页控制
   ============================================================ */

/* ===== 自动检测资源更新 ===== */
async function checkResourceUpdate() {
  try {
    /* fetch当前页面（禁用缓存），通过内容哈希判断是否更新 */
    var res = await fetch(window.location.pathname, { cache: "no-cache" });
    var text = await res.text();
    /* 简单哈希：内容长度 + 首尾特征，足够判断是否变更 */
    var hash = text.length + "|" + text.substring(0, 80) + "|" + text.substring(text.length - 80);
    var cached = localStorage.getItem("site_content_hash");
    if (cached && cached !== hash) {
      /* 检测到更新，保存新哈希并强制刷新 */
      localStorage.setItem("site_content_hash", hash);
      setLoadingText("检测到更新，正在刷新...");
      setTimeout(function() { window.location.reload(true); }, 500);
      return true;
    }
    if (!cached) {
      localStorage.setItem("site_content_hash", hash);
    }
  } catch(e) {
    /* 网络错误时跳过检测，不影响正常加载 */
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
      window.open("https://www.kdocs.cn/l/csuQCyb2syya", "_blank");
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
