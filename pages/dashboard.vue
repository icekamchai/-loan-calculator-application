<script setup lang="ts">
const { data: stats, pending } = await useAsyncData(
    'fetchDashboardStats',
    () => $fetch('/api/articles/stats')
)

useSeoMeta({ title: 'แดชบอร์ดสถิติ' });
</script>

<template>
    <v-container>
        <v-row align="center" class="mb-6">
            <v-col>
                <h1 class="text-h4">แดชบอร์ดสถิติ</h1>
                <p class="text-medium-emphasis">ภาพรวมทั้งหมดของบทความในระบบ</p>
            </v-col>
            <v-col class="text-right">
                <v-btn to="/articles" variant="text" prepend-icon="mdi-arrow-left">
                    กลับไปหน้ารวมบทความ
                </v-btn>
            </v-col>
        </v-row>

        <div v-if="pending" class="text-center pa-10">
            <v-progress-circular indeterminate size="64" />
        </div>

        <div v-else-if="stats">
            <v-row>
                <v-col cols="12" md="4">
                    <v-card variant="tonal" color="primary">
                        <v-card-text class="text-center">
                            <div class="text-h2 font-weight-bold">{{ stats.publishedCount }}</div>
                            <div class="text-subtitle-1">บทความที่เผยแพร่</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card variant="tonal" color="deep-purple">
                        <v-card-text class="text-center">
                            <div class="text-h2 font-weight-bold">{{ stats.totalViews.toLocaleString() }}</div>
                            <div class="text-subtitle-1">ยอดการเข้าชมทั้งหมด</div>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12" md="4">
                    <v-card variant="tonal" color="teal">
                        <v-card-text class="text-center">
                            <div class="text-h2 font-weight-bold">{{ stats.totalComments.toLocaleString() }}</div>
                            <div class="text-subtitle-1">ความคิดเห็นทั้งหมด</div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <v-row class="mt-6">
                <v-col>
                    <v-card>
                        <v-card-title>บทความยอดนิยม (Top 3)</v-card-title>
                        <v-list>
                            <v-list-item v-for="article in stats.topArticles" :key="article.id" :title="article.title"
                                :to="`/articles/${article.id}`">
                                <template #append>
                                    <v-chip color="secondary" size="small" label>
                                        <v-icon start icon="mdi-eye" />
                                        {{ article.viewCount.toLocaleString() }}
                                    </v-chip>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>