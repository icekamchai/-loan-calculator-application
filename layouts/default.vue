<script setup lang="ts">
import ThemeToggle from '~/components/ThemeToggle.vue';
import UserAvatar from '~/components/UserAvatar.vue';

const navItems = [
    { title: 'Home', to: '/' },
    { title: 'Calculator', to: '/calculator' },
    { title: 'Comparison', to: '/comparison' },
    { title: 'Articles', to: '/articles' },
];
</script>

<template>
    <v-app>
        <v-app-bar color="surface" density="compact" flat class="px-4">
            <v-app-bar-title>
                <div class="d-flex align-center">
                    <v-icon start icon="mdi-calculator-variant-outline"></v-icon>
                    <span class="font-weight-bold">Loan Calculator</span>
                </div>
            </v-app-bar-title>

            <v-spacer></v-spacer>

            <v-btn v-for="item in navItems" :key="item.title" :to="item.to" text>
                {{ item.title }}
            </v-btn>

            <ThemeToggle />

            <ClientOnly>
                <UserAvatar />
            </ClientOnly>
        </v-app-bar>

        <v-main>
            <NuxtPage />
        </v-main>

        <v-footer app class="d-flex justify-center text-caption" density="compact" flat>
            <span>Loan Calculator App © 2025</span>
        </v-footer>
    </v-app>
</template>