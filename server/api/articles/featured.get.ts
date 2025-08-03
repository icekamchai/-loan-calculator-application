import { articlesDB } from "~/server/db/articles";

export default defineEventHandler((event) => {
  return articlesDB.filter(
    (article) => article.status === "published" && article.isFeatured
  );
});
