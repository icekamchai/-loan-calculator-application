<script setup lang="ts">
import type { Article as BaseArticle, Comment, VersionHistory } from '~/server/db/articles';
import type { Author } from '~/server/db/authors';
import { useLikes } from '~/composables/useLikes';
import { authorsDB } from '~/server/db/authors';
import RelatedArticles from '~/components/RelatedArticles.vue';

interface ArticleWithAuthor extends BaseArticle {
    author: Author;
    related: BaseArticle[];
}

const route = useRoute();
const router = useRouter();
const articleId = route.params.id as string;
const showVersionHistory = ref(false);
const showErrorMessage = ref(false);
const errorMessage = ref('');
const showDeleteDialog = ref(false);

const article = computed(() => articleData.value);

const { data: articleData, pending, error } = await useAsyncData(
    `fetchArticle:${articleId}`,
    () => $fetch<ArticleWithAuthor>(`/api/articles/${articleId}`)
);

const { data: comments, refresh: refreshComments } = await useAsyncData(
    `fetchComments:${articleId}`,
    () => $fetch<Comment[]>(`/api/articles/${articleId}/comments`)
);

// Fetch Version History
const { data: versions, pending: versionsPending, error: versionsError, refresh: refreshVersions } = await useAsyncData(
    `fetchArticleVersions:${articleId}`,
    () => $fetch<VersionHistory[]>(`/api/articles/${articleId}/versions`)
);

const newComment = ref('');

async function postComment() {
    if (!newComment.value.trim()) return;
    try {
        await $fetch(`/api/articles/${articleId}/comments`, {
            method: 'POST',
            body: { content: newComment.value }
        });
        newComment.value = '';
        await refreshComments();
    } catch (err) {
        console.error('Failed to post comment', err);
        showErrorMessage.value = true;
        errorMessage.value = 'เกิดข้อผิดพลาดในการส่งความคิดเห็น';
    }
}

onMounted(() => {
    if (process.client && articleId) {
        $fetch(`/api/articles/${articleId}/increment-view`, { method: 'POST' });
    }
});

const { toggleLike, isLiked } = useLikes();

async function deleteArticle() {
    try {
        await $fetch(`/api/articles/${articleId}`, { method: 'DELETE' })
        showErrorMessage.value = true;
        errorMessage.value = 'ลบบทความสำเร็จ!';
        router.push('/articles')
    } catch (err) {
        console.error('Failed to delete article', err)
        showErrorMessage.value = true;
        errorMessage.value = 'เกิดข้อผิดพลาดในการลบบทความ';
    } finally {
        showDeleteDialog.value = false
    }
}

const readingTime = computed(() => {
    if (!article.value?.content) return 0;
    const wordsPerMinute = 200;
    const text = article.value.content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
});

function printArticle() {
    if (process.client) {
        window.print();
    }
}

useSeoMeta({
    title: () => article.value?.metaTitle || article.value?.title || 'บทความ',
    description: () => article.value?.metaDescription || article.value?.excerpt || 'บทความเกี่ยวกับการเงินและการลงทุน',
});

function shareOn(platform: 'facebook' | 'twitter' | 'linkedin') {
    if (!process.client || !article.value) return;
    const currentUrl = encodeURIComponent(window.location.href);
    const articleTitle = encodeURIComponent(article.value.title);
    let shareUrl = '';
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${articleTitle}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
            break;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
}
const getAuthorName = (authorId: string): string => {
    const author = authorsDB.find(a => a.id === authorId);
    return author ? author.name : 'ไม่ระบุชื่อ';
};

const articleStatus = computed(() => {
    if (article.value?.status === 'draft') {
        const publishedDate = new Date(article.value.publishedAt);
        const isScheduled = publishedDate > new Date();
        return isScheduled ? `กำหนดเผยแพร่: ${publishedDate.toLocaleString('th-TH')}` : 'ฉบับร่าง';
    }
    return 'เผยแพร่แล้ว';
});
</script>

