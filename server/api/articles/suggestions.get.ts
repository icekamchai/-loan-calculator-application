import { getQuery } from "h3";
import { getSuggestionsLogic } from "./suggestions.logic";

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const searchQuery = (query.q as string)?.toLowerCase() || "";
  return getSuggestionsLogic(searchQuery);
});
