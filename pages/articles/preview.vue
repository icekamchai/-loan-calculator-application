<script setup lang="ts">
import type { Article } from '~/server/db/articles';
import type { Author } from '~/server/db/authors';
import { authorsDB } from '~/server/db/authors';

const router = useRouter();
const PREVIEW_KEY = 'article-preview-data';

interface PreviewArticle extends Partial<Article> {
    author?: Partial<Author>;
    authorId?: string;
}

const article = ref<PreviewArticle | null>(null);
const showErrorMessage = ref(false);
const errorMessage = ref('');
const showPublishDialog = ref(false);
const showPublishNowDialog = ref(false);

onMounted(() => {
    const savedData = localStorage.getItem(PREVIEW_KEY);
    if (savedData) {
        article.value = JSON.parse(savedData);
        // Ensure author is populated for the preview
        if (article.value?.authorId) {
            const author = authorsDB.find(a => a.id === article.value?.authorId);
            if (author) {
                article.value.author = author;
            }
        }
    } else {
        showErrorMessage.value = true;
        errorMessage.value = 'ไม่พบข้อมูลสำหรับดูตัวอย่าง';
        setTimeout(() => {
            router.push('/articles/new');
        }, 2000);
    }
});

const formattedPublishedAt = computed(() => {
    if (!article.value?.publishedAt) return '';
    return new Date(article.value.publishedAt).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
});
const formattedPublishedAtFull = computed(() => {
    if (!article.value?.publishedAt) return '';
    return new Date(article.value.publishedAt).toLocaleString('th-TH');
});

const isScheduledArticle = computed(() => {
    return article.value?.status === 'draft' && article.value?.publishedAt && new Date(article.value.publishedAt) > new Date();
});
const isDraftArticle = computed(() => {
    return article.value?.status === 'draft' && (!article.value?.publishedAt || new Date(article.value.publishedAt) <= new Date());
});


async function saveScheduledDraft() {
    if (!article.value) return;

    try {
        const newArticle = await $fetch<Article>('/api/articles', {
            method: 'POST',
            body: {
                title: article.value.title,
                excerpt: article.value.excerpt,
                content: article.value.content,
                category: article.value.category,
                tags: article.value.tags,
                coverImage: article.value.coverImage,
                authorId: article.value.authorId,
                metaTitle: article.value.metaTitle,
                metaDescription: article.value.metaDescription,
                publishedAt: article.value.publishedAt,
                series: article.value.series,
                status: article.value.status,
            }
        });

        localStorage.removeItem(PREVIEW_KEY);
        showErrorMessage.value = true;
        errorMessage.value = 'บันทึกฉบับร่างสำเร็จ! บทความจะถูกเผยแพร่ตามเวลาที่กำหนด';
        router.push(`/articles/${newArticle.id}`);

    } catch (err) {
        console.error('Failed to save scheduled article', err);
        showErrorMessage.value = true;
        errorMessage.value = 'เกิดข้อผิดพลาดในการบันทึกฉบับร่าง';
    } finally {
        showPublishDialog.value = false;
    }
}


async function publishImmediately() {
    if (!article.value) return;

    try {
        const newArticle = await $fetch<Article>('/api/articles', {
            method: 'POST',
            body: {
                title: article.value.title,
                excerpt: article.value.excerpt,
                content: article.value.content,
                category: article.value.category,
                tags: article.value.tags,
                coverImage: article.value.coverImage,
                authorId: article.value.authorId,
                metaTitle: article.value.metaTitle,
                metaDescription: article.value.metaDescription,
                publishedAt: new Date().toISOString(),
                series: article.value.series,
                status: 'published',
            }
        });

        localStorage.removeItem(PREVIEW_KEY);
        showErrorMessage.value = true;
        errorMessage.value = 'เผยแพร่บทความสำเร็จ!';
        router.push(`/articles/${newArticle.id}`);

    } catch (err) {
        console.error('Failed to publish article immediately', err);
        showErrorMessage.value = true;
        errorMessage.value = 'เกิดข้อผิดพลาดในการเผยแพร่บทความ';
    } finally {
        showPublishNowDialog.value = false;
    }
}


async function publishArticle() {
    if (!article.value) return;

    try {
        const newArticle = await $fetch<Article>('/api/articles', {
            method: 'POST',
            body: {
                title: article.value.title,
                excerpt: article.value.excerpt,
                content: article.value.content,
                category: article.value.category,
                tags: article.value.tags,
                coverImage: article.value.coverImage,
                authorId: article.value.authorId,
                metaTitle: article.value.metaTitle,
                metaDescription: article.value.metaDescription,
                publishedAt: article.value.publishedAt,
                series: article.value.series,
                status: article.value.status,
            }
        });

        localStorage.removeItem(PREVIEW_KEY);
        showErrorMessage.value = true;
        errorMessage.value = 'เผยแพร่บทความสำเร็จ!';
        router.push(`/articles/${newArticle.id}`);

    } catch (err) {
        console.error('Failed to publish article', err);
        showErrorMessage.value = true;
        errorMessage.value = 'เกิดข้อผิดพลาดในการเผยแพร่บทความ';
    } finally {
        showPublishDialog.value = false;
    }
}
</script>

