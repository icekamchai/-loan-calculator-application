import { useFirebaseAuth } from "~/composables/useFirebaseAuth";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useFirebaseAuth();

  if (to.path.startsWith("/articles")) {
    if (!user.value) {
      return navigateTo({
        path: "/auth/login",
        query: {
          redirect: to.fullPath,
        },
      });
    }
  }
});
