import { getArticleStats } from "./stats.logic";

export default defineEventHandler(() => {
  return getArticleStats();
});
