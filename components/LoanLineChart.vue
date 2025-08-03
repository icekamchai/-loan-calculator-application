<script setup lang="ts">
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)

const props = defineProps({
    schedule: { type: Array as PropType<{ month: number; balance: number }[]>, required: true },
})

const chartData = computed(() => ({
    labels: props.schedule.map(row => `เดือนที่ ${row.month}`),
    datasets: [
        {
            label: 'ยอดหนี้คงเหลือ',
            backgroundColor: '#f87979',
            borderColor: '#f87979',
            data: props.schedule.map(row => row.balance),
            tension: 0.2,
        },
    ],
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
}
</script>

<template>
    <Line :data="chartData" :options="chartOptions" />
</template>