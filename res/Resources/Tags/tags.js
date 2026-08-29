/* ============================================================
   标签统一配置文件
   控制标签栏显示顺序、标签颜色等
   文章数据中的 tags 字段只需填写标签名称，与此处对应
   ============================================================ */
const tagConfig = [
  { name: "算法",     color: "#ec4899" },
  { name: "Leetcode", color: "#f59e0b" },
  { name: "题解",     color: "#10b981" },
  { name: "工作",     color: "#6366f1" },
  { name: "前端",     color: "#3b82f6" },
  { name: "JavaScript", color: "#eab308" },
  { name: "原理",     color: "#8b5cf6" },
  { name: "CSS",      color: "#ec4899" },
  { name: "布局",     color: "#06b6d4" },
  { name: "杂谈",     color: "#64748b" },
  { name: "学习",     color: "#22c55e" },
  { name: "规划",     color: "#f97316" },
  { name: "Vue",      color: "#10b981" },
  { name: "框架",     color: "#8b5cf6" }
];

/* 获取所有标签名称数组（按配置顺序） */
function getAllTags() {
  return tagConfig.map(t => t.name);
}

/* 根据标签名获取颜色，找不到返回默认强调色 */
function getTagColor(name) {
  const tag = tagConfig.find(t => t.name === name);
  return tag ? tag.color : "var(--accent)";
}
