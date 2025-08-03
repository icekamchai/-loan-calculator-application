<script setup lang="ts">
import type { Article } from '~/server/db/articles';

interface HighlightedArticle extends Article {
    highlightedTitle: string;
    highlightedExcerpt: string;
}

const page = ref(1);
const itemsPerPage = 6;
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('publishedAt');
const selectedTag = ref('');
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const showFilterDialog = ref(false);

const categories = ['การเงินส่วนบุคคล', 'การลงทุน'];
const allTags = [
    'วางแผนการเงิน', 'ออมเงิน', 'ลงทุน', 'ดอกเบี้ย', 'ระยะยาว', 'มนุษย์เงินเดือน', 'หุ้น', 'มือใหม่', 'หนี้สิน', 'กองทุนรวม', 'ภาษี', 'RMF', 'SSF', 'อสังหาริมทรัพย์', 'Passive Income', 'ประกัน', 'ความเสี่ยง', 'เทรนด์', 'อนาคต', 'ทองคำ'
];

const sortOptions = [
    { title: 'ใหม่ล่าสุด', value: 'publishedAt' },
    { title: 'ยอดนิยม', value: 'viewCount' },
    { title: 'ตามตัวอักษร', value: 'title' },
    { title: 'เวลาในการอ่าน', value: 'readingTime' },
];

const suggestions = ref<{ id: number; title: string; highlightedTitle: string; }[]>([]);
const isSearching = ref(false);
const showSuggestions = ref(false);

const debouncedFetchSuggestions = debounce(async (newValue: string) => {
    if (newValue.length > 1) {
        isSearching.value = true;
        try {
            const response = await $fetch<any[]>('/api/articles/suggestions', {
                query: { q: newValue }
            });
            suggestions.value = response;
            showSuggestions.value = true;
        } catch (e) {
            console.error("Failed to fetch suggestions", e);
            suggestions.value = [];
        } finally {
            isSearching.value = false;
        }
    } else {
        suggestions.value = [];
        showSuggestions.value = false;
    }
}, 300);

watch(searchQuery, (newValue) => {
    debouncedFetchSuggestions(newValue);
});
function hideSuggestions() {
    window.setTimeout(() => {
        showSuggestions.value = false;
    }, 200);
}


const { data, pending, error } = await useAsyncData(
    'paginatedArticles',
    () => $fetch<{ articles: Article[], total: number }>('/api/articles', {
        query: {
            q: searchQuery.value,
            category: selectedCategory.value,
            sortBy: sortBy.value,
            page: page.value,
            limit: itemsPerPage,
            tag: selectedTag.value,
            startDate: startDate.value ? startDate.value.toISOString().split('T')[0] : undefined,
            endDate: endDate.value ? endDate.value.toISOString().split('T')[0] : undefined,
        }
    }),
    {
        watch: [page, searchQuery, selectedCategory, selectedTag, sortBy, startDate, endDate]
    }
);

function clearDates() {
    startDate.value = null;
    endDate.value = null;
}
const articles = computed(() => data.value?.articles || []);
const pageCount = computed(() => {
    if (!data.value?.total) return 0;
    return Math.ceil(data.value.total / itemsPerPage);
});


const highlightText = (text: string, query: string) => {
    if (!query) {
        return text;
    }
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
};

const highlightedArticles = computed<HighlightedArticle[]>(() => {
    if (!articles.value) {
        return [];
    }
    if (!searchQuery.value) {
        return articles.value.map(article => ({
            ...article,
            highlightedTitle: article.title,
            highlightedExcerpt: article.excerpt
        }));
    }
    return articles.value.map(article => ({
        ...article,
        highlightedTitle: highlightText(article.title, searchQuery.value),
        highlightedExcerpt: highlightText(article.excerpt, searchQuery.value)
    }));
});

function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): void => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };
}
</script>


