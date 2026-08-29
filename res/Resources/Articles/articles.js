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
    title: "函数极值点问题——含参指数型双极值点条件",
    date: "2026-08-29",
    excerpt: "已知函数 f(x)=2a^x-ex²，通过换元与图像分析，推导双极值点条件下参数 a 的取值范围。",
    cover: "",
    tags: ["数学", "导数", "极值", "函数"],
    url: "https://www.kdocs.cn/l/cnuFStaqc8R2"
  }
];

/* 根据 id 获取文章 */
function getArticleById(id) {
  return articles.find(a => a.id === id) || null;
}
