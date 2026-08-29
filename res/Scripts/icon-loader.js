/* ============================================================
   SVG 图标加载器
   将 Resources/Icons/ 下的 SVG 文件内容注入到页面中，
   保留 currentColor 换色能力。
   用法：在 HTML 中写 <span data-icon="settings"></span>
   加载后会被替换为对应的内联 SVG
   ============================================================ */
const ICON_PATH = "Resources/Icons/";
const iconCache = {};

async function loadIcon(name) {
  if (iconCache[name]) return iconCache[name];
  try {
    const resp = await fetch(ICON_PATH + name + ".svg");
    const svg = await resp.text();
    iconCache[name] = svg;
    return svg;
  } catch (e) {
    console.warn("图标加载失败:", name);
    return "";
  }
}

async function injectIcons(scope = document) {
  const targets = scope.querySelectorAll("[data-icon]");
  for (const el of targets) {
    const name = el.getAttribute("data-icon");
    const svg = await loadIcon(name);
    if (svg) {
      const wrapper = document.createElement("span");
      wrapper.innerHTML = svg.trim();
      const svgEl = wrapper.firstChild;
      if (svgEl) {
        // 复制原元素的 class 和 style
        if (el.className) svgEl.setAttribute("class", el.className);
        if (el.getAttribute("style")) svgEl.setAttribute("style", el.getAttribute("style"));
        el.replaceWith(svgEl);
      }
    }
  }
}
