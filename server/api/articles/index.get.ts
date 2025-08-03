import { articlesDB, type Article } from "~/server/db/articles";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 6;

  const searchQuery = (query.q as string)?.toLowerCase() || "";
  const filterCategory = (query.category as string) || "";
  const filterTag = (query.tag as string) || "";
  const sortBy = (query.sortBy as string) || "publishedAt";
  const now = new Date();

  const startDate = query.startDate as string;
  const endDate = query.endDate as string;

  const calculateReadingTime = (content: string): number => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, "");
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  let filteredArticles = articlesDB.filter(
    (article) =>
      article.status === "published" && new Date(article.publishedAt) <= now
  );

  if (searchQuery) {
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery) ||
        article.content.toLowerCase().includes(searchQuery)
    );
  }

  if (filterCategory) {
    filteredArticles = filteredArticles.filter(
      (article) => article.category === filterCategory
    );
  }
  if (filterTag) {
    filteredArticles = filteredArticles.filter((article) =>
      article.tags.includes(filterTag)
    );
  }

  filteredArticles.sort((a, b) => {
    if (sortBy === "publishedAt") {
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    if (sortBy === "viewCount") {
      return b.viewCount - a.viewCount;
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "readingTime") {
      return calculateReadingTime(a.content) - calculateReadingTime(b.content);
    }
    return 0;
  });

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    filteredArticles = filteredArticles.filter((article) => {
      const publishedDate = new Date(article.publishedAt);
      return publishedDate >= start && publishedDate <= end;
    });
  }

  const totalArticles = filteredArticles.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

  return {
    articles: paginatedArticles,
    total: totalArticles,
  };
});
