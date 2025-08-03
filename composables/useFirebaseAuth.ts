// composables/useFirebaseAuth.ts
import { ref } from "vue";
import { onAuthStateChanged, type User, type Auth } from "firebase/auth";
import { useNuxtApp } from "#app";

// This user ref will hold the global state
const user = ref<User | null>(null);

// This flag ensures the listener is only set up once
let authStateListenerInitialized = false;

export function useFirebaseAuth() {
  // We only set up the listener on the client-side and only once
  if (process.client && !authStateListenerInitialized) {
    // Get the auth instance from our Nuxt plugin
    const { $auth } = useNuxtApp();

    onAuthStateChanged($auth as Auth, (authUser) => {
      user.value = authUser;
    });

    authStateListenerInitialized = true;
  }

  return { user };
}