<template>
    <v-container>
        <v-row class="mb-6" align="center" no-gutters>
            <v-col>
                <h1 class="text-h4">บทความทั้งหมด</h1>
            </v-col>

            <v-col class="text-right d-flex ga-2 justify-end">
                <div class="d-none d-md-flex ga-2">
                    <v-btn to="/dashboard" variant="outlined" prepend-icon="mdi-view-dashboard-outline">
                        แดชบอร์ด
                    </v-btn>
                    <v-btn to="/articles/archived" variant="outlined" prepend-icon="mdi-archive-outline">
                        ที่พักไว้
                    </v-btn>
                    <v-btn to="/articles/new" color="primary" variant="flat" prepend-icon="mdi-plus">
                        สร้างบทความใหม่
                    </v-btn>
                </div>

                <div class="d-md-none">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn v-bind="props" color="primary" icon="mdi-dots-vertical" />
                        </template>
                        <v-list>
                            <v-list-item to="/articles/new" prepend-icon="mdi-plus" title="สร้างบทความใหม่" />
                            <v-list-item to="/dashboard" prepend-icon="mdi-view-dashboard-outline" title="แดชบอร์ด" />
                            <v-list-item to="/articles/archived" prepend-icon="mdi-archive-outline"
                                title="ที่พักไว้ (กู้คืน)" />
                        </v-list>
                    </v-menu>
                </div>
            </v-col>
        </v-row>

        <v-row>
            <v-col class="position-relative">
                <v-text-field v-model="searchQuery" label="ค้นหาบทความ..." variant="solo-filled"
                    prepend-inner-icon="mdi-magnify" clearable hide-details @focus="showSuggestions = true"
                    @blur="hideSuggestions" />
                <v-card v-if="showSuggestions && suggestions.length > 0" class="position-absolute w-100" elevation="5"
                    style="z-index: 10; top: 60px;">
                    <v-list>
                        <v-list-item v-for="suggestion in suggestions" :key="suggestion.id"
                            @mousedown="searchQuery = suggestion.title">
                            <v-list-item-title v-html="suggestion.highlightedTitle" />
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>

            <v-col cols="auto">
                <v-btn @click="showFilterDialog = true" size="large" height="56" variant="tonal">
                    <v-icon>mdi-filter-variant</v-icon>
                    <span class="d-none d-sm-inline ml-2">ตัวกรอง</span>
                </v-btn>
            </v-col>
        </v-row>

        <v-divider class="my-6" />

        <div v-if="pending" class="text-center">
            <v-progress-circular indeterminate color="primary" />
        </div>
        <v-alert v-else-if="error" type="error">
            ไม่สามารถโหลดข้อมูลบทความได้
        </v-alert>
        <v-sheet v-else-if="articles.length === 0"
            class="d-flex flex-column align-center justify-center pa-10 text-center" rounded="lg" height="300">
            <v-icon icon="mdi-text-box-search-outline" size="64" class="mb-4" />
            <h2 class="text-h6 mb-2">ไม่พบบทความ</h2>
            <p class="text-body-2">ไม่พบข้อมูลที่ตรงกับเงื่อนไขของคุณ</p>
        </v-sheet>
        <v-row v-else>
            <v-col v-for="article in highlightedArticles" :key="article.id" cols="12" md="6" lg="4">
                <v-card :to="`/articles/${article.id}`" hover elevation="2">
                    <v-img :src="article.coverImage" height="200px" cover />
                    <v-card-title v-html="article.highlightedTitle" />
                    <v-card-subtitle>{{ article.category }}</v-card-subtitle>
                    <v-card-text v-html="article.highlightedExcerpt" />
                    <v-card-actions>
                        <v-spacer />
                        <v-btn color="primary" variant="text">อ่านต่อ</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <v-row v-if="pageCount > 1" justify="center" class="mt-8">
            <v-col cols="auto">
                <v-pagination v-model="page" :length="pageCount" rounded="circle" />
            </v-col>
        </v-row>

        <v-dialog v-model="showFilterDialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar color="surface">
                    <v-btn icon="mdi-close" @click="showFilterDialog = false" />
                    <v-toolbar-title>ตัวกรองเพิ่มเติม</v-toolbar-title>
                    <v-spacer />
                    <v-toolbar-items>
                        <v-btn variant="text" @click="showFilterDialog = false">เสร็จสิ้น</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <v-list class="bg-transparent">
                        <v-select v-model="selectedCategory" :items="categories" label="หมวดหมู่" variant="outlined"
                            clearable class="mb-4" />
                        <v-select v-model="selectedTag" :items="allTags" label="แท็ก" variant="outlined" clearable
                            class="mb-4" />
                        <v-select v-model="sortBy" :items="sortOptions" item-title="title" item-value="value"
                            label="เรียงตาม" variant="outlined" class="mb-4" />
                        <v-divider class="my-4" />
                        <p class="text-subtitle-1 mb-2">กรองตามช่วงวันที่</p>
                        <v-date-picker v-model="startDate" title="วันที่เริ่มต้น" class="mb-2" />
                        <v-date-picker v-model="endDate" title="วันที่สิ้นสุด" />
                        <v-btn v-if="startDate || endDate" @click="clearDates" variant="text" block class="mt-4">
                            ล้างวันที่
                        </v-btn>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>


<style>
.highlight {
    background-color: yellow;
    font-weight: bold;
}
</style>