import { articlesDB } from "~/server/db/articles";

export default defineEventHandler(async (event) => {
  const articleId = parseInt(event.context.params!.id, 10);
  const article = articlesDB.find((a) => a.id === articleId);

  if (article) {
    article.viewCount++;
    return { success: true, newViewCount: article.viewCount };
  }

  throw createError({
    statusCode: 404,
    statusMessage: "Article not found",
  });
});
