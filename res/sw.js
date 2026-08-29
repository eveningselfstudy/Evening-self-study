/* ============================================================
   Service Worker —— 精准资源缓存
   策略：stale-while-revalidate + 浏览器 ETag 自动校验
   - 首次访问：缓存所有静态资源
   - 后续访问：先返回缓存（秒开），后台静默校验
   - 文件未变化：服务器返回 304，不下载内容，零流量
   - 文件已变化：服务器返回 200，下载新版本并更新缓存
   - 新增/删除资源时修改本文件即可触发 SW 更新
   ============================================================ */

const CACHE_NAME = "blog-cache-static";

/* 需要预缓存的静态资源列表 */
const CACHE_URLS = [
  "./",
  "./index.html",
  "./settings.html",
  /* CSS */
  "./PageStyle/Global/variables.css",
  "./PageStyle/Global/reset.css",
  "./PageStyle/Global/layout.css",
  "./PageStyle/Global/responsive.css",
  "./PageStyle/ProfileCard/profile.css",
  "./PageStyle/MusicPlayer/music.css",
  "./PageStyle/ArticleBlocks/blocks.css",
  "./PageStyle/SearchView/search.css",
  "./PageStyle/Settings/settings.css",
  /* JS */
  "./Scripts/theme.js",
  "./Scripts/icon-loader.js",
  "./Scripts/carousel.js",
  "./Scripts/music.js",
  "./Scripts/search.js",
  "./Scripts/main.js",
  "./Scripts/settings.js",
  /* 数据 */
  "./Resources/Articles/articles.js",
  "./Resources/Music/playlist.js",
  "./Resources/Preview/preview.js",
  "./Resources/Tags/tags.js",
  /* 图片 */
  "./Resources/Background/bp.jpeg",
  "./Resources/Avatar/avatar.jpg",
  "./Resources/Articles/1.jpeg",
  /* SVG 图标 */
  "./Resources/Icons/back.svg",
  "./Resources/Icons/chevron-left.svg",
  "./Resources/Icons/chevron-right.svg",
  "./Resources/Icons/docs.svg",
  "./Resources/Icons/github.svg",
  "./Resources/Icons/more.svg",
  "./Resources/Icons/next.svg",
  "./Resources/Icons/pause.svg",
  "./Resources/Icons/play.svg",
  "./Resources/Icons/prev.svg",
  "./Resources/Icons/search.svg",
  "./Resources/Icons/settings.svg"
];

/* 安装：预缓存所有静态资源 */
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_URLS).catch(function(err) {
        console.log("部分资源预缓存失败:", err);
      });
    })
  );
  self.skipWaiting();
});

/* 激活：接管所有页面 */
self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

/* 请求拦截：缓存优先 + 后台校验（ETag 自动判断是否变化） */
self.addEventListener("fetch", function(event) {
  /* 只处理 GET 请求 */
  if (event.request.method !== "GET") return;

  /* 跨域请求（如字体）直接走网络，不缓存 */
  var url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(cached) {
        /* 后台校验：浏览器自动带 If-None-Match，未变化返回 304（零流量），变化返回 200（更新缓存） */
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(function() {
          return cached; /* 网络失败时返回缓存 */
        });

        /* 命中缓存：立即返回，同时后台校验更新 */
        if (cached) {
          fetchPromise.catch(function() {}); /* 后台更新不阻塞 */
          return cached;
        }

        /* 未命中缓存：等待网络响应 */
        return fetchPromise;
      });
    })
  );
});
