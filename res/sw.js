/* ============================================================
   Service Worker —— 静态资源缓存
   版本号变更时，旧缓存自动清理，资源重新加载
   更新资源后请修改 CACHE_VERSION
   ============================================================ */

const CACHE_VERSION = "v1.0.0";
const CACHE_NAME = "blog-cache-" + CACHE_VERSION;

/* 需要缓存的静态资源列表 */
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

/* 安装：缓存所有静态资源 */
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(CACHE_URLS).catch(function(err) {
        console.log("缓存部分资源失败:", err);
      });
    })
  );
  self.skipWaiting();
});

/* 激活：清理旧版本缓存 */
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(name) {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* 请求拦截：缓存优先，网络回退 */
self.addEventListener("fetch", function(event) {
  /* 只缓存 GET 请求 */
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) {
        /* 命中缓存，同时后台更新（stale-while-revalidate） */
        fetch(event.request).then(function(response) {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, response.clone());
            });
          }
        }).catch(function() {});
        return cached;
      }
      /* 未命中缓存，从网络获取并缓存 */
      return fetch(event.request).then(function(response) {
        if (response && response.status === 200 && response.type === "basic") {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(function() {
        /* 网络失败且无缓存，返回离线提示（仅对HTML请求） */
        if (event.request.headers.get("accept") && event.request.headers.get("accept").includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
