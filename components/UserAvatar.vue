<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getAuth, signOut } from 'firebase/auth';
import { useFirebaseAuth } from '~/composables/useFirebaseAuth';
import { ref } from 'vue';

const { user } = useFirebaseAuth();
const router = useRouter();
const auth = getAuth();
const showMenu = ref(false);

const handleLogout = async () => {
    try {
        await signOut(auth);
        router.push('/');
    } catch (error) {
        console.error("Logout failed", error);
    }
};
</script>

<template>
    <div v-if="user">
        <v-menu v-model="showMenu" :close-on-content-click="false" location="bottom">
            <template #activator="{ props }">
                <v-avatar size="36" class="cursor-pointer" v-bind="props">
                    <v-img :src="user.photoURL || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'"
                        :alt="`Profile picture of ${user.displayName || 'user'}`" />
                </v-avatar>
            </template>
            <v-card width="250">
                <v-list dense>
                    <v-list-item>
                        <template #prepend>
                            <v-avatar>
                                <v-img :src="user.photoURL || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'"
                                    :alt="`Profile picture of ${user.displayName || 'user'}`" />
                            </v-avatar>
                        </template>
                        <v-list-item-title class="text-subtitle-1">{{ user.displayName || user.email
                            }}</v-list-item-title>
                        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                <v-divider />
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="handleLogout" color="error" variant="text">
                        <v-icon start icon="mdi-logout" />
                        ออกจากระบบ
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
    <div v-else>
        <v-btn to="/auth/login" color="primary" variant="flat">
            เข้าสู่ระบบ
        </v-btn>
    </div>
</template>