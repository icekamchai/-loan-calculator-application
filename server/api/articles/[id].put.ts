import {
  articlesDB,
  type Article,
  type VersionHistory,
} from "~/server/db/articles";

export default defineEventHandler(async (event) => {
  const articleId = parseInt(getRouterParam(event, "id") as string);
  const body = await readBody(event);
  const article = articlesDB.find((a) => a.id === articleId);

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: "Article not found" });
  }

  const hasChanges =
    body.title !== article.title ||
    body.content !== article.content ||
    body.excerpt !== article.excerpt;

  if (hasChanges) {
    if (!article.versionHistory) {
      article.versionHistory = [];
    }

    const currentVersion: VersionHistory = {
      timestamp: new Date().toISOString(),
      editorId: "admin",
      changes: `อัปเดตบทความ`,
    };
    article.versionHistory.push(currentVersion);
  }

  article.title = body.title || article.title;
  article.content = body.content || article.content;
  article.excerpt = body.excerpt || article.excerpt;
  article.category = body.category || article.category;
  article.tags = body.tags || article.tags;

  return article;
});
