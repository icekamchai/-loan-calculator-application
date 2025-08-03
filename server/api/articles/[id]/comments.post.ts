import { articlesDB, type Comment } from "~/server/db/articles";

export default defineEventHandler(async (event) => {
  const articleId = parseInt(event.context.params!.id, 10);
  const article = articlesDB.find((a) => a.id === articleId);
  const body = await readBody(event);

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: "Article not found" });
  }
  if (!body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: "Comment content is required",
    });
  }

  const newComment: Comment = {
    id: Date.now(),
    author: body.author || "ผู้ไม่ประสงค์ออกนาม",
    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    content: body.content,
    createdAt: new Date().toISOString(),
  };

  article.comments.push(newComment);
  setResponseStatus(event, 201); // 201 Created
  return newComment;
});
