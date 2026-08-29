## 目录

- 一、项目结构与快速开始
  - 1.1 技术栈
  - 1.2 目录结构
  - 1.3 文件清单
  - 1.4 运行方式
  - 1.5 资源加载顺序
  - 1.6 浏览器兼容性
- 二、数据对象配置
  - 2.1 文章数据对象
  - 2.2 音乐数据对象
  - 2.3 预览配置对象
  - 2.4 数据加载依赖关系
  - 2.5 常见配置示例
  - 2.6 标签配置对象
- 三、样式系统
  - 3.1 CSS 变量体系
  - 3.2 配色方案
  - 3.3 各区域样式说明
  - 3.4 响应式断点
  - 3.5 毛玻璃效果
  - 3.6 动画性能优化
- 四、脚本模块与 API
  - 4.1 模块总览
  - 4.2 主题管理模块
  - 4.3 图标加载模块
  - 4.4 文章轮播模块
  - 4.5 音乐播放模块
  - 4.6 搜索视图模块
  - 4.7 主页主逻辑模块
  - 4.8 设置页逻辑模块
  - 4.9 页面过渡动画
  - 4.10 全局函数调用关系

---

## 一、项目结构与快速开始
### 1.1 技术栈
本项目采用纯原生技术栈，无构建工具、无框架依赖：

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| CSS3 | 样式与动画，使用 CSS 变量、Grid、Flexbox、backdrop-filter |
| JavaScript ES6+ | 交互逻辑，使用箭头函数、模板字符串、let/const、fetch |
| SVG | 图标系统，通过 fetch 动态加载并注入页面 |
| localStorage | 主题配色持久化存储 |

**核心设计原则**：

- 零依赖：不引入任何第三方库，所有功能原生实现
- 模块化：CSS 按区域拆分，JS 按功能拆分，数据与视图分离
- 数据驱动：文章、音乐、预览均由独立数据对象控制，修改数据即可更新页面

### 1.2 目录结构
```
blog-homepage/
├── index.html                  # 主页入口
├── settings.html               # 设置页（配色切换）
├── README.md                   # 项目说明
│
├── Resources/                  # 资源与数据
│   ├── Background/             # 背景图目录
│   │   └── bp.webp              # 背景图
│   ├── Icons/                  # SVG 图标（12个）
│   ├── Articles/
│   │   └── articles.js         # 文章数据对象
│   ├── Music/
│   │   └── playlist.js         # 音乐播放列表数据
│   └── Preview/
│       └── preview.js          # 主页预览配置
│   ├── Tags/
│   │   └── tags.js             # 标签统一配置（名称、颜色、顺序）
│
├── PageStyle/                  # 样式文件（按区域拆分）
│   ├── Global/                 # 全局样式
│   │   ├── variables.css       # CSS变量与多套配色
│   │   ├── reset.css           # 重置与基础样式
│   │   ├── layout.css          # 背景层与容器布局
│   │   └── responsive.css      # 响应式断点
│   ├── ProfileCard/
│   │   └── profile.css         # 个人信息卡片
│   ├── MusicPlayer/
│   │   └── music.css           # 音乐播放器
│   ├── ArticleBlocks/
│   │   └── blocks.css          # 文章板块网格
│   ├── SearchView/
│   │   └── search.css          # 搜索视图与动画
│   └── Settings/
│       └── settings.css        # 设置页
│
└── Scripts/                    # 脚本（按功能拆分）
    ├── theme.js                # 主题配色管理
    ├── icon-loader.js          # SVG图标加载器
    ├── carousel.js             # 文章轮播
    ├── music.js                # 音乐播放器
    ├── search.js               # 搜索视图
    ├── main.js                 # 主页主逻辑
    └── settings.js             # 设置页逻辑
```

### 1.3 文件清单
#### HTML 文件

| 文件 | 说明 |
|------|------|
| `index.html` | 主页，包含主视图和搜索视图两个状态 |
| `settings.html` | 设置页，提供配色方案切换 |

#### 数据文件

| 文件 | 全局变量 | 导出函数 |
|------|----------|----------|
| `Resources/Articles/articles.js` | `articles` | `getArticleById(id)` |
| `Resources/Music/playlist.js` | `playlist` | 无 |
| `Resources/Preview/preview.js` | `previewConfig` | `getPreviewArticles(blockName)` |
| `Resources/Tags/tags.js` | `tagConfig` | `getAllTags()`, `getTagColor(name)` |

#### 样式文件

| 文件 | 说明 |
|------|------|
| `PageStyle/Global/variables.css` | 5套配色方案的CSS变量定义 |
| `PageStyle/Global/reset.css` | 全局重置、字体、页面过渡动画 |
| `PageStyle/Global/layout.css` | 背景层、应用容器、主视图、顶部网格 |
| `PageStyle/Global/responsive.css` | 768px 和 480px 两个断点 |
| `PageStyle/ProfileCard/profile.css` | 个人卡片、头像、按钮 |
| `PageStyle/MusicPlayer/music.css` | 音乐播放器、进度条、控制按钮 |
| `PageStyle/ArticleBlocks/blocks.css` | 大/宽/小三种文章板块、轮播、圆点指示器 |
| `PageStyle/SearchView/search.css` | 搜索框、标签栏、时间线、展开动画 |
| `PageStyle/Settings/settings.css` | 设置页、配色选择器 |

#### 脚本文件

| 文件 | 说明 |
|------|------|
| `Scripts/theme.js` | 主题读取/应用/持久化，页面加载时立即执行 |
| `Scripts/icon-loader.js` | SVG图标fetch加载与注入，`injectIcons(scope)` |
| `Scripts/carousel.js` | 三板块轮播，自动播放、手动翻页、圆点同步 |
| `Scripts/music.js` | 播放/暂停/切歌/进度，时长自动生成 |
| `Scripts/search.js` | 标签筛选、关键词搜索、时间线渲染、视图切换动画 |
| `Scripts/main.js` | 初始化、页面跳转过渡、操作按钮分发、ESC关闭 |
| `Scripts/settings.js` | 配色渲染、选择、返回 |

### 1.4 运行方式
#### 环境要求

- 任意现代浏览器（Chrome 90+、Firefox 88+、Safari 14+、Edge 90+）
- 本地 HTTP 服务器（因使用 fetch 加载 SVG，不能直接 file:// 打开）

#### 启动命令

```bash
# 进入项目目录
cd blog-homepage

# 方式一：Python 内置服务器
python3 -m http.server 8000

# 方式二：Node.js（需安装 http-server）
npx http-server -p 8000

# 方式三：PHP
php -S localhost:8000
```

启动后访问 `http://localhost:8000`。

#### 背景图放置

将背景图片命名为 `bp.webp`，放入 `Resources/Background/` 目录。

如需使用其他格式（png/webp），修改 `PageStyle/Global/layout.css` 中 `.bg-layer` 的 `background` 属性：

```css
.bg-layer {
  background: url("../../Resources/Background/bp.webp") center center / cover no-repeat;
}
```

### 1.5 资源加载顺序
#### index.html 中的 CSS 加载顺序

