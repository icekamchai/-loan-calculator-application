import { articlesDB } from "~/server/db/articles";

export function getSuggestionsLogic(searchQuery: string) {
  if (!searchQuery || searchQuery.length < 2) {
    return [];
  }

  const highlightText = (text: string, query: string): string => {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const suggestions = articlesDB
    .filter(
      (article) =>
        article.status === "published" &&
        (article.title.toLowerCase().includes(searchQuery) ||
          article.excerpt.toLowerCase().includes(searchQuery))
    )
    .slice(0, 5)
    .map((article) => ({
      id: article.id,
      title: article.title,
      highlightedTitle: highlightText(article.title, searchQuery),
    }));

  return suggestions;
}
