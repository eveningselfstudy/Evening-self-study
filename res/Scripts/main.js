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
      alert('GitHub 仓库 —— 请在 handleAction("github") 中填写仓库地址');
      break;
    case 'docs':
      alert('开发文档 —— 请在 handleAction("docs") 中填写文档地址');
      break;
  }
}

/* ESC 关闭搜索 */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && searchOpen) toggleSearch();
});
