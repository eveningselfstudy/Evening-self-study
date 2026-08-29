/* ============================================================
   标签统一配置文件
   控制标签栏显示顺序、标签颜色等
   文章数据中的 tags 字段只需填写标签名称，与此处对应
   ============================================================ */
const tagConfig = [
  { name: "数学", color: "#2563eb" },
  { name: "导数", color: "#0891b2" },
  { name: "极值", color: "#7c3aed" },
  { name: "函数", color: "#059669" }
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
