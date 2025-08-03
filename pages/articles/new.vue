<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const router = useRouter()
const PREVIEW_KEY = 'article-preview-data'

// --- State Management ---
const form = ref({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    metaTitle: '',
    metaDescription: '',
    coverImage: '',
    series: ''
})
const publishDate = ref<Date | null>(null)
const publishTime = ref('09:00')
const isUploading = ref(false)

// --- Computed property for combining date and time and determining status ---
const computedPublishedAt = computed(() => {
    if (!publishDate.value) {
        return new Date().toISOString()
    }

    const date = new Date(publishDate.value)
    const timeParts = publishTime.value?.split(':')

    if (timeParts && timeParts.length === 2) {
        const hours = parseInt(timeParts[0] ?? '0', 10)
        const minutes = parseInt(timeParts[1] ?? '0', 10)

        if (!isNaN(hours) && !isNaN(minutes)) {
            date.setHours(hours, minutes, 0, 0)
        }
    } else {
        date.setHours(0, 0, 0, 0)
    }

    return date.toISOString()
})

const editor = useEditor({
    content: '<p>เริ่มเขียนเนื้อหาบทความของคุณที่นี่...</p>',
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
        form.value.content = editor.getHTML()
    },
})

async function handleImageUpload(selectedFiles: File | File[]) {
    const file = Array.isArray(selectedFiles) ? selectedFiles[0] : selectedFiles
    if (!file) return
    isUploading.value = true
    const formData = new FormData()
    formData.append('file', file)
    try {
        const response = await $fetch<{ url: string }>('/api/upload', {
            method: 'POST',
            body: formData,
        })
        form.value.coverImage = response.url
    } catch (err) {
        console.error('Failed to upload image', err)
        alert('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ')
    } finally {
        isUploading.value = false
    }
}

function goToPreview() {
    if (!form.value.title || !form.value.content) {
        alert('กรุณากรอกหัวข้อและเนื้อหาบทความให้ครบถ้วน')
        return
    }

    const isScheduled = publishDate.value && new Date(computedPublishedAt.value) > new Date();
    const articleStatus = isScheduled ? 'draft' : 'published';

    const previewData = {
        ...form.value,
        authorId: 'admin', // แก้ไขให้ใช้ authorId โดยตรง
        publishedAt: computedPublishedAt.value,
        viewCount: 0,
        status: articleStatus,
    }
    if (!previewData.coverImage) {
        previewData.coverImage = '[https://placehold.co/1200x600/CCCCCC/FFFFFF?text=No+Image](https://placehold.co/1200x600/CCCCCC/FFFFFF?text=No+Image)'
    }
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(previewData))
    router.push('/articles/preview')
}

onMounted(() => {
    if (process.client && editor.value) {
        const previewDataStr = localStorage.getItem(PREVIEW_KEY)
        if (previewDataStr) {
            const dataToRestore = JSON.parse(previewDataStr)
            form.value = {
                title: dataToRestore.title || '',
                excerpt: dataToRestore.excerpt || '',
                content: dataToRestore.content || '',
                category: dataToRestore.category || '',
                tags: dataToRestore.tags || [],
                metaTitle: dataToRestore.metaTitle || '',
                metaDescription: dataToRestore.metaDescription || '',
                coverImage: dataToRestore.coverImage || '',
                series: dataToRestore.series || '',
            }
            editor.value.commands.setContent(dataToRestore.content || '')
            if (dataToRestore.publishedAt) {
                const d = new Date(dataToRestore.publishedAt)
                publishDate.value = d
                publishTime.value = d.toTimeString().slice(0, 5)
            }
        }
    }
})

onBeforeUnmount(() => {
    if (editor.value) {
        editor.value.destroy()
    }
})
</script>

