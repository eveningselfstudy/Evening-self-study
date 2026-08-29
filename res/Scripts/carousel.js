/* ============================================================
   文章板块轮播
   数据来源：Resources/Preview/preview.js 的 previewConfig
   小白点数量自动识别，<=1 时隐藏
   ============================================================ */
const carousels = {
  large: { index: 0, autoTimer: null },
  wide:  { index: 0, autoTimer: null },
  small: { index: 0, autoTimer: null }
};

/* 各板块文章卡片 HTML 模板 */
function largeArticleHTML(a) {
  return `<div class="block-slide">
    <article class="large-article" onclick="window.location.href='${a.url}'">
      <div class="large-article-cover">
        ${a.cover ? `<img src="Resources/Articles/${a.cover}" alt="${a.title}" loading="lazy">` : ''}
        <span class="large-article-badge">LATEST INSIGHT</span>
      </div>
      <div class="large-article-body">
        <div class="large-article-date"><svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${a.date}</div>
        <h3 class="large-article-title">${a.title}</h3>
        <p class="large-article-excerpt">${a.excerpt}</p>
      </div>
    </article>
  </div>`;
}

function wideArticleHTML(a) {
  return `<div class="block-slide">
    <article class="wide-article" onclick="window.location.href='${a.url}'">
      <div class="wide-article-cover">${a.cover ? `<img src="Resources/Articles/${a.cover}" alt="${a.title}" loading="lazy">` : ''}</div>
      <div class="wide-article-body">
        <div class="wide-article-date"><svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${a.date}</div>
        <h3 class="wide-article-title">${a.title}</h3>
        <p class="wide-article-excerpt">${a.excerpt}</p>
      </div>
    </article>
  </div>`;
}

function smallArticleHTML(a) {
  return `<div class="block-slide">
    <article class="small-article" onclick="window.location.href='${a.url}'">
      <div class="small-article-cover">${a.cover ? `<img src="Resources/Articles/${a.cover}" alt="${a.title}" loading="lazy">` : ''}</div>
      <div class="small-article-body">
        <div class="small-article-date"><svg class="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${a.date}</div>
        <h3 class="small-article-title">${a.title}</h3>
      </div>
    </article>
  </div>`;
}

const renderers = { large: largeArticleHTML, wide: wideArticleHTML, small: smallArticleHTML };

function initCarousels() {
  Object.keys(renderers).forEach(key => {
    const block = document.querySelector(`[data-carousel="${key}"]`);
    if (!block) return;
    const list = getPreviewArticles(key);
    const track = block.querySelector(".block-track");
    const dots = block.querySelector(".block-dots");

    track.innerHTML = list.map(renderers[key]).join("");

    // 小白点数量 <=1 时隐藏
    if (list.length <= 1) {
      dots.classList.add("hidden");
    } else {
      dots.classList.remove("hidden");
      dots.innerHTML = list.map((_, i) =>
        `<button class="block-dot ${i === 0 ? 'active' : ''}" onclick="goToBlock('${key}',${i})" aria-label="第${i+1}篇"></button>`
      ).join("");
    }

    updateBlock(key);
    if (list.length > 1) startAutoPlay(key);
  });
}

function updateBlock(key) {
  const block = document.querySelector(`[data-carousel="${key}"]`);
  if (!block) return;
  block.querySelector(".block-track").style.transform = `translateX(-${carousels[key].index * 100}%)`;
  block.querySelectorAll(".block-dot").forEach((d, i) => d.classList.toggle("active", i === carousels[key].index));
}

function blockNext(key) {
  const list = getPreviewArticles(key);
  if (list.length <= 1) return;
  carousels[key].index = (carousels[key].index + 1) % list.length;
  updateBlock(key);
  resetAutoPlay(key);
}

function blockPrev(key) {
  const list = getPreviewArticles(key);
  if (list.length <= 1) return;
  carousels[key].index = (carousels[key].index - 1 + list.length) % list.length;
  updateBlock(key);
  resetAutoPlay(key);
}

function goToBlock(key, i) {
  carousels[key].index = i;
  updateBlock(key);
  resetAutoPlay(key);
}

function startAutoPlay(key) {
  stopAutoPlay(key);
  carousels[key].autoTimer = setInterval(() => {
    const list = getPreviewArticles(key);
    carousels[key].index = (carousels[key].index + 1) % list.length;
    updateBlock(key);
  }, 5000);
}

function stopAutoPlay(key) {
  if (carousels[key].autoTimer) {
    clearInterval(carousels[key].autoTimer);
    carousels[key].autoTimer = null;
  }
}

function resetAutoPlay(key) {
  startAutoPlay(key);
}
