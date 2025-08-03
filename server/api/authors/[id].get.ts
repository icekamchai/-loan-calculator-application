import { authorsDB } from "~/server/db/authors";
import { articlesDB } from "~/server/db/articles";

export default defineEventHandler((event) => {
  const authorId = event.context.params?.id;
  const author = authorsDB.find((a) => a.id === authorId);

  if (!author) {
    throw createError({
      statusCode: 404,
      statusMessage: "Author not found",
    });
  }

  const articles = articlesDB.filter(
    (article) => article.authorId === authorId && article.status === "published"
  );

  return {
    author,
    articles,
  };
});
