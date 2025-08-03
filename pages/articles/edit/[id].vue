<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import type { Article, VersionHistory } from '~/server/db/articles'
import { authorsDB } from '~/server/db/authors';

const route = useRoute()
const router = useRouter()
const articleId = route.params.id

const form = ref<{
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
}>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
})

const { data: initialData, pending } = await useAsyncData(
    `fetchArticleForEdit:${articleId}`,
    () => $fetch<Article>(`/api/articles/${articleId}`)
)

const editor = useEditor({
    editable: false,
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
        form.value.content = editor.getHTML()
    },
})

// === State and Logic for Version History ===
const showVersionHistory = ref(false);
const { data: versions, pending: versionsPending, error: versionsError, refresh: refreshVersions } = await useAsyncData(
    `fetchArticleVersions:${articleId}`,
    () => $fetch<VersionHistory[]>(`/api/articles/${articleId}/versions`)
);
const getAuthorName = (authorId: string): string => {
    const author = authorsDB.find(a => a.id === authorId);
    return author ? author.name : 'ไม่ระบุชื่อ';
};


watch(editor, (newEditor) => {
    if (newEditor && initialData.value) {
        const article = initialData.value

        form.value.title = article.title
        form.value.excerpt = article.excerpt
        form.value.content = article.content
        form.value.category = article.category
        form.value.tags = article.tags

        newEditor.commands.setContent(article.content)
        newEditor.setEditable(true)
    }
})

async function updateArticle() {
    if (!editor.value) return

    try {
        const updatedArticle = await $fetch<Article>(`/api/articles/${articleId}`, {
            method: 'PUT',
            body: {
                title: form.value.title,
                excerpt: form.value.excerpt,
                content: editor.value.getHTML(),
                category: form.value.category,
                tags: form.value.tags,
            }
        })


        await refreshVersions();

        alert('แก้ไขบทความสำเร็จ!');
        router.push(`/articles/${updatedArticle.id}`);

    } catch (err) {
        console.error('Failed to update article', err);
        alert('เกิดข้อผิดพลาดในการแก้ไขบทความ');
    }
}

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
                <div v-if="pending" class="text-center pa-10">
                    <v-progress-circular indeterminate size="64" />
                    <p class="mt-4">กำลังโหลดข้อมูลบทความ...</p>
                </div>
                <v-form v-else @submit.prevent="updateArticle">
                    <h1 class="text-h4 mb-6">แก้ไขบทความ</h1>
                    <v-card elevation="2">
                        <v-card-text class="pa-5">
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
                            <v-combobox v-model="form.tags" label="Tags (กด Enter เพื่อเพิ่ม)" multiple chips
                                closable-chips variant="outlined" />
                        </v-card-text>
                        <v-card-actions class="pa-5">
                            <v-spacer />
                            <v-btn type="submit" color="primary" variant="flat" size="large">
                                บันทึกการเปลี่ยนแปลง
                            </v-btn>

                            <v-btn color="info" variant="text" @click="showVersionHistory = true"
                                prepend-icon="mdi-history">
                                ประวัติการแก้ไข
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>


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
                                <span class="text-caption text-medium-emphasis ml-2"> ({{ version.title }})</span>
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