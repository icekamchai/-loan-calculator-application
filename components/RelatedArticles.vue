<script setup lang="ts">
import type { Article } from '~/server/db/articles';

const props = defineProps<{
    articles: Article[];
}>();
</script>

<template>
    <div v-if="props.articles?.length > 0">
        <h3 class="text-h5 mb-4">บทความที่เกี่ยวข้อง</h3>
        <v-row>
            <v-col v-for="article in props.articles" :key="article.id" cols="12" sm="6">
                <v-card :to="`/articles/${article.id}`" hover elevation="2">
                    <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title class="text-subtitle-1">{{ article.title }}</v-card-title>
                            <v-card-subtitle>{{ article.series || article.category }}</v-card-subtitle>
                            <v-card-actions>
                                <v-btn color="primary" variant="text">อ่านต่อ</v-btn>
                            </v-card-actions>
                        </div>
                        <v-avatar class="ma-3" size="100" rounded="lg">
                            <v-img :src="article.coverImage"></v-img>
                        </v-avatar>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>