/* ============================================================
   设置页面逻辑：配色方案切换
   ============================================================ */

document.addEventListener("DOMContentLoaded", async function() {
  document.body.classList.add("page-enter");
  await injectIcons();
  renderThemeOptions();
});

function renderThemeOptions() {
  const grid = document.getElementById("themeGrid");
  const current = getCurrentTheme();

  grid.innerHTML = THEMES.map(theme => `
    <div class="theme-option theme-${theme.id} ${theme.id === current ? 'active' : ''}"
         onclick="selectTheme('${theme.id}')"
         data-theme-id="${theme.id}">
      <div class="theme-preview">
        <span></span><span></span><span></span>
      </div>
      <div class="theme-name">${theme.name}</div>
      ${theme.id === current ? '<div class="theme-current-badge">当前使用</div>' : ''}
    </div>
  `).join("");
}

function selectTheme(themeId) {
  applyTheme(themeId);
  renderThemeOptions();
}

/* 返回主页（带过渡动画） */
function goBack() {
  document.body.classList.remove("page-enter");
  document.body.classList.add("page-leave");
  setTimeout(() => {
    window.location.href = "index.html";
  }, 280);
}
