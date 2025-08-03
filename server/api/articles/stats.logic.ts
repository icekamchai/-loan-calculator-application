import { articlesDB, type Article } from "~/server/db/articles";

export function getArticleStats(articles: Article[] = articlesDB) {
  const totalArticles = articles.length;
  const publishedCount = articles.filter(
    (a) => a.status === "published"
  ).length;
  const archivedCount = articles.filter((a) => a.status === "archived").length;

  const totalViews = articles.reduce(
    (sum, article) => sum + article.viewCount,
    0
  );

  const totalComments = articles.reduce(
    (sum, article) => sum + article.comments.length,
    0
  );

  const topArticles = [...articles]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3)
    .map((a) => ({ id: a.id, title: a.title, viewCount: a.viewCount }));

  return {
    totalArticles,
    publishedCount,
    archivedCount,
    totalViews,
    totalComments,
    topArticles,
  };
}