<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <h1 class="text-h4 mb-6">สร้างบทความใหม่</h1>
                <v-form @submit.prevent="goToPreview">
                    <v-card elevation="2">
                        <v-card-text class="pa-5">
                            <div class="mb-4">
                                <p class="text-subtitle-1 mb-2">รูปภาพประกอบ</p>
                                <v-img v-if="form.coverImage" :src="form.coverImage" height="250"
                                    class="rounded-lg mb-2" cover />
                                <v-file-input label="เลือกรูปภาพ..." variant="outlined" accept="image/*"
                                    :loading="isUploading" @update:model-value="handleImageUpload" />
                            </div>
                            <v-text-field v-model="form.title" label="หัวข้อบทความ" variant="outlined" class="mb-4" />
                            <v-textarea v-model="form.excerpt" label="คำโปรย (Excerpt)" variant="outlined" rows="3"
                                class="mb-4" />
                            <ClientOnly>
                                <div v-if="editor" class="editor-container mb-4">
                                    <div class="editor-toolbar">
                                        <v-btn @click="editor.chain().focus().toggleBold().run()"
                                            :class="{ 'is-active': editor.isActive('bold') }" size="small"
                                            icon="mdi-format-bold" />
                                        <v-btn @click="editor.chain().focus().toggleItalic().run()"
                                            :class="{ 'is-active': editor.isActive('italic') }" size="small"
                                            icon="mdi-format-italic" />
                                        <v-btn @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                                            :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                                            size="small" icon="mdi-format-header-2" />
                                        <v-btn @click="editor.chain().focus().toggleBulletList().run()"
                                            :class="{ 'is-active': editor.isActive('bulletList') }" size="small"
                                            icon="mdi-format-list-bulleted" />
                                    </div>
                                    <editor-content :editor="editor" />
                                </div>
                            </ClientOnly>
                            <v-text-field v-model="form.category" label="หมวดหมู่" variant="outlined" class="mb-4" />
                            <v-combobox v-model="form.series" label="ซีรีส์บทความ" variant="outlined" class="mb-4" />
                            <v-combobox v-model="form.tags" label="Tags (กด Enter เพื่อเพิ่ม)" multiple chips
                                closable-chips variant="outlined" />

                            <v-expansion-panels class="mt-6" variant="accordion">
                                <v-expansion-panel title="การตั้งค่าเพิ่มเติม (SEO & Scheduling)">
                                    <v-expansion-panel-text>
                                        <p class="text-subtitle-1 mb-2">ตั้งเวลาเผยแพร่</p>
                                        <p class="text-caption mb-4">หากไม่กำหนด จะเผยแพร่ทันที</p>
                                        <v-row>
                                            <v-col cols="7">
                                                <v-menu :close-on-content-click="false">
                                                    <template v-slot:activator="{ props }">
                                                        <v-text-field
                                                            :model-value="publishDate ? publishDate.toLocaleDateString('th-TH') : ''"
                                                            label="วันที่เผยแพร่" prepend-inner-icon="mdi-calendar"
                                                            readonly v-bind="props" variant="outlined" clearable
                                                            @click:clear="publishDate = null" />
                                                    </template>
                                                    <v-date-picker v-model="publishDate" hide-header />
                                                </v-menu>
                                            </v-col>
                                            <v-col cols="5">
                                                <v-text-field v-model="publishTime" label="เวลา (HH:MM)" type="time"
                                                    variant="outlined" :disabled="!publishDate" />
                                            </v-col>
                                        </v-row>
                                        <v-divider class="my-6" />
                                        <p class="text-subtitle-1 mb-2">การตั้งค่า SEO</p>
                                        <v-text-field v-model="form.metaTitle" label="Meta Title"
                                            hint="หากเว้นว่าง จะใช้หัวข้อบทความเป็นค่าเริ่มต้น" persistent-hint
                                            class="mb-4" variant="outlined" />
                                        <v-textarea v-model="form.metaDescription" label="Meta Description"
                                            hint="หากเว้นว่าง จะใช้คำโปรย (Excerpt) เป็นค่าเริ่มต้น" persistent-hint
                                            rows="3" variant="outlined" />
                                    </v-expansion-panel-text>
                                </v-expansion-panel>
                            </v-expansion-panels>
                        </v-card-text>

                        <v-card-actions class="pa-5">
                            <v-spacer />
                            <v-btn type="submit" color="primary" variant="flat" size="large" :loading="isUploading">
                                ดูตัวอย่าง
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
.editor-container {
    border: 1px solid #ccc;
    border-radius: 4px;
}

.editor-toolbar {
    padding: 8px;
    border-bottom: 1px solid #ccc;
    background-color: #f5f5f5;
}

.editor-toolbar .v-btn.is-active {
    background-color: #e0e0e0;
}

.ProseMirror {
    padding: 16px;
    min-height: 250px;
}

.ProseMirror:focus {
    outline: none;
}
</style>