```html
<!-- 1. 全局变量（必须最先，其他CSS依赖变量） -->
<link rel="stylesheet" href="PageStyle/Global/variables.css">
<!-- 2. 重置样式 -->
<link rel="stylesheet" href="PageStyle/Global/reset.css">
<!-- 3. 布局 -->
<link rel="stylesheet" href="PageStyle/Global/layout.css">
<!-- 4. 各区域样式（顺序无关） -->
<link rel="stylesheet" href="PageStyle/ProfileCard/profile.css">
<link rel="stylesheet" href="PageStyle/MusicPlayer/music.css">
<link rel="stylesheet" href="PageStyle/ArticleBlocks/blocks.css">
<link rel="stylesheet" href="PageStyle/SearchView/search.css">
<!-- 5. 响应式（必须最后，覆盖前面的样式） -->
<link rel="stylesheet" href="PageStyle/Global/responsive.css">
```

**加载顺序原理**：CSS 变量必须最先加载，因为后续样式文件中使用了 `var(--xxx)` 引用变量。响应式样式必须最后加载，确保媒体查询中的规则能覆盖默认样式。

#### index.html 中的 JS 加载顺序

```html
<!-- 1. 主题（立即执行，避免配色闪烁） -->
<script src="Scripts/theme.js"></script>
<!-- 2. 数据对象（被后续脚本依赖） -->
<script src="Resources/Articles/articles.js"></script>
<script src="Resources/Music/playlist.js"></script>
<script src="Resources/Preview/preview.js"></script>
<!-- 3. 功能脚本 -->
<script src="Scripts/icon-loader.js"></script>
<script src="Scripts/carousel.js"></script>
<script src="Scripts/music.js"></script>
<script src="Scripts/search.js"></script>
<!-- 4. 主逻辑（最后，依赖以上所有） -->
<script src="Scripts/main.js"></script>
```

**加载顺序原理**：
- `theme.js` 立即执行，在页面渲染前应用主题，避免白屏闪烁
- `articles.js` 必须在 `preview.js` 之前，因为 `preview.js` 调用 `getArticleById()`
- 数据文件必须在功能脚本之前，因为功能脚本引用数据对象
- `main.js` 最后加载，在 `DOMContentLoaded` 中统一初始化

#### settings.html 中的加载顺序

```html
<!-- CSS -->
variables.css → reset.css → layout.css → settings.css → responsive.css

<!-- JS -->
theme.js → icon-loader.js → settings.js
```

### 1.6 浏览器兼容性
| 特性 | 最低版本 | 说明 |
|------|----------|------|
| CSS 变量（`--var`） | Chrome 49 / Firefox 31 / Safari 9.1 | 主题切换的基础 |
| `backdrop-filter` 毛玻璃 | Chrome 76 / Firefox 103 / Safari 9 | 卡片毛玻璃效果 |
| CSS Grid | Chrome 57 / Firefox 52 / Safari 10.1 | 文章板块网格布局 |
| `fetch` API | Chrome 42 / Firefox 39 / Safari 10.1 | SVG图标动态加载 |
| `localStorage` | Chrome 4 / Firefox 3.5 / Safari 4 | 主题持久化 |
| ES6 语法 | Chrome 41 / Firefox 36 / Safari 10 | 箭头函数、模板字符串等 |

不支持 IE 浏览器。

---

## 二、数据对象配置
### 2.1 文章数据对象
文件路径：`Resources/Articles/articles.js`

#### 数据结构

每篇文章是一个对象，存储在全局数组 `articles` 中：

```javascript
const articles = [
  {
    id: 1,
    title: "文章标题",
    date: "2026-04-27",
    excerpt: "文章摘要，显示在卡片上的简短描述",
    cover: "Resources/Articles/cover1.jpg",
    tags: ["标签1", "标签2"],
    url: "https://example.com/article/1"
  }
];
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | Number | 是 | 唯一标识，用于预览配置引用，不可重复 |
| `title` | String | 是 | 文章标题，显示在所有文章卡片中 |
| `date` | String | 是 | 发布日期，建议格式 `YYYY-MM-DD` |
| `excerpt` | String | 是 | 摘要，大板块和时间线显示2行，宽板块显示2行 |
| `cover` | String | 否 | 封面图路径，留空则显示渐变色占位 |
| `tags` | Array\<String\> | 是 | 标签数组，用于搜索页筛选和文章卡片展示 |
| `url` | String | 是 | 点击文章跳转的链接，可填 `#` 占位 |

#### 封面图路径

封面图路径相对于项目根目录，建议放在 `Resources/Articles/` 下：

```javascript
// 相对于项目根目录
cover: "Resources/Articles/my-cover.jpg"

// 留空：显示渐变占位
cover: ""
```

#### 新增文章

在 `articles` 数组末尾追加一个对象，`id` 递增：

```javascript
const articles = [
  // ... 已有文章
  {
    id: 6,
    title: "新文章标题",
    date: "2026-05-01",
    excerpt: "新文章的摘要内容",
    cover: "Resources/Articles/cover6.jpg",
    tags: ["前端", "教程"],
    url: "https://example.com/article/6"
  }
];
```

#### 辅助函数

```javascript
// 根据 id 获取文章对象，找不到返回 null
const article = getArticleById(1);
```

该函数在 `Resources/Preview/preview.js` 中被调用，用于将预览配置中的 id 转换为文章对象。

**代码讲解**：`getArticleById` 使用 `Array.find()` 方法遍历数组，返回第一个匹配的元素。如果找不到匹配项，`find()` 返回 `undefined`，通过 `|| null` 将其转换为 `null`，便于调用方判断。

```javascript
function getArticleById(id) {
  return articles.find(a => a.id === id) || null;
}
```

### 2.2 音乐数据对象
文件路径：`Resources/Music/playlist.js`

#### 数据结构

每首歌是一个对象，存储在全局数组 `playlist` 中：

```javascript
const playlist = [
  {
    title: "歌曲名",
    artist: "歌手名",
    cover: "Resources/Music/cover1.jpg",
    file: "Resources/Music/song1.mp3"
  }
];
```

#### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `title` | String | 是 | 歌曲名，显示在播放器中 |
| `artist` | String | 是 | 歌手名 |
| `cover` | String | 否 | 专辑封面路径，留空显示渐变占位 |
| `file` | String | 否 | 音乐文件路径，留空则使用模拟进度 |

#### 时长自动生成

音乐时长不需要在数据中填写，由 `Scripts/music.js` 自动生成：

```javascript
// 初始化时为每首歌生成 120~300 秒的模拟时长
playlist.forEach((song, i) => {
  if (!song._duration) {
    song._duration = 120 + (i * 37) % 180;
  }
});
```

**代码讲解**：
- `forEach` 遍历播放列表，为每首歌添加 `_duration` 属性
- `120 + (i * 37) % 180` 生成 120~299 秒的伪随机时长
- 下划线前缀 `_duration` 表示这是内部计算属性，不是用户配置字段
- `if (!song._duration)` 确保不会覆盖已有的真实时长

如果提供了真实音乐文件（`file` 字段非空），可通过 `Audio` 对象获取真实时长：

```javascript
// 获取真实时长示例
const audio = new Audio(song.file);
audio.addEventListener('loadedmetadata', () => {
  song._duration = audio.duration;
});
```

#### 新增歌曲

```javascript
const playlist = [
  // ... 已有歌曲
  {
    title: "新歌",
    artist: "歌手",
    cover: "Resources/Music/new-cover.jpg",
    file: "Resources/Music/new-song.mp3"
  }
];
```

#### 音乐文件格式建议