<template>
    <div>
        <v-sheet v-if="isScheduledArticle" color="info" class="text-center pa-4">
            <h3 class="text-h6">นี่คือหน้าตัวอย่าง (กำหนดเผยแพร่)</h3>
            <p>เนื้อหาจะถูกเผยแพร่ในวันที่ <strong>{{ formattedPublishedAtFull }}</strong></p>
            <div class="mt-4">
                <v-btn @click="saveScheduledDraft" color="white" variant="flat" class="mr-2">
                    บันทึกฉบับร่าง (Scheduled)
                </v-btn>
                <v-btn @click="showPublishNowDialog = true" color="warning" variant="flat" class="mr-2">
                    เผยแพร่ทันที
                </v-btn>
                <v-btn to="/articles/new" variant="outlined">
                    กลับไปแก้ไข
                </v-btn>
            </div>
        </v-sheet>
        <v-sheet v-else-if="isDraftArticle" color="warning" class="text-center pa-4">
            <h3 class="text-h6">นี่คือหน้าตัวอย่าง (ฉบับร่าง)</h3>
            <p>เนื้อหายังไม่ถูกเผยแพร่สู่สาธารณะ</p>
            <div class="mt-4">
                <v-btn @click="showPublishDialog = true" color="primary" variant="flat" class="mr-2">
                    ยืนยันและเผยแพร่
                </v-btn>
                <v-btn to="/articles/new" variant="outlined">
                    กลับไปแก้ไข
                </v-btn>
            </div>
        </v-sheet>
        <v-sheet v-else color="warning" class="text-center pa-4">
            <h3 class="text-h6">นี่คือหน้าตัวอย่าง</h3>
            <p>เนื้อหายังไม่ถูกเผยแพร่สู่สาธารณะ</p>
            <div class="mt-4">
                <v-btn @click="showPublishDialog = true" color="primary" variant="flat" class="mr-2">
                    ยืนยันและเผยแพร่
                </v-btn>
                <v-btn to="/articles/new" variant="outlined">
                    กลับไปแก้ไข
                </v-btn>
            </div>
        </v-sheet>

        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="8">
                    <article v-if="article">
                        <v-img v-if="article.coverImage" :src="article.coverImage" height="400px" cover
                            class="mb-6 rounded-lg" />
                        <v-chip v-if="article.category" color="primary" class="mb-4">{{ article.category }}</v-chip>
                        <v-chip v-if="article.series" color="secondary" class="mb-4 ml-2">
                            ซีรีส์: {{ article.series }}
                        </v-chip>
                        <h1 class="text-h3 font-weight-bold mb-4">{{ article.title }}</h1>
                        <div class="d-flex align-center text-medium-emphasis mb-6 flex-wrap">
                            <v-chip v-if="article.author" class="mr-2" label>
                                <v-avatar start :image="article.author.avatar" />
                                โดย {{ article.author.name }}
                            </v-chip>
                            <v-divider vertical class="mx-3" />
                            <span>{{ formattedPublishedAt }}</span>
                        </div>
                        <div class="article-content" v-html="article.content"></div>
                    </article>
                </v-col>
            </v-row>
        </v-container>


        <v-dialog v-model="showPublishDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5">ยืนยันการเผยแพร่</v-card-title>
                <v-card-text>คุณแน่ใจหรือไม่ว่าต้องการเผยแพร่บทความนี้?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" text @click="showPublishDialog = false">ยกเลิก</v-btn>
                    <v-btn color="primary" variant="flat" @click="publishArticle">ยืนยัน</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="showPublishNowDialog" max-width="500">
            <v-card>
                <v-card-title class="text-h5">ยืนยันการเผยแพร่ทันที</v-card-title>
                <v-card-text>บทความนี้ถูกตั้งเวลาเผยแพร่ไว้ คุณแน่ใจหรือไม่ว่าต้องการเผยแพร่ทันที?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey-darken-1" text @click="showPublishNowDialog = false">ยกเลิก</v-btn>
                    <v-btn color="warning" variant="flat" @click="publishImmediately">ยืนยัน</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="showErrorMessage" max-width="400">
            <v-card>
                <v-card-title class="text-h6">{{ errorMessage.includes('สำเร็จ') ? 'สำเร็จ!' : 'เกิดข้อผิดพลาด'
                    }}</v-card-title>
                <v-card-text>{{ errorMessage }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="showErrorMessage = false">ตกลง</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
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