/* ============================================================
   主页主逻辑：初始化、页面跳转过渡、操作按钮
   ============================================================ */

/* 页面进入动画 */
document.addEventListener("DOMContentLoaded", async function() {
  document.body.classList.add("page-enter");

  // 注入 SVG 图标
  await injectIcons();

  // 初始化各模块
  initCarousels();
  initMusic();
  renderTags();
  renderTimeline();
});

/* 带过渡动画的页面跳转 */
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