| 格式 | 兼容性 | 说明 |
|------|--------|------|
| MP3 | 所有浏览器 | 最通用，建议使用 |
| AAC | 大部分浏览器 | 苹果设备友好 |
| OGG | Chrome/Firefox | 开源格式，Safari 不支持 |
| WAV | 所有浏览器 | 文件大，不建议网页使用 |

### 2.3 预览配置对象
文件路径：`Resources/Preview/preview.js`

#### 数据结构

主页有三个文章板块，每个板块引用一组文章 id：

```javascript
const previewConfig = {
  large: {
    articleIds: [1, 2, 3]
  },
  wide: {
    articleIds: [2, 4]
  },
  small: {
    articleIds: [3, 5]
  }
};
```

#### 板块说明

| 板块名 | CSS类名 | 布局位置 | 卡片样式 |
|--------|---------|----------|----------|
| `large` | `.block-large` | 左侧通栏（占2行） | 大图在上，文字在下 |
| `wide` | `.block-wide` | 右上 | 左图右文横向布局 |
| `small` | `.block-small` | 右下 | 小图在上，标题在下 |

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `articleIds` | Array\<Number\> | 文章 id 列表，顺序即轮播顺序 |

#### 小白点自动识别

每个板块的圆点指示器数量由 `articleIds` 长度自动决定：

- 数量 > 1：显示圆点，蓝点表示当前页，白点表示其他页
- 数量 <= 1：自动隐藏圆点和翻页按钮

相关逻辑在 `Scripts/carousel.js` 的 `initCarousels()` 函数中：

```javascript
if (list.length <= 1) {
  dots.classList.add("hidden");
} else {
  dots.classList.remove("hidden");
  // 生成圆点按钮
  dots.innerHTML = list.map((_, i) =>
    `<button class="block-dot ${i === 0 ? 'active' : ''}" onclick="goToBlock('${key}',${i})"></button>`
  ).join("");
}
```

**代码讲解**：
- `list.length <= 1` 判断是否需要隐藏指示器
- `classList.add("hidden")` 添加隐藏类，CSS 中 `.hidden { display: none; }`
- `list.map((_, i) => ...)` 遍历文章列表，`_` 表示不需要当前元素，`i` 是索引
- 模板字符串 `${i === 0 ? 'active' : ''}` 为第一个圆点添加激活类

#### 修改预览文章

```javascript
// 修改大板块显示的文章
large: {
  articleIds: [1, 3, 5]  // 改为显示 id 为 1、3、5 的文章
}

// 宽板块只显示一篇（圆点自动隐藏）
wide: {
  articleIds: [2]  // 只有1篇，不显示翻页控件
}
```

#### 辅助函数

```javascript
// 根据板块名获取文章对象列表
const list = getPreviewArticles("large");
// 返回 [{id:1, title:"...", ...}, {id:2, ...}, {id:3, ...}]
```

**代码讲解**：

```javascript
function getPreviewArticles(blockName) {
  const ids = previewConfig[blockName]?.articleIds || [];
  return ids.map(id => getArticleById(id)).filter(Boolean);
}
```

- `previewConfig[blockName]?.articleIds` 使用可选链操作符 `?.`，如果板块不存在则返回 `undefined`
- `|| []` 确保返回空数组而不是 `undefined`
- `ids.map(id => getArticleById(id))` 将 id 数组转换为文章对象数组
- `.filter(Boolean)` 过滤掉 `null`（找不到的文章），确保返回有效对象

### 2.4 数据加载依赖关系
```
articles.js (定义 articles, getArticleById)
    ↑
    └── preview.js (定义 previewConfig, getPreviewArticles)
                        ↑
                        └── carousel.js (渲染轮播)
                        └── search.js (渲染时间线)

playlist.js (定义 playlist)
    ↑
    └── music.js (播放器逻辑)
```

**加载顺序要求**：

1. `articles.js` 必须在 `preview.js` 之前加载（`preview.js` 调用 `getArticleById`）
2. `playlist.js` 必须在 `music.js` 之前加载
3. 所有数据文件必须在 `carousel.js`、`search.js`、`main.js` 之前加载

### 2.5 常见配置示例
#### 只显示2篇文章的大板块

```javascript
// Resources/Preview/preview.js
const previewConfig = {
  large: { articleIds: [1, 2] },   // 2篇，显示2个圆点
  wide: { articleIds: [3] },        // 1篇，圆点隐藏
  small: { articleIds: [4, 5] }     // 2篇
};
```

#### 文章无封面图

```javascript
// Resources/Articles/articles.js
{
  id: 1,
  title: "无封面的文章",
  date: "2026-04-27",
  excerpt: "这篇文章没有封面图，会显示渐变占位",
  cover: "",   // 留空即可
  tags: ["随笔"],
  url: "#"
}
```

#### 音乐使用真实音频文件

```javascript
// Resources/Music/playlist.js
const playlist = [
  {
    title: "我的歌",
    artist: "我",
    cover: "Resources/Music/my-cover.jpg",
    file: "Resources/Music/my-song.mp3"
  }
];
```

注意：当前 `music.js` 使用模拟进度，如需接入真实音频播放，需修改 `togglePlay()`、`startProgress()` 等函数，使用 `Audio` 对象控制播放。

### 2.6 标签配置对象

文件路径：`Resources/Tags/tags.js`

#### 功能

统一管理所有标签，控制标签栏的显示顺序和标签颜色。标签栏、文章卡片中的标签均从此文件读取。

#### 数据结构

```javascript
const tagConfig = [
  { name: "算法",     color: "#ec4899" },
  { name: "Leetcode", color: "#f59e0b" },
  { name: "前端",     color: "#3b82f6" }
];
```

#### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | String | 标签名称，与文章数据中的 `tags` 字段对应 |
| `color` | String | 标签颜色（十六进制），用于文章卡片标签着色 |

#### 辅助函数

```javascript
// 获取所有标签名称数组（按配置顺序）
const names = getAllTags();
// 返回 ["算法", "Leetcode", "前端", ...]

// 根据标签名获取颜色
const color = getTagColor("前端");
// 返回 "#3b82f6"
```

#### 新增标签

在 `tagConfig` 数组中追加对象，然后在文章的 `tags` 字段中使用该标签名即可：

```javascript
const tagConfig = [
  // ... 已有标签
  { name: "Android", color: "#3ddc84" }
];
```

文章中引用：

```javascript
{
  id: 1,
  title: "Android开发笔记",
  tags: ["Android", "前端"],
  // ...
}
```

#### 标签栏渲染逻辑

`Scripts/search.js` 中的 `renderTags()` 从 `tagConfig` 读取标签，按配置顺序显示：

```javascript
function renderTags() {
  const allTags = getAllTags();  // 从统一配置读取
  // 渲染标签按钮...
}
```

---

## 三、样式系统
### 3.1 CSS 变量体系
文件路径：`PageStyle/Global/variables.css`

所有颜色、圆角、阴影、动画缓动函数都通过 CSS 变量定义，切换配色只需改变量值。

#### 变量分类

