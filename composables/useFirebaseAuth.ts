import { ref } from "vue";
import { onAuthStateChanged, type User, type Auth } from "firebase/auth";
import { useNuxtApp } from "#app";

const user = ref<User | null>(null);

let authStateListenerInitialized = false;

export function useFirebaseAuth() {
  if (process.client && !authStateListenerInitialized) {
    const { $auth } = useNuxtApp();

    onAuthStateChanged($auth as Auth, (authUser) => {
      user.value = authUser;
    });

    authStateListenerInitialized = true;
  }

  return { user };
}
