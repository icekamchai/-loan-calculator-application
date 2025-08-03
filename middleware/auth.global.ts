// middleware/auth.global.ts
import { useFirebaseAuth } from "~/composables/useFirebaseAuth";
import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useFirebaseAuth();

  // Protect all routes starting with /articles
  if (to.path.startsWith("/articles")) {
    // If there is no user logged in, redirect to the login page with a redirect query
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