```css
:root {
  /* 文字颜色 */
  --text-primary: #3b2a3a;      /* 主文字：标题、重要内容 */
  --text-secondary: #6b5568;    /* 次要文字：正文、描述 */
  --text-muted: #9a8596;        /* 弱化文字：日期、辅助信息 */

  /* 主题色 */
  --accent: #ec4899;            /* 主强调色 */
  --accent-soft: #f472b6;       /* 柔和强调色（渐变起点） */
  --accent-2: #c084fc;          /* 第二强调色（渐变终点） */
  --dot-blue: #6b8afd;          /* 轮播圆点当前页颜色 */

  /* 卡片背景 */
  --card-bg: rgba(255, 255, 255, 0.65);        /* 普通卡片毛玻璃 */
  --card-bg-strong: rgba(255, 255, 255, 0.82);  /* 强调卡片毛玻璃 */
  --card-border: rgba(255, 255, 255, 0.5);      /* 卡片边框 */

  /* 阴影 */
  --shadow-soft: 0 6px 24px rgba(236, 72, 153, 0.1);   /* 普通阴影 */
  --shadow-hover: 0 10px 32px rgba(236, 72, 153, 0.18); /* 悬停阴影 */

  /* 背景 */
  --bg-base: #fdf2f8;              /* 页面底色（背景图加载前） */
  --bg-overlay: rgba(253, 242, 248, 0.3);  /* 背景遮罩层 */

  /* 圆角 */
  --radius-lg: 20px;    /* 大卡片 */
  --radius-md: 14px;    /* 中卡片 */
  --radius-sm: 10px;    /* 小按钮 */

  /* 动画 */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);  /* 标准缓动 */
}
```

#### 变量使用方式

```css
/* 在任意CSS文件中直接引用 */
.profile-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  color: var(--text-primary);
}
```

**技术说明**：CSS 变量（自定义属性）通过 `var()` 函数引用。变量继承自父元素，`:root` 上定义的变量全局可用。当 `data-theme` 属性变化时，对应选择器中的变量值会覆盖默认值，实现主题切换。

### 3.2 配色方案
#### 内置配色

通过 `:root[data-theme="xxx"]` 定义，共5套：

| 主题ID | 名称 | 主色调 | 适用场景 |
|--------|------|--------|----------|
| `sakura` | 樱粉 | 粉色 #ec4899 | 默认，温暖柔和 |
| `ocean` | 海洋蓝 | 蓝色 #2563eb | 清爽专业 |
| `mint` | 薄荷绿 | 青色 #0d9488 | 自然清新 |
| `twilight` | 暮光紫 | 紫色 #7c3aed | 神秘优雅 |
| `midnight` | 暗夜黑 | 深蓝灰 #0f172a | 深色模式 |

#### 切换原理

```javascript
// Scripts/theme.js
function applyTheme(themeId) {
  // 设置 html 标签的 data-theme 属性
  document.documentElement.setAttribute("data-theme", themeId);
  // 持久化到 localStorage
  localStorage.setItem("blog_theme", themeId);
}
```

CSS 中通过属性选择器匹配：

```css
:root[data-theme="ocean"] {
  --accent: #2563eb;
  --card-bg: rgba(255, 255, 255, 0.65);
  /* ... 覆盖所有颜色变量 */
}
```

**技术说明**：这是 CSS 主题切换的经典模式。通过改变 `html` 元素的 `data-theme` 属性，触发 CSS 属性选择器匹配，从而替换一组变量值。所有使用 `var()` 的元素会自动更新颜色，无需 JS 操作 DOM。

#### 新增配色方案

**步骤一：在 `variables.css` 中添加变量定义**

```css
:root[data-theme="forest"] {
  --text-primary: #14532d;
  --text-secondary: #166534;
  --text-muted: #4ade80;
  --accent: #16a34a;
  --accent-soft: #22c55e;
  --accent-2: #84cc16;
  --dot-blue: #22c55e;
  --card-bg: rgba(255, 255, 255, 0.65);
  --card-bg-strong: rgba(255, 255, 255, 0.82);
  --card-border: rgba(255, 255, 255, 0.5);
  --shadow-soft: 0 6px 24px rgba(22, 163, 74, 0.1);
  --shadow-hover: 0 10px 32px rgba(22, 163, 74, 0.18);
  --bg-base: #f0fdf4;
  --bg-overlay: rgba(240, 253, 244, 0.3);
}
```

**步骤二：在 `Scripts/theme.js` 的 `THEMES` 数组中注册**

```javascript
const THEMES = [
  { id: "sakura", name: "樱粉" },
  { id: "ocean", name: "海洋蓝" },
  { id: "mint", name: "薄荷绿" },
  { id: "twilight", name: "暮光紫" },
  { id: "midnight", name: "暗夜黑" },
  { id: "forest", name: "森林绿" }  // 新增
];
```

**步骤三：在 `PageStyle/Settings/settings.css` 中添加预览条颜色**

```css
.theme-forest .theme-preview span:nth-child(1) { background: #f0fdf4; }
.theme-forest .theme-preview span:nth-child(2) { background: #22c55e; }
.theme-forest .theme-preview span:nth-child(3) { background: #84cc16; }
```

### 3.3 各区域样式说明
#### 全局布局（layout.css）

| 选择器 | 说明 |
|--------|------|
| `.bg-layer` | 固定定位背景图层，`z-index: -2` |
| `.bg-overlay` | 背景遮罩层，`z-index: -1` |
| `.app` | 应用容器，最大宽度 980px，居中 |
| `.main-view` | 主视图，搜索展开时添加 `.closing` 类触发缩小动画 |
| `.top-row` | 顶部网格，`grid-template-columns: 1.4fr 1fr` |

#### 个人卡片（profile.css）

| 选择器 | 说明 |
|--------|------|
| `.profile-card` | 卡片容器，毛玻璃效果 |
| `.profile-header` | 头部 flex 布局，头像+信息 |
| `.profile-avatar` | 头像圆形，64x64px，白色边框 |
| `.profile-name` | 昵称，Noto Serif SC 字体 |
| `.profile-bio` | 简介，12.5px |
| `.profile-footer` | 底部按钮区，两端对齐 |
| `.action-btn` | 方形功能按钮，38x38px |
| `.more-btn-inline` | 更多按钮，渐变胶囊样式 |

#### 音乐播放器（music.css）

| 选择器 | 说明 |
|--------|------|
| `.music-card` | 播放器卡片 |
| `.music-cover` | 专辑封面，圆形，播放时添加 `.playing` 类触发旋转 |
| `.music-progress` | 进度条容器，可点击跳转 |
| `.music-progress-bar` | 进度条填充，渐变背景 |
| `.music-play-btn` | 播放/暂停按钮，圆形渐变 |

旋转动画：

```css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.music-cover.playing {
  animation: spin 8s linear infinite;
}
```

**代码讲解**：
- `@keyframes spin` 定义从 0 到 360 度的旋转动画
- `8s` 表示一圈 8 秒
- `linear` 表示匀速旋转
- `infinite` 表示无限循环
- 通过添加/移除 `.playing` 类控制动画启停

#### 文章板块（blocks.css）

网格布局：

```css
.articles-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  grid-template-rows: auto auto;
  gap: 16px;
}
.block-large { grid-column: 1; grid-row: 1 / 3; }  /* 左侧占2行 */
.block-wide  { grid-column: 2; grid-row: 1; }       /* 右上 */
.block-small { grid-column: 2; grid-row: 2; }       /* 右下 */
```

