<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()
function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
    <v-btn @click="toggleTheme" :icon="theme.global.current.value.dark ? 'mdi-weather-night' : 'mdi-weather-sunny'"
        variant="text" :aria-label="theme.global.current.value.dark ? 'Toggle light mode' : 'Toggle dark mode'"
        :title="theme.global.current.value.dark ? 'Toggle light mode' : 'Toggle dark mode'" />
</template>