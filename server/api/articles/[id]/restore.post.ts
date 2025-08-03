import { articlesDB } from "~/server/db/articles";

export default defineEventHandler((event) => {
  const articleId = parseInt(event.context.params!.id, 10);
  const article = articlesDB.find((a) => a.id === articleId);

  if (!article) {
    throw createError({
      statusCode: 404,
      statusMessage: "Article not found",
    });
  }

  article.status = "published";

  setResponseStatus(event, 200);
  return { success: true, article };
});