**代码讲解**：
- `grid-template-columns: 1.3fr 1fr` 定义两列，左列宽是右列的 1.3 倍
- `grid-template-rows: auto auto` 定义两行，高度由内容决定
- `grid-row: 1 / 3` 表示大板块从第1条网格线到第3条网格线，即占2行

轮播结构：

```html
<div class="article-block" data-carousel="large">
  <div class="block-viewport">       <!-- 视口，overflow: hidden -->
    <div class="block-track">        <!-- 轨道，flex 横向排列 -->
      <div class="block-slide">...</div>  <!-- 每篇文章占100%宽度 -->
      <div class="block-slide">...</div>
    </div>
    <button class="block-page-btn prev">〈</button>
    <button class="block-page-btn next">〉</button>
  </div>
  <div class="block-dots"></div>     <!-- 圆点指示器 -->
</div>
```

轮播通过 `transform: translateX()` 实现：

```css
.block-track {
  transform: translateX(-100%);  /* 显示第2篇 */
}
```

**技术说明**：使用 `transform` 而非 `left/margin` 实现滑动，因为 `transform` 由 GPU 合成层处理，不触发重排（reflow），动画更流畅。

#### 搜索视图（search.css）

动画时序（总时长约 1.8 秒）：

| 时间 | 元素 | 动画 |
|------|------|------|
| 0.05s | 返回按钮 | 旋转+缩放出现，0.55s |
| 0.10s | 搜索框 | 宽度从0扩展到100%，0.6s |
| 0.70s | 标签栏 | 从搜索框底部向下滑出，0.5s |
| 1.15s | 时间线 | 从中间向上下双向延伸，0.65s |
| 1.30s | 时间线节点 | 逐个弹出，0.4s |
| 1.45s | 文章卡片 | 逐个上移淡入，0.5s |

关键动画：

```css
/* 搜索框从左到右延伸 */
@keyframes searchBarExpand {
  0% { width: 0; opacity: 0; }
  25% { opacity: 1; }
  100% { width: 100%; opacity: 1; }
}

/* 时间线从中间双向延伸到底部 */
@keyframes lineExpandBoth {
  0% { top: 50%; height: 0; }
  100% { top: 0; height: 100%; }
}

/* 节点渐变实心圆，圆心偏移到卡片一侧 */
.timeline-item::after {
  background: linear-gradient(135deg, var(--accent-soft), var(--accent-2));
  box-shadow: 0 0 0 3px rgba(255,255,255,0.7);
}
.timeline-item:nth-child(odd)::after { right: 10px; }
.timeline-item:nth-child(even)::after { left: 10px; }
```

**代码讲解**：
- `searchBarExpand`：宽度从 0 到 100%，透明度在 25% 时就变为 1，避免细条时看不见
- `lineExpandBoth`：通过同时改变 `top` 和 `height`，实现从中间向上下双向延伸
- `::after` 伪元素创建时间线节点，`nth-child(odd/even)` 分别控制左右两侧节点的位置
- `box-shadow: 0 0 0 3px` 创建白色描边效果，使节点与背景分离

#### 设置页（settings.css）

| 选择器 | 说明 |
|--------|------|
| `.settings-card` | 设置卡片容器 |
| `.theme-grid` | 配色选择网格，3列 |
| `.theme-option` | 单个配色选项，选中时添加 `.active` |
| `.theme-preview` | 配色预览条，3段渐变色块 |

### 3.4 响应式断点
文件路径：`PageStyle/Global/responsive.css`

#### 断点定义

| 断点 | 设备类型 | 触发条件 |
|------|----------|----------|
| 默认 | 桌面端 | > 768px |
| `@media (max-width: 768px)` | 平板/大手机 | <= 768px |
| `@media (max-width: 480px)` | 小手机 | <= 480px |

#### 768px 以下的布局变化

**顶部区域**：从左右并排改为上下堆叠

```css
.top-row {
  grid-template-columns: 1fr;  /* 单列 */
}
```

**文章网格**：大板块通栏在上，宽和小并排在下

```css
.articles-grid {
  grid-template-columns: 1fr 1fr;
}
.block-large { grid-column: 1 / 3; grid-row: 1; }  /* 通栏 */
.block-wide  { grid-column: 1; grid-row: 2; }
.block-small { grid-column: 2; grid-row: 2; }
```

**宽板块文章**：从横向改为纵向

```css
.wide-article {
  flex-direction: column;  /* 图片在上，文字在下 */
}
```

**时间线**：从双列改为单列

```css
.timeline-line { left: 18px; }  /* 线移到左侧 */
.timeline-item {
  width: 100%;
  left: 0;
  padding-left: 42px;  /* 给线和点留出空间 */
}
.timeline-item::after { left: 11px; }  /* 点移到线上 */
```

**标签栏**：最右边半个隐藏，提示可滑动

```css
.tag-scroll-wrap {
  mask-image: linear-gradient(to right, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, black 88%, transparent 100%);
  padding-right: 24px;
}
```

**技术说明**：`mask-image` 用渐变创建遮罩，88% 位置开始从不透明渐变到透明，使最右侧内容呈现"半个隐藏"的视觉效果，提示用户可以横向滑动。`-webkit-` 前缀兼容 Safari。

#### 480px 以下的微调

- 昵称字号缩小到 16px
- 大板块封面高度缩小到 140px
- 配色选择网格保持2列

### 3.5 毛玻璃效果
所有卡片使用统一的毛玻璃样式：

```css
backdrop-filter: blur(14px) saturate(1.3);
-webkit-backdrop-filter: blur(14px) saturate(1.3);
```

| 参数 | 值 | 说明 |
|------|-----|------|
| `blur(14px)` | 14px | 模糊半径，越大越模糊 |
| `saturate(1.3)` | 1.3 | 饱和度增强，避免模糊后发灰 |

**技术说明**：
- `backdrop-filter` 对元素背后的内容应用滤镜，实现毛玻璃效果
- 必须配合半透明背景 `rgba(255,255,255,0.65)` 才能看到效果
- `-webkit-` 前缀兼容 Safari 浏览器
- Firefox 103+ 支持，旧版本浏览器会降级为半透明背景

### 3.6 动画性能优化
#### 使用 transform 和 opacity

所有动画只操作 `transform` 和 `opacity`，避免触发重排：

```css
/* 好：使用 transform，不触发重排 */
.block-track { transition: transform 0.45s; }

/* 好：使用 opacity */
.main-view.closing { opacity: 0; transform: scale(0.72); }
```

**技术说明**：CSS 属性按渲染成本分为三类：
- **合成层属性**（`transform`、`opacity`）：只触发合成，不触发重排重绘，GPU 加速，性能最好
- **重绘属性**（`color`、`background`）：触发重绘，不触发重排
- **重排属性**（`width`、`height`、`left`、`margin`）：触发重排，性能最差

本项目所有动画均使用合成层属性。

#### 减少动画偏好

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**技术说明**：`prefers-reduced-motion` 是系统级无障碍设置，用户在操作系统中开启"减少动态效果"后，浏览器会匹配此媒体查询。将所有动画和过渡时长设为极短，提升对晕动症用户的友好度。

#### 背景层独立

背景图使用独立的固定定位 div，避免 `background-attachment: fixed` 的性能问题：

```css
.bg-layer {
  position: fixed;
  inset: 0;
  background: url("...") center / cover no-repeat;
  z-index: -2;
}
```

