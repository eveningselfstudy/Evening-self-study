/* ============================================================
   主页预览配置对象
   三个板块（large / wide / small）各自引用文章 id 列表
   小白点数量 = 对应板块的文章数量，数量 <= 1 时自动隐藏指示器
   ============================================================ */
const previewConfig = {
  large: {
    articleIds: [1]
  },
  wide: {
    articleIds: []
  },
  small: {
    articleIds: []
  }
};

/* 根据板块名获取该板块的文章对象列表 */
function getPreviewArticles(blockName) {
  const ids = previewConfig[blockName]?.articleIds || [];
  return ids.map(id => getArticleById(id)).filter(Boolean);
}
