<script setup lang="ts">
import type { Article } from '~/server/db/articles';

// สร้าง interface ใหม่สำหรับบทความที่ถูก highlight
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
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
const categories = ['การเงินส่วนบุคคล', 'การลงทุน'];
const allTags = [
    'วางแผนการเงิน',
    'ออมเงิน',
    'ลงทุน',
    'ดอกเบี้ย',
    'ระยะยาว',
    'มนุษย์เงินเดือน'
];

const sortOptions = [
    { title: 'ใหม่ล่าสุด', value: 'publishedAt' },
    { title: 'ยอดนิยม', value: 'viewCount' },
    { title: 'ตามตัวอักษร', value: 'title' },
    { title: 'เวลาในการอ่าน', value: 'readingTime' },
];
const formattedStartDate = computed(() => startDate.value ? new Date(startDate.value).toLocaleDateString('th-TH') : '');
const formattedEndDate = computed(() => endDate.value ? new Date(endDate.value).toLocaleDateString('th-TH') : '');

// === Search Suggestions Logic ===
const suggestions = ref<{ id: number; title: string; highlightedTitle: string; }[]>([]);
const isSearching = ref(false);

let debounceTimeout: NodeJS.Timeout | null = null;
watch(searchQuery, (newValue) => {
    if (debounceTimeout) {
        clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(async () => {
        if (newValue.length > 1) {
            isSearching.value = true;
            try {
                const response = await $fetch<{ id: number; title: string; highlightedTitle: string; }[]>('/api/articles/suggestions', {
                    query: { q: newValue }
                });
                suggestions.value = response;
            } catch (e) {
                console.error("Failed to fetch suggestions", e);
                suggestions.value = [];
            } finally {
                isSearching.value = false;
            }
        } else {
            suggestions.value = [];
        }
    }, 300); // 300ms debounce
});
// === End Search Suggestions Logic ===


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
            startDate: startDate.value,
            endDate: endDate.value,
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

// === Search Highlighting Logic ===
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
// === End Search Highlighting Logic ===

</script>


<template>
    <v-container>
        <v-row class="mb-6" align="center" no-gutters>
            <v-col>
                <h1 class="text-h4">บทความทั้งหมด</h1>
            </v-col>
            <v-col class="text-right">
                <v-btn to="/dashboard" variant="outlined" prepend-icon="mdi-view-dashboard-outline">
                    แดชบอร์ด
                </v-btn>
                <v-btn to="/articles/archived" color="error" variant="outlined" prepend-icon="mdi-archive-outline">
                    กู้คืน
                </v-btn>
                <v-btn to="/articles/new" color="primary" variant="flat" prepend-icon="mdi-plus">
                    สร้างบทความใหม่
                </v-btn>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" md="4" class="relative">
                <!-- Dropdown menu for suggestions -->
                <v-text-field v-model="searchQuery" label="ค้นหาบทความ..." variant="solo-filled"
                    prepend-inner-icon="mdi-magnify" clearable hide-details />

                <!-- Suggestions dropdown -->
                <v-menu v-if="suggestions.length > 0 && searchQuery.length > 1" activator="parent">
                    <v-list class="bg-white">
                        <v-list-item v-for="suggestion in suggestions" :key="suggestion.id"
                            @click="searchQuery = suggestion.title">
                            <v-list-item-title v-html="suggestion.highlightedTitle"></v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-col>
            <v-col cols="12" md="3">
                <v-select v-model="selectedCategory" :items="categories" label="กรองตามหมวดหมู่" variant="solo-filled"
                    clearable hide-details />
            </v-col>
            <v-col cols="12" md="2">
                <v-select v-model="selectedTag" :items="allTags" label="กรองตามแท็ก" variant="solo-filled" clearable
                    hide-details />
            </v-col>
            <v-col cols="12" md="3">
                <v-select v-model="sortBy" :items="sortOptions" item-title="title" item-value="value"
                    label="เรียงลำดับตาม" variant="solo-filled" hide-details />
            </v-col>
        </v-row>

        <v-row>
        </v-row>

        <v-row class="mt-n2 mb-2">
            <v-col cols="12" md="3">
                <v-menu :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                        <v-text-field :model-value="formattedStartDate" label="วันที่เริ่มต้น"
                            prepend-inner-icon="mdi-calendar" readonly v-bind="props" variant="solo-filled"
                            hide-details></v-text-field>
                    </template>
                    <v-date-picker v-model="startDate" hide-header></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="12" md="3">
                <v-menu :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                        <v-text-field :model-value="formattedEndDate" label="วันที่สิ้นสุด"
                            prepend-inner-icon="mdi-calendar" readonly v-bind="props" variant="solo-filled"
                            hide-details></v-text-field>
                    </template>
                    <v-date-picker v-model="endDate" hide-header></v-date-picker>
                </v-menu>
            </v-col>
            <v-col cols="auto" class="d-flex align-center">
                <v-btn v-if="startDate || endDate" @click="clearDates" variant="text">
                    ล้างวันที่
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
                    <v-card-title v-html="article.highlightedTitle"></v-card-title>
                    <v-card-subtitle>{{ article.category }}</v-card-subtitle>
                    <v-card-text v-html="article.highlightedExcerpt"></v-card-text>
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
    </v-container>
</template>


<style>
.highlight {
    background-color: yellow;
    font-weight: bold;
}
</style>