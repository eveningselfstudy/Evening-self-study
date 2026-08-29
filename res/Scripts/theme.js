/* ============================================================
   主题配色管理
   配色方案定义在 PageStyle/Global/variables.css 的 :root[data-theme]
   选择保存在 localStorage，页面加载时自动应用
   ============================================================ */
const THEME_KEY = "blog_theme";
const DEFAULT_THEME = "sakura";

const THEMES = [
  { id: "sakura",   name: "樱粉" },
  { id: "ocean",    name: "海洋蓝" },
  { id: "mint",     name: "薄荷绿" },
  { id: "twilight", name: "暮光紫" },
  { id: "midnight", name: "暗夜黑" }
];

function getCurrentTheme() {
  return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
}

function applyTheme(themeId) {
  document.documentElement.setAttribute("data-theme", themeId);
  localStorage.setItem(THEME_KEY, themeId);
}

function initTheme() {
  applyTheme(getCurrentTheme());
}

// 页面加载时立即应用主题（避免闪烁）
initTheme();