<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <div v-if="pending" class="text-center pa-10">
                    <v-progress-circular indeterminate color="primary" size="64" />
                </div>
                <v-alert v-else-if="error" type="error" prominent>
                    <h3 class="text-h6">ไม่พบบทความ</h3>
                    <p>ขออภัย ไม่พบบทความที่คุณกำลังมองหา</p>
                    <v-btn to="/articles" color="white" variant="outlined" class="mt-4">
                        กลับไปหน้ารวมบทความ
                    </v-btn>
                </v-alert>

                <article v-else-if="article">
                    <v-img :src="article.coverImage" height="400px" cover class="mb-6 rounded-lg" />
                    <v-chip v-if="article.status === 'draft'" color="warning" class="mb-4 mr-2">
                        {{ articleStatus }}
                    </v-chip>
                    <v-chip v-if="article.category" color="primary" class="mb-4">{{ article.category }}</v-chip>
                    <v-chip v-if="article.series" color="secondary" class="mb-4 ml-2">
                        ซีรีส์: {{ article.series }}
                    </v-chip>
                    <h1 class="text-h3 font-weight-bold mb-4">{{ article.title }}</h1>
                    <div class="d-flex align-center text-medium-emphasis mb-6 flex-wrap">
                        <v-chip v-if="article.author" :to="`/authors/${article.author.id}`" class="mr-2" label>
                            <v-avatar start :image="article.author.avatar" />
                            โดย {{ article.author.name }}
                        </v-chip>
                        <v-divider vertical class="mx-3" />
                        <span>{{ new Date(article.publishedAt).toLocaleDateString('th-TH', {
                            year: 'numeric', month:
                                'long', day: 'numeric'
                        }) }}</span>
                        <v-divider vertical class="mx-3" />
                        <v-icon start icon="mdi-clock-outline" />
                        <span>อ่านประมาณ {{ readingTime }} นาที</span>
                        <v-divider vertical class="mx-3" />
                        <v-icon start icon="mdi-eye-outline" />
                        <span>{{ article.viewCount.toLocaleString() }} ครั้ง</span>
                    </div>
                    <div class="text-body-1 article-content" v-html="article.content"></div>
                    <div class="mt-8">
                        <v-chip v-for="tag in article.tags" :key="tag" class="mr-2 mb-2" size="small">
                            {{ tag }}
                        </v-chip>
                    </div>

                    <v-divider class="my-8" />
                    <div class="d-flex align-center justify-space-between">
                        <div>
                            <span class="text-subtitle-1 mr-4">แชร์บทความนี้:</span>
                            <v-btn icon="mdi-facebook" variant="text" @click="shareOn('facebook')" />
                            <v-btn icon="mdi-twitter" variant="text" @click="shareOn('twitter')" />
                            <v-btn icon="mdi-linkedin" variant="text" @click="shareOn('linkedin')" />
                            <v-btn :icon="isLiked(article.id) ? 'mdi-heart' : 'mdi-heart-outline'"
                                :color="isLiked(article.id) ? 'error' : ''" variant="text"
                                @click="toggleLike(article.id)" />
                            <v-btn @click="printArticle" icon="mdi-printer" variant="text" />
                        </div>
                        <div class="d-flex ga-2">
                            <v-btn :to="`/articles/edit/${article.id}`" color="secondary" variant="text"
                                prepend-icon="mdi-pencil">
                                แก้ไข
                            </v-btn>
                            <v-btn @click="showDeleteDialog = true" color="error" variant="text"
                                prepend-icon="mdi-delete-outline">
                                ลบ
                            </v-btn>
                        </div>
                    </div>
                    <!-- Version History Button -->
                    <div class="mt-4 text-right">
                        <v-btn color="info" variant="text" @click="showVersionHistory = true"
                            prepend-icon="mdi-history">
                            ประวัติการแก้ไข
                        </v-btn>
                    </div>

                    <!-- === Comments Section === -->
                    <div class="comments-section">
                        <v-divider class="my-8" />
                        <h2 class="text-h5 mb-4">
                            ความคิดเห็น ({{ comments?.length || 0 }})
                        </h2>
                        <v-card variant="outlined" class="mb-6">
                            <v-card-text>
                                <v-textarea v-model="newComment" label="แสดงความคิดเห็นของคุณ..." rows="3" no-resize
                                    hide-details />
                            </v-card-text>
                            <v-card-actions class="pa-4">
                                <v-spacer />
                                <v-btn @click="postComment" color="primary" variant="flat">
                                    ส่งความคิดเห็น
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                        <v-list lines="three" class="bg-transparent">
                            <v-list-item v-for="comment in comments" :key="comment.id" :prepend-avatar="comment.avatar"
                                :title="comment.author" :subtitle="comment.content">
                                <template v-slot:append>
                                    <span class="text-caption text-medium-emphasis">
                                        {{ new Date(comment.createdAt).toLocaleDateString('th-TH') }}
                                    </span>
                                </template>
                            </v-list-item>
                        </v-list>
                        <v-divider class="my-8" />
                        <RelatedArticles :articles="article.related" class="mt-8" />
                    </div>

                </article>
            </v-col>
        </v-row>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="showDeleteDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5">ยืนยันการลบบทความ</v-card-title>
                <v-card-text>คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้? การกระทำนี้ไม่สามารถย้อนกลับได้</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" text @click="showDeleteDialog = false">ยกเลิก</v-btn>
                    <v-btn color="error" variant="flat" @click="deleteArticle">ยืนยันการลบ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Version History Dialog -->
        <v-dialog v-model="showVersionHistory" max-width="800">
            <v-card>
                <v-card-title class="text-h5">ประวัติการแก้ไขบทความ</v-card-title>
                <v-card-text>
                    <div v-if="versionsPending" class="text-center py-5">
                        <v-progress-circular indeterminate />
                    </div>
                    <v-list v-else lines="three" class="bg-transparent">
                        <v-list-item v-for="(version, index) in versions" :key="index"
                            :class="{ 'bg-grey-lighten-3 rounded-lg': index === 0 }">
                            <v-list-item-title>
                                <strong>{{ index === 0 ? 'เวอร์ชันล่าสุด' : `เวอร์ชันที่ ${(versions?.length ?? 0) -
                                    index}`
                                    }}</strong>
                                <span class="text-caption text-medium-emphasis ml-2"> ({{ version.changes }})</span>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                แก้ไขเมื่อ {{ new Date(version.timestamp).toLocaleString('th-TH') }} โดย {{
                                    getAuthorName(version.editorId) }}
                            </v-list-item-subtitle>
                            <template v-slot:append>
                                <v-btn variant="text" color="primary" disabled>ดูเวอร์ชันนี้</v-btn>
                            </template>
                        </v-list-item>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="grey-darken-1" text @click="showVersionHistory = false">ปิด</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style>
.article-content ul {
    list-style-position: inside;
    padding-left: 1rem;
}

.article-content p,
.article-content ul {
    margin-bottom: 1rem;
}

@media print {

    .v-application>.v-layout>.v-app-bar,
    .v-application>.v-layout>.v-footer,
    .v-btn,
    .comments-section,
    .v-chip,
    .v-divider {
        display: none !important;
    }

    .v-application__wrap>main {
        padding: 0 !important;
    }

    .v-container {
        padding: 0 !important;
    }

    .v-row,
    .v-col {
        width: 100% !important;
        max-width: 100% !important;
        flex-basis: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .v-img,
    .v-card {
        box-shadow: none !important;
        border: none !important;
    }

    h1,
    h2,
    h3 {
        color: black !important;
    }

    .text-medium-emphasis {
        color: #333 !important;
    }
}
</style>