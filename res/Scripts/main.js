/* ============================================================
   主页主逻辑：初始化、页面跳转过渡、操作按钮、加载页控制
   ============================================================ */

/* ===== 加载页提示文字轮播 ===== */
var tipTimer = null;
(function() {
  var tipEl = document.getElementById("loadingTip");
  var isFirstVisit = !localStorage.getItem("blog_visited");
  var tipIndex = 0;
  var firstVisitTips = [
    "首次加载较慢，正在缓存资源...",
    "小猫正在努力奔跑...",
    "正在加载图片资源...",
    "即将完成，请稍候..."
  ];
  var normalTips = [
    "正在加载...",
    "正在校验资源版本...",
    "马上就好..."
  ];
  var tips = isFirstVisit ? firstVisitTips : normalTips;
  if (tipEl) tipEl.textContent = tips[0];
  function switchTip() {
    if (!tipEl) return;
    tipEl.style.opacity = "0";
    setTimeout(function() {
      tipIndex = (tipIndex + 1) % tips.length;
      tipEl.textContent = tips[tipIndex];
      tipEl.style.opacity = "1";
    }, 300);
  }
  tipTimer = setInterval(switchTip, 2500);
})();

function stopTipSwitch() {
  if (tipTimer) { clearInterval(tipTimer); tipTimer = null; }
}

/* ===== 页面初始化 + 资源加载完成检测 ===== */
document.addEventListener("DOMContentLoaded", async function() {
  document.body.classList.add("page-enter");
  // 启动星座绘制循环
  startConstellationLoop();
  // 注入 SVG 图标
  await injectIcons();
  // 初始化各模块（动态创建文章卡片和图片）
  initCarousels();
  initMusic();
  renderTags();
  renderTimeline();
  // 等所有图片（含动态创建的文章封面、头像）加载完成
  await waitForAllImages();
  // 标记已访问
  localStorage.setItem("blog_visited", "1");
  // 停止提示切换和星座循环
  stopTipSwitch();
  stopConstellationLoop();
  var tipEl = document.getElementById("loadingTip");
  if (tipEl) tipEl.textContent = "加载完成";
  // 延迟淡出加载页
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
