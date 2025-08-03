import { articlesDB } from "~/server/db/articles";

export default defineEventHandler((event) => {
  const articleId = parseInt(getRouterParam(event, "id") as string);
  const article = articlesDB.find((a) => a.id === articleId);

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: "Article not found" });
  }

  // ส่งกลับข้อมูล history แบบเรียงจากใหม่ไปเก่า
  return (
    article.versionHistory?.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) || []
  );
});
