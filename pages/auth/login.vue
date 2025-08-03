<script setup lang="ts">
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const router = useRouter();
const auth = getAuth();

const handleLogin = async () => {
    error.value = '';
    loading.value = true;
    try {
        await signInWithEmailAndPassword(auth, email.value, password.value);

        const redirectPath = router.currentRoute.value.query.redirect as string;

        router.push(redirectPath || '/');

    } catch (err: any) {
        console.error(err);
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <v-container fill-height class="d-flex align-center justify-center">
        <Transition name="fade">
            <v-card width="400" elevation="4">
                <v-card-title class="text-h5 text-center py-4">เข้าสู่ระบบ</v-card-title>
                <v-card-text>
                    <v-form @submit.prevent="handleLogin">
                        <v-text-field v-model="email" label="อีเมล" type="email" prepend-inner-icon="mdi-email"
                            :rules="[(v) => !!v || 'กรุณากรอกอีเมล']" required variant="outlined" class="mb-4" />
                        <v-text-field v-model="password" label="รหัสผ่าน" type="password" prepend-inner-icon="mdi-lock"
                            :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่าน']" required variant="outlined" class="mb-4" />
                        <v-alert v-if="error" type="error" dense class="mb-4">{{ error }}</v-alert>
                        <v-btn color="primary" block type="submit" :loading="loading" :disabled="loading">
                            เข้าสู่ระบบ
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </Transition>
    </v-container>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>