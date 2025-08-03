import { articlesDB } from "~/server/db/articles";

export default defineEventHandler(async (event) => {
  const articleId = parseInt(event.context.params!.id, 10);
  const articleIndex = articlesDB.findIndex((a) => a.id === articleId);

  if (articleIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: "Article not found",
    });
  }

  articlesDB[articleIndex].status = "archived";

  return { success: true, message: "Article archived" };
});
