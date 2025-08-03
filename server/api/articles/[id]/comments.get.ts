import { articlesDB } from "~/server/db/articles";

export default defineEventHandler((event) => {
  const articleId = parseInt(event.context.params!.id, 10);
  const article = articlesDB.find((a) => a.id === articleId);

  if (article) {
    return article.comments.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  throw createError({ statusCode: 404, statusMessage: "Article not found" });
});
