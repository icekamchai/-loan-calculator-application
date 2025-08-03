import {
  articlesDB,
  type Article,
  type VersionHistory,
} from "~/server/db/articles";

export default defineEventHandler(async (event) => {
  const articleId = parseInt(getRouterParam(event, "id") as string);
  const body = await readBody(event);
  const articleIndex = articlesDB.findIndex((a) => a.id === articleId);

  if (articleIndex === -1) {
    throw createError({ statusCode: 404, statusMessage: "Article not found" });
  }

  const originalArticle = articlesDB[articleIndex];

  const hasChanges =
    body.title !== originalArticle.title ||
    body.content !== originalArticle.content;

  if (hasChanges) {
    const newVersion: VersionHistory = {
      timestamp: new Date().toISOString(),
      editorId: "admin",
      title: originalArticle.title,
      content: originalArticle.content,
    };

    if (!originalArticle.versionHistory) {
      originalArticle.versionHistory = [];
    }

    originalArticle.versionHistory.push(newVersion);
  }

  const updatedArticle = { ...originalArticle, ...body };
  articlesDB[articleIndex] = updatedArticle;

  return updatedArticle;
});
