<script setup lang="ts">
import ThemeToggle from '~/components/ThemeToggle.vue';
import UserAvatar from '~/components/UserAvatar.vue';

const drawer = ref(false)

const navItems = [
    { title: 'Home', to: '/', icon: 'mdi-home-outline' },
    { title: 'Calculator', to: '/calculator', icon: 'mdi-calculator' },
    { title: 'Comparison', to: '/comparison', icon: 'mdi-scale-balance' },
    { title: 'Articles', to: '/articles', icon: 'mdi-post-outline' },
];
</script>

<template>
    <v-app>
        <v-app-bar color="surface" density="compact" flat class="px-4">
            <ClientOnly>
                <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none" />
            </ClientOnly>

            <v-app-bar-title>
                <div class="d-flex align-center">
                    <v-icon start icon="mdi-calculator-variant-outline"></v-icon>
                    <span class="font-weight-bold">Loan Calculator</span>
                </div>
            </v-app-bar-title>

            <v-spacer></v-spacer>

            <ClientOnly>
                <div class="d-none d-md-flex">
                    <v-btn v-for="item in navItems" :key="item.title" :to="item.to" text>
                        {{ item.title }}
                    </v-btn>
                </div>
            </ClientOnly>

            <ClientOnly>
                <ThemeToggle />
            </ClientOnly>

            <ClientOnly>
                <UserAvatar />
            </ClientOnly>
        </v-app-bar>

        <v-navigation-drawer v-model="drawer" temporary>
            <v-list>
                <v-list-item v-for="item in navItems" :key="item.title" :to="item.to" :prepend-icon="item.icon"
                    :title="item.title" />
            </v-list>
        </v-navigation-drawer>

        <v-main>
            <NuxtPage />
        </v-main>

        <v-footer app class="d-flex justify-center text-caption" density="compact" flat>
            <span>Loan Calculator App © 2025</span>
        </v-footer>
    </v-app>
</template>