**技术说明**：`background-attachment: fixed` 在移动端会导致滚动时重绘，造成卡顿。使用 `position: fixed` 的独立 div 实现相同效果，但由合成层处理，滚动时不触发重绘。

---

## 四、脚本模块与 API
### 4.1 模块总览
| 模块 | 文件 | 全局变量/函数 | 依赖 |
|------|------|---------------|------|
| 主题管理 | `Scripts/theme.js` | `THEMES`, `getCurrentTheme()`, `applyTheme()`, `initTheme()` | 无 |
| 图标加载 | `Scripts/icon-loader.js` | `loadIcon()`, `injectIcons()` | 无 |
| 文章轮播 | `Scripts/carousel.js` | `carousels`, `initCarousels()`, `blockNext()`, `blockPrev()`, `goToBlock()` | `getPreviewArticles()` |
| 音乐播放 | `Scripts/music.js` | `togglePlay()`, `prevMusic()`, `nextMusic()`, `seekMusic()`, `initMusic()` | `playlist` |
| 搜索视图 | `Scripts/search.js` | `renderTags()`, `setActiveTag()`, `renderTimeline()`, `toggleSearch()` | `articles` |
| 主页逻辑 | `Scripts/main.js` | `navigateTo()`, `openSettings()`, `handleAction()` | 以上全部 |
| 设置页逻辑 | `Scripts/settings.js` | `renderThemeOptions()`, `selectTheme()`, `goBack()` | `THEMES`, `applyTheme()`, `injectIcons()` |

### 4.2 主题管理模块（theme.js）
#### 功能

- 页面加载时立即从 localStorage 读取并应用主题，避免配色闪烁
- 提供主题切换和持久化

#### 常量

```javascript
const THEME_KEY = "blog_theme";     // localStorage 键名
const DEFAULT_THEME = "sakura";     // 默认主题

const THEMES = [
  { id: "sakura",   name: "樱粉" },
  { id: "ocean",    name: "海洋蓝" },
  { id: "mint",     name: "薄荷绿" },
  { id: "twilight", name: "暮光紫" },
  { id: "midnight", name: "暗夜黑" }
];
```

#### 函数

**`getCurrentTheme()`**

返回当前主题ID，读取 localStorage，无值时返回默认主题。

```javascript
const theme = getCurrentTheme();  // "sakura"
```

**代码讲解**：

```javascript
function getCurrentTheme() {
  return localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
}
```

- `localStorage.getItem()` 读取存储的值，如果不存在返回 `null`
- `|| DEFAULT_THEME` 在值为 `null` 时返回默认主题

**`applyTheme(themeId)`**

设置 `html` 标签的 `data-theme` 属性，并保存到 localStorage。

```javascript
applyTheme("ocean");
// 效果：<html data-theme="ocean">
// localStorage: blog_theme = "ocean"
```

**代码讲解**：

```javascript
function applyTheme(themeId) {
  document.documentElement.setAttribute("data-theme", themeId);
  localStorage.setItem(THEME_KEY, themeId);
}
```

- `document.documentElement` 即 `<html>` 元素
- `setAttribute("data-theme", themeId)` 触发 CSS 属性选择器匹配，切换配色
- `localStorage.setItem()` 持久化存储，刷新页面后仍保留

**`initTheme()`**

页面加载时调用，读取并应用保存的主题。脚本末尾自动执行。

### 4.3 图标加载模块（icon-loader.js）
#### 功能

通过 fetch 加载 `Resources/Icons/` 下的 SVG 文件，注入到 HTML 中，保留 `currentColor` 换色能力。

#### 使用方式

在 HTML 中用 `data-icon` 属性占位：

```html
<button class="action-btn">
  <span data-icon="settings"></span>
</button>
```

页面加载后，`injectIcons()` 会将其替换为内联 SVG：

```html
<button class="action-btn">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ...>
    <!-- SVG 内容 -->
  </svg>
</button>
```

#### 函数

**`loadIcon(name)`**

异步加载单个图标，带缓存。

```javascript
const svg = await loadIcon("github");
// 返回 SVG 字符串
```

**代码讲解**：

```javascript
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
```

- `iconCache` 对象缓存已加载的 SVG，避免重复请求
- `fetch()` 请求 SVG 文件，`resp.text()` 读取为文本
- `try/catch` 捕获网络错误，失败时返回空字符串

**`injectIcons(scope)`**

扫描指定范围内所有 `[data-icon]` 元素，替换为内联 SVG。

```javascript
// 扫描整个文档
await injectIcons();

// 扫描指定元素
await injectIcons(document.getElementById("someContainer"));
```

#### 图标清单

| 文件名 | 用途 | 换色方式 |
|--------|------|----------|
| `settings.svg` | 设置按钮 | stroke="currentColor" |
| `github.svg` | GitHub按钮 | fill="currentColor" |
| `docs.svg` | 开发文档按钮 | stroke="currentColor" |
| `more.svg` | 更多按钮 | stroke="currentColor" |
| `back.svg` | 返回按钮 | stroke="currentColor" |
| `search.svg` | 搜索框图标 | stroke="currentColor" |
| `play.svg` | 播放按钮 | fill="currentColor" |
| `pause.svg` | 暂停按钮 | fill="currentColor" |
| `prev.svg` | 上一首 | fill="currentColor" |
| `next.svg` | 下一首 | fill="currentColor" |
| `chevron-left.svg` | 左翻页〈 | stroke="currentColor" |
| `chevron-right.svg` | 右翻页〉 | stroke="currentColor" |

#### 新增图标

1. 将 SVG 文件放入 `Resources/Icons/` 目录
2. 确保 SVG 根元素有 `xmlns="http://www.w3.org/2000/svg"` 和 `viewBox` 属性
3. 需要换色的路径使用 `fill="currentColor"` 或 `stroke="currentColor"`
4. 在 HTML 中用 `<span data-icon="文件名"></span>` 引用

**技术说明**：`currentColor` 是 CSS 关键字，继承父元素的 `color` 属性值。将 SVG 注入为内联元素后，`currentColor` 能正确继承按钮的文字颜色，实现 hover 变色等效果。如果用 `<img src="icon.svg">` 方式引用，则无法通过 CSS 改变颜色。

### 4.4 文章轮播模块（carousel.js）
#### 功能

管理三个文章板块（large/wide/small）的轮播，支持自动播放、手动翻页、圆点指示器。

#### 状态对象

```javascript
const carousels = {
  large: { index: 0, autoTimer: null },
  wide:  { index: 0, autoTimer: null },
  small: { index: 0, autoTimer: null }
};
```

每个板块维护当前索引和自动播放定时器。

#### 函数

**`initCarousels()`**

初始化所有板块：
1. 根据 `previewConfig` 渲染文章卡片
2. 生成圆点指示器（数量 <=1 时隐藏）
3. 启动自动播放（数量 >1 时）

在 `main.js` 的 `DOMContentLoaded` 中调用。

**`updateBlock(key)`**

更新指定板块的轮播位置和圆点状态。

```javascript
updateBlock("large");
// 效果：.block-track 的 transform 变为 translateX(-index * 100%)
//       对应圆点添加 .active 类
```

**代码讲解**：

```javascript
function updateBlock(key) {
  const block = document.querySelector(`[data-carousel="${key}"]`);
  block.querySelector(".block-track").style.transform =
    `translateX(-${carousels[key].index * 100}%)`;
  block.querySelectorAll(".block-dot").forEach((d, i) =>
    d.classList.toggle("active", i === carousels[key].index)
  );
}
```

