import { articlesDB } from "~/server/db/articles";
import { authorsDB } from "~/server/db/authors";

export default defineEventHandler((event) => {
  const articleId = parseInt(getRouterParam(event, "id") as string);
  const article = articlesDB.find((a) => a.id === articleId);

  if (!article) {
    throw createError({ statusCode: 404, statusMessage: "Article not found" });
  }

  const relatedArticles = articlesDB
    .filter(
      (a) =>
        a.id !== article.id &&
        ((article.series && a.series === article.series) ||
          (!article.series && a.category === article.category))
    )
    .slice(0, 3);

  const author = authorsDB.find((author) => author.id === article.authorId);

  return {
    ...article,
    author,
    related: relatedArticles,
  };
});
