import { articlesDB } from "~/server/db/articles";

export default defineEventHandler(() => {
  const featuredArticles = articlesDB
    .filter(
      (article) => article.isFeatured === true && article.status === "published"
    )
    .slice(0, 3);

  return featuredArticles;
});