- 模板字符串 `` `[data-carousel="${key}"]` `` 动态选择对应板块
- `translateX(-${index * 100}%)` 移动轨道，每篇占 100% 宽度
- `classList.toggle("active", 条件)` 条件为 true 时添加类，false 时移除

**`blockNext(key)` / `blockPrev(key)`**

手动翻到下一篇/上一篇，翻页后重置自动播放计时器。

```javascript
blockNext("large");  // 大板块下一篇
blockPrev("wide");   // 宽板块上一篇
```

**代码讲解**：

```javascript
function blockNext(key) {
  const list = getPreviewArticles(key);
  if (list.length <= 1) return;  // 只有1篇时不翻页
  carousels[key].index = (carousels[key].index + 1) % list.length;
  updateBlock(key);
  resetAutoPlay(key);
}
```

- `% list.length` 实现循环：到最后一篇后回到第一篇
- `resetAutoPlay()` 重置自动播放计时器，避免手动翻页后立即自动翻页

**`goToBlock(key, index)`**

跳转到指定索引的文章，用于点击圆点。

```javascript
goToBlock("small", 1);  // 小板块跳到第2篇
```

**`startAutoPlay(key)` / `stopAutoPlay(key)` / `resetAutoPlay(key)`**

自动播放控制，间隔 5000ms。

#### 文章卡片模板

三种板块使用不同的 HTML 模板：

| 板块 | 生成函数 | 布局 |
|------|----------|------|
| large | `largeArticleHTML(a)` | 封面在上，文字在下，带 LATEST INSIGHT 标签 |
| wide | `wideArticleHTML(a)` | 左图右文横向 |
| small | `smallArticleHTML(a)` | 小封面在上，标题在下 |

### 4.5 音乐播放模块（music.js）
#### 功能

模拟音乐播放器，支持播放/暂停、上一首/下一首、进度条点击跳转。当前使用模拟进度，可扩展为真实音频播放。

#### 状态变量

```javascript
let musicPlaying = false;   // 是否正在播放
let musicIndex = 0;         // 当前歌曲索引
let musicProgress = 35;     // 当前进度百分比
let musicTimer = null;      // 进度更新定时器
let audioEl = null;         // 预留：真实 Audio 对象
```

#### 函数

**`togglePlay()`**

切换播放/暂停状态。播放时：
- 图标切换为暂停
- 封面添加 `.playing` 类触发旋转动画
- 启动进度定时器（每 500ms 增加 0.5%）

暂停时：
- 图标切换为播放
- 封面移除 `.playing` 类
- 停止进度定时器

**代码讲解**：

```javascript
function togglePlay() {
  musicPlaying = !musicPlaying;
  const iconContainer = document.getElementById("musicPlayIcon");
  const cover = document.getElementById("musicCover");

  if (musicPlaying) {
    iconContainer.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    cover.classList.add("playing");
    startProgress();
  } else {
    iconContainer.innerHTML = '<path d="M8 5v14l11-7z"/>';
    cover.classList.remove("playing");
    stopProgress();
  }
}
```

- 通过直接修改 SVG 的 `innerHTML` 切换播放/暂停图标
- `classList.add/remove` 控制封面旋转动画的启停

**`prevMusic()` / `nextMusic()`**

切换到上一首/下一首，循环播放。切换后调用 `applyMusic()` 更新界面。

**`applyMusic()`**

根据 `musicIndex` 更新播放器界面：
- 歌曲名、歌手名
- 总时长（从 `song._duration` 读取）
- 重置进度为 0

**`seekMusic(event)`**

点击进度条跳转，根据点击位置计算百分比。

```javascript
// 进度条点击事件
<div class="music-progress" onclick="seekMusic(event)">
```

**代码讲解**：

```javascript
function seekMusic(e) {
  const bar = document.getElementById("musicProgress");
  const r = bar.getBoundingClientRect();
  musicProgress = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
  updateProgressUI();
}
```

- `getBoundingClientRect()` 获取元素相对于视口的位置和尺寸
- `e.clientX - r.left` 计算点击位置相对于进度条左端的距离
- `Math.max(0, Math.min(100, ...))` 限制在 0~100 范围内

**`formatTime(sec)`**

秒数格式化为 `MM:SS`。

```javascript
formatTime(176);  // "02:56"
```

**代码讲解**：

```javascript
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return m + ":" + s;
}
```

- `Math.floor(sec / 60)` 计算分钟数
- `padStart(2, "0")` 不足两位时前面补零，如 `5` → `"05"`

**`initMusic()`**

初始化：为每首歌生成模拟时长（120~300秒），应用第一首歌的信息。

#### 时长生成逻辑

```javascript
playlist.forEach((song, i) => {
  if (!song._duration) {
    song._duration = 120 + (i * 37) % 180;
  }
});
```

每首歌的时长 = 120 + (索引 × 37) 对 180 取模，范围 120~299 秒。

#### 扩展为真实音频播放

如需接入真实音频，修改以下部分：

```javascript
// 1. togglePlay() 中创建 Audio 对象
if (!audioEl) {
  audioEl = new Audio(playlist[musicIndex].file);
}
audioEl.play();  // 或 audioEl.pause();

// 2. 用 audioEl 的事件更新进度
audioEl.addEventListener('timeupdate', () => {
  musicProgress = (audioEl.currentTime / audioEl.duration) * 100;
  updateProgressUI();
});

// 3. 切歌时更换 src
audioEl.src = playlist[musicIndex].file;
audioEl.load();
```

### 4.6 搜索视图模块（search.js）
#### 功能

- 标签筛选
- 关键词搜索（标题、摘要、标签）
- 时间线文章列表渲染
- 搜索视图展开/收起动画控制

#### 状态变量

```javascript
let activeTag = null;   // 当前选中的标签，null 表示全部
let searchOpen = false; // 搜索视图是否打开
```

#### 函数

**`renderTags()`**

从 `articles` 中提取所有不重复的标签，渲染标签栏。第一个按钮固定为"全部档案"。

```javascript
// 输出示例
<button class="tag-btn active">全部档案</button>
<button class="tag-btn">算法</button>
<button class="tag-btn">前端</button>
```

**代码讲解**：

```javascript
function renderTags() {
  const allTags = [...new Set(articles.flatMap(a => a.tags))];
  document.getElementById("tagScroll").innerHTML = `
    <button class="tag-btn ${activeTag === null ? 'active' : ''}" onclick="setActiveTag(null)">全部档案</button>
    ${allTags.map(t => `<button class="tag-btn ${activeTag === t ? 'active' : ''}" onclick="setActiveTag('${t}')">${t}</button>`).join("")}
  `;
}
```

- `articles.flatMap(a => a.tags)` 将所有文章的标签数组合并为一个扁平数组
- `new Set(...)` 去重
- `[...new Set(...)]` 将 Set 转回数组
- `activeTag === null ? 'active' : ''` 为当前选中标签添加激活类

**`setActiveTag(tag)`**

设置当前标签，重新渲染标签栏和时间线。

```javascript
setActiveTag("前端");   // 筛选"前端"标签
setActiveTag(null);     // 显示全部
```

**`renderTimeline()`**

根据 `activeTag` 和搜索框关键词筛选文章，渲染时间线。

