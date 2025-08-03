    <script setup lang="ts">
    import type { Author } from '~/server/db/authors';
    import type { Article } from '~/server/db/articles';

    const route = useRoute();
    const authorId = route.params.id;

    const { data, pending } = await useAsyncData(
        `fetchAuthor:${authorId}`,
        () => $fetch<{ author: Author, articles: Article[] }>(`/api/authors/${authorId}`)
    );

    const author = computed(() => data.value?.author);
    const articles = computed(() => data.value?.articles);

    useSeoMeta({
        title: () => author.value?.name || 'ผู้เขียน',
    });
</script>
    <template>
        <v-container>
            <div v-if="pending" class="text-center pa-10">
                <v-progress-circular indeterminate size="64" />
            </div>
            <div v-else-if="author">
                <v-row>
                    <v-col cols="12" md="3" class="text-center">
                        <v-avatar size="150" class="mb-4">
                            <v-img :src="author.avatar" />
                        </v-avatar>
                        <h1 class="text-h4">{{ author.name }}</h1>
                        <p class="text-body-1 text-medium-emphasis mt-2">{{ author.bio }}</p>
                    </v-col>
                    <v-col cols="12" md="9">
                        <h2 class="text-h5 mb-4">บทความโดย {{ author.name }}</h2>
                        <v-divider />
                        <v-list lines="three">
                            <v-list-item v-for="article in articles" :key="article.id" :to="`/articles/${article.id}`"
                                :title="article.title" :subtitle="article.excerpt">
                                <template v-slot:prepend>
                                    <v-img :src="article.coverImage" width="120" class="mr-4 rounded" />
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </template>
