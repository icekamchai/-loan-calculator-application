import { articlesDB, type Article } from "~/server/db/articles";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.title || !body.content) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title and content are required",
    });
  }

  const newArticleStatus = body.status || "draft";

  const newArticle: Article = {
    id: articlesDB.length + 1,
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    coverImage: body.coverImage,
    category: body.category,
    tags: body.tags,
    authorId: body.authorId,
    publishedAt: body.publishedAt || new Date().toISOString(),
    status: newArticleStatus,
    viewCount: 0,
    isFeatured: true,
    comments: [],
    metaTitle: body.metaTitle,
    metaDescription: body.metaDescription,
    series: body.series,
  };

  articlesDB.push(newArticle);

  setResponseStatus(event, 201);

  return newArticle;
});