筛选逻辑：

```javascript
const filtered = articles.filter(a => {
  const matchTag = !activeTag || a.tags.includes(activeTag);
  const matchSearch = !term ||
    a.title.toLowerCase().includes(term) ||
    a.excerpt.toLowerCase().includes(term) ||
    a.tags.some(t => t.toLowerCase().includes(term));
  return matchTag && matchSearch;
});
```

**代码讲解**：
- `!activeTag` 当 `activeTag` 为 `null` 时返回 `true`，即不筛选标签
- `a.tags.includes(activeTag)` 检查文章是否包含当前标签
- `!term` 当搜索框为空时返回 `true`，即不筛选关键词
- `a.tags.some(...)` 检查是否有任意一个标签包含搜索词
- 两个条件都满足（`&&`）的文章才显示

无结果时显示空状态提示。

**`toggleSearch()`**

切换搜索视图的打开/关闭。

打开流程：
1. 主视图添加 `.closing` 类（缩小淡出，0.42s）
2. 主视图隐藏，搜索视图添加 `.visible` 类
3. CSS 动画依次触发（返回按钮 → 搜索框 → 标签 → 时间线 → 文章）
4. 搜索框获得焦点

关闭流程：
1. 搜索视图移除 `.visible` 类
2. 0.3s 后主视图恢复显示

**代码讲解**：

```javascript
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
      void searchView.offsetWidth;  // 强制重排，确保动画从0%开始
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
```

- `void searchView.offsetWidth` 读取元素宽度，强制浏览器完成重排，确保后续添加的类能触发 CSS 动画
- 这是因为如果元素从 `display: none` 直接变为有动画，浏览器可能跳过动画的初始状态

#### 动画时序控制

动画完全由 CSS `@keyframes` 驱动，JS 只负责添加/移除 `.visible` 类。各元素的 `animation-delay` 在 CSS 中定义：

| 元素 | 延迟 | 持续时间 |
|------|------|----------|
| 返回按钮 | 0.05s | 0.55s |
| 搜索框 | 0.10s | 0.60s |
| 标签栏 | 0.70s | 0.50s |
| 时间线 | 1.15s | 0.65s |
| 文章卡片 | 1.45s + i*0.12s | 0.50s |

文章卡片的延迟通过内联样式设置：

```javascript
container.innerHTML = filtered.map((a, i) => `
  <div class="timeline-item" style="animation-delay:${1.45 + i * 0.12}s">
`).join("");
```

### 4.7 主页主逻辑模块（main.js）
#### 功能

- 页面初始化
- 页面跳转过渡动画
- 操作按钮分发
- 键盘事件

#### DOMContentLoaded 初始化

```javascript
document.addEventListener("DOMContentLoaded", async function() {
  document.body.classList.add("page-enter");  // 页面进入动画
  await injectIcons();                         // 注入SVG图标
  initCarousels();                             // 初始化轮播
  initMusic();                                 // 初始化音乐
  renderTags();                                // 渲染标签
  renderTimeline();                            // 渲染时间线
});
```

**代码讲解**：
- `DOMContentLoaded` 事件在 HTML 解析完成后触发，不等待图片加载
- `async function` 允许使用 `await`
- `await injectIcons()` 等待图标加载完成后再初始化其他模块，因为轮播和搜索中可能包含图标

#### 函数

**`navigateTo(url)`**

带过渡动画的页面跳转。先添加 `.page-leave` 类（淡出上移，0.28s），再跳转。

```javascript
navigateTo("settings.html");
```

**代码讲解**：

```javascript
function navigateTo(url) {
  document.body.classList.remove("page-enter");
  document.body.classList.add("page-leave");
  setTimeout(() => {
    window.location.href = url;
  }, 280);
}
```

- 先移除进入动画类，再添加离开动画类
- `setTimeout` 等待 280ms 让离开动画播放完成后再跳转

**`openSettings()`**

跳转到设置页，内部调用 `navigateTo("settings.html")`。

**`handleAction(type)`**

操作按钮分发，根据类型执行不同动作：

```javascript
function handleAction(type) {
  switch (type) {
    case 'settings':
      openSettings();
      break;
    case 'github':
      window.open("https://github.com/eveningselfstudy/Evening-self-study", "_blank");
      break;
    case 'docs':
      window.open("https://www.kdocs.cn/l/csuQCyb2syyah", "_blank");
      break;
  }
}
```

**代码讲解**：
- `switch` 语句根据按钮类型分发
- `window.open(url, "_blank")` 在新标签页打开链接
- GitHub 和文档地址需替换为实际地址

#### 键盘事件

```javascript
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && searchOpen) toggleSearch();
});
```

按 ESC 键关闭搜索视图。

### 4.8 设置页逻辑模块（settings.js）
#### 功能

- 渲染配色方案选择器
- 切换配色并实时预览
- 返回主页

#### 函数

**`renderThemeOptions()`**

根据 `THEMES` 数组渲染配色选择网格，当前主题标记为 `.active` 并显示"当前使用"。

```javascript
// 输出结构
<div class="theme-option theme-sakura active">
  <div class="theme-preview">
    <span></span><span></span><span></span>
  </div>
  <div class="theme-name">樱粉</div>
  <div class="theme-current-badge">当前使用</div>
</div>
```

**`selectTheme(themeId)`**

应用新主题并重新渲染选择器。

```javascript
selectTheme("ocean");
```

**`goBack()`**

带过渡动画返回主页。

### 4.9 页面过渡动画
#### 进入动画

页面加载时，`body` 添加 `.page-enter` 类：

```css
body.page-enter {
  animation: pageFadeIn 0.45s var(--ease-out);
}
@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### 离开动画

跳转前，`body` 替换为 `.page-leave` 类：

```css
body.page-leave {
  animation: pageFadeOut 0.3s ease forwards;
}
@keyframes pageFadeOut {
  to { opacity: 0; transform: translateY(-8px); }
}
```

#### 跳转流程

```
用户点击设置按钮
    ↓
handleAction('settings')
    ↓
openSettings()
    ↓
navigateTo("settings.html")
    ↓
body 添加 .page-leave（0.28s 淡出）
    ↓
window.location.href = "settings.html"
    ↓
新页面加载，body 添加 .page-enter（0.45s 淡入）
```

### 4.10 全局函数调用关系
```
用户操作
  │
  ├── 点击更多按钮 → toggleSearch() → 搜索视图动画
  │
  ├── 点击设置按钮 → handleAction('settings') → openSettings() → navigateTo()
  │
  ├── 点击GitHub按钮 → handleAction('github') → window.open()
  │
  ├── 点击文档按钮 → handleAction('docs') → window.open()
  │
  ├── 轮播翻页 → blockNext/Prev() → updateBlock() → resetAutoPlay()
  │
  ├── 轮播圆点 → goToBlock() → updateBlock() → resetAutoPlay()
  │
  ├── 音乐播放 → togglePlay() → startProgress/stopProgress()
  ├── 音乐切歌 → prevMusic/nextMusic() → applyMusic()
  ├── 进度点击 → seekMusic() → updateProgressUI()
  │
  ├── 标签点击 → setActiveTag() → renderTags() + renderTimeline()
  ├── 搜索输入 → renderTimeline()
  ├── 搜索返回 → toggleSearch()
  │
  └── ESC键 → toggleSearch()
```
