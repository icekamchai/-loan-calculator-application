<script setup lang="ts">
import type { Article } from '~/server/db/articles';

const { data: featured, pending } = await useAsyncData(
    'featuredArticles',
    () => $fetch<Article[]>('/api/articles/featured')
);
</script>

<template>
    <v-sheet rounded="lg" class="pa-6">
        <h2 class="text-h5 mb-4">บทความแนะนำ</h2>
        <v-divider class="mb-4" />

        <div v-if="pending" class="text-center">
            <v-progress-circular indeterminate />
        </div>

        <v-row v-else-if="featured && featured.length > 0">
            <v-col v-for="article in featured" :key="article.id" cols="12" md="4">
                <v-card :to="`/articles/${article.id}`" hover elevation="2">
                    <v-img :src="article.coverImage" height="200px" cover />
                    <v-card-title>{{ article.title }}</v-card-title>
                    <v-card-subtitle>{{ article.category }}</v-card-subtitle>
                    <v-card-text>{{ article.excerpt }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <p v-else class="text-center text-medium-emphasis">
            ยังไม่มีบทความแนะนำในขณะนี้
        </p>
    </v-sheet>
</template>