/* ============================================================
   搜索视图：标签筛选 + 时间线文章列表 + 展开动画
   ============================================================ */
let activeTag = null;
let searchOpen = false;

function renderTags() {
  // 从统一标签配置文件读取，按配置顺序显示
  const allTags = getAllTags();
  document.getElementById("tagScroll").innerHTML = `
    <button class="tag-btn ${activeTag === null ? 'active' : ''}" onclick="setActiveTag(null)">全部档案</button>
    ${allTags.map(t => `<button class="tag-btn ${activeTag === t ? 'active' : ''}" onclick="setActiveTag('${t}')">${t}</button>`).join("")}
  `;
}

function setActiveTag(tag) {
  activeTag = tag;
  renderTags();
  renderTimeline();
}

function renderTimeline() {
  const container = document.getElementById("timelineContent");
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = articles.filter(a => {
    const mt = !activeTag || a.tags.includes(activeTag);
    const ms = !term || a.title.toLowerCase().includes(term) || a.excerpt.toLowerCase().includes(term) || a.tags.some(t => t.toLowerCase().includes(term));
    return mt && ms;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>没有找到相关文章，换个关键词试试吧</p></div>`;
    return;
  }

  container.innerHTML = filtered.map((a, i) => `
    <div class="timeline-item" style="animation-delay:${1.45 + i * 0.12}s">
      <article class="timeline-article" onclick="window.location.href='${a.url}'">
        <div class="timeline-article-cover">${a.cover ? `<img src="${a.cover}" alt="${a.title}" loading="lazy">` : ''}</div>
        <div class="timeline-article-body">
          <div class="timeline-article-date">${a.date}</div>
          <h3 class="timeline-article-title">${a.title}</h3>
          <p class="timeline-article-excerpt">${a.excerpt}</p>
          <div class="timeline-article-tags">${a.tags.map(t => `<span class="timeline-article-tag">${t}</span>`).join("")}</div>
        </div>
      </article>
    </div>
  `).join("");

  // 点的动画延迟比文章稍早
  container.querySelectorAll(".timeline-item").forEach((el, i) => {
    el.style.setProperty("--dot-delay", `${1.3 + i * 0.12}s`);
  });
}

/* 搜索视图切换 —— 动画由 CSS @keyframes 驱动 */
function toggleSearch() {
  const mainView = document.getElementById("mainView");
  const searchView = document.getElementById("searchView");

  if (!searchOpen) {
    searchOpen = true;
    mainView.classList.add("closing");
    setTimeout(() => {
      mainView.classList.add("hidden");
      mainView.classList.remove("closing");
      renderTags();
      renderTimeline();
      // 强制重排，确保 animation 从 0% 开始
      void searchView.offsetWidth;
      searchView.classList.add("visible");
      setTimeout(() => document.getElementById("searchInput").focus(), 750);
    }, 420);
  } else {
    searchOpen = false;
    searchView.classList.remove("visible");
    setTimeout(() => {
      mainView.classList.remove("hidden");
      void mainView.offsetWidth;
    }, 300);
  }
}
