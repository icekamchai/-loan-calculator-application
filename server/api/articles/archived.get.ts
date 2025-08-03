import { articlesDB } from "~/server/db/articles";

export default defineEventHandler(() => {
  const archivedArticles = articlesDB.filter(
    (article) => article.status === "archived"
  );

  archivedArticles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return archivedArticles;
});
