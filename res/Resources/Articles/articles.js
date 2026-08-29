/* ============================================================
   文章数据对象
   每篇文章是一个对象，字段说明：
     id       : 唯一标识
     title    : 文章标题
     date     : 发布日期
     excerpt  : 摘要
     cover    : 封面图路径（相对于 Resources/Articles/）
     tags     : 标签数组
     url      : 点击跳转链接
   ============================================================ */
const articles = [
  {
    id: 1,
    title: "Leetcode 百题 —— 将有序数组转换为二叉搜索树",
    date: "2026-04-27",
    excerpt: "用中间的数做递归，经典的分治思路，一篇讲透二叉搜索树的构造。",
    cover: "",
    tags: ["算法", "Leetcode", "题解", "工作"],
    url: "#"
  },
  {
    id: 2,
    title: "深入理解 JavaScript 事件循环机制",
    date: "2026-04-20",
    excerpt: "从宏任务到微任务，从浏览器到 Node，一篇文章把 Event Loop 讲明白。",
    cover: "",
    tags: ["前端", "JavaScript", "原理"],
    url: "#"
  },
  {
    id: 3,
    title: "CSS 现代布局完全指南：Grid 与 Flexbox",
    date: "2026-04-15",
    excerpt: "告别浮动布局的混乱，掌握 Grid 和 Flexbox 的组合使用技巧。",
    cover: "",
    tags: ["前端", "CSS", "布局"],
    url: "#"
  },
  {
    id: 4,
    title: "我的 2026 年度技术学习路线图",
    date: "2026-04-10",
    excerpt: "新的一年，从基础到进阶，规划一条清晰的成长路径。",
    cover: "",
    tags: ["杂谈", "学习", "规划"],
    url: "#"
  },
  {
    id: 5,
    title: "Vue3 组合式 API 最佳实践总结",
    date: "2026-04-05",
    excerpt: "ref 还是 reactive？computed 怎么用？一文梳理组合式 API 的常见模式。",
    cover: "",
    tags: ["前端", "Vue", "框架"],
    url: "#"
  }
];

/* 根据 id 获取文章 */
function getArticleById(id) {
  return articles.find(a => a.id === id) || null;
}
