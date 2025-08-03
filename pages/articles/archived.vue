<script setup lang="ts">
import type { Article } from '~/server/db/articles';

const { data: archivedArticles, refresh, pending } = await useAsyncData(
    'archivedArticles',
    () => $fetch<Article[]>('/api/articles/archived')
);

async function restoreArticle(articleId: number) {
    try {
        await $fetch(`/api/articles/${articleId}/restore`, {
            method: 'POST',
        });
        await refresh();
        alert('กู้คืนบทความสำเร็จ!');
    } catch (err) {
        console.error('Failed to restore article', err);
        alert('เกิดข้อผิดพลาดในการกู้คืนบทความ');
    }
}
</script>

<template>
    <v-container>
        <v-row class="mb-6" align="center" no-gutters>
            <v-col>
                <h1 class="text-h4">บทความที่ลบ</h1>
            </v-col>
            <v-col class="text-right">
                <v-btn to="/articles" variant="text" prepend-icon="mdi-arrow-left">
                    กลับไปหน้ารวมบทความ
                </v-btn>
            </v-col>
        </v-row>

        <div v-if="pending" class="text-center pa-10">
            <v-progress-circular indeterminate color="primary" />
        </div>

        <v-alert v-else-if="!archivedArticles || archivedArticles.length === 0" type="info" variant="tonal">
            ไม่มีบทความที่ถูกลบ
        </v-alert>

        <v-card v-else variant="outlined">
            <v-list lines="two">
                <template v-for="(article, index) in archivedArticles" :key="article.id">
                    <v-list-item :title="article.title" :subtitle="`หมวดหมู่: ${article.category}`">
                        <template #append>
                            <v-btn color="secondary" variant="text" @click="restoreArticle(article.id)">
                                <v-icon start icon="mdi-restore" />
                                กู้คืน
                            </v-btn>
                        </template>
                    </v-list-item>
                    <v-divider v-if="index < archivedArticles.length - 1" />
                </template>
            </v-list>
        </v-card>

    </v-container>
</template>