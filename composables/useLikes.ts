import { ref, onMounted } from "vue";

const LIKED_ARTICLES_KEY = "liked_articles";

export function useLikes() {
  const likedArticles = ref<Set<number>>(new Set());

  onMounted(() => {
    if (process.client) {
      const storedLikes = localStorage.getItem(LIKED_ARTICLES_KEY);
      if (storedLikes) {
        likedArticles.value = new Set(JSON.parse(storedLikes));
      }
    }
  });

  const toggleLike = (articleId: number) => {
    if (likedArticles.value.has(articleId)) {
      likedArticles.value.delete(articleId);
    } else {
      likedArticles.value.add(articleId);
    }

    localStorage.setItem(
      LIKED_ARTICLES_KEY,
      JSON.stringify(Array.from(likedArticles.value))
    );
  };

  const isLiked = (articleId: number) => {
    return likedArticles.value.has(articleId);
  };

  return {
    toggleLike,
    isLiked,
  };
}
