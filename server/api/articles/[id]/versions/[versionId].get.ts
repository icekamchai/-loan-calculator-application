import { articlesDB } from "~/server/db/articles";

export default defineEventHandler((event) => {
  const articleId = parseInt(getRouterParam(event, "id") as string);
  const versionId = parseInt(getRouterParam(event, "versionId") as string);
  const article = articlesDB.find((a) => a.id === articleId);

  if (!article || !article.versionHistory) {
    throw createError({
      statusCode: 404,
      statusMessage: "Article or version history not found",
    });
  }

  const versions = article.versionHistory;

  if (versionId < 0 || versionId >= versions.length) {
    throw createError({ statusCode: 404, statusMessage: "Version not found" });
  }

  const versionToRestore = versions[versions.length - 1 - versionId];

  return versionToRestore;
});
