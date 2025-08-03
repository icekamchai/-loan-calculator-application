<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
    schedule: { type: Array as PropType<{ month: number; interest: number }[]>, required: true },
})

const chartData = computed(() => {
    const yearlyInterest: { [year: number]: number } = {}

    props.schedule.forEach(row => {
        const year = Math.ceil(row.month / 12)
        if (!yearlyInterest[year]) {
            yearlyInterest[year] = 0
        }
        yearlyInterest[year] += row.interest
    })
    return {
        labels: Object.keys(yearlyInterest).map(year => `ปีที่ ${year}`),
        datasets: [
            {
                label: 'ดอกเบี้ยที่จ่ายในแต่ละปี',
                backgroundColor: '#41B883',
                data: Object.values(yearlyInterest),
            },
        ],
    }
})
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
}
</script>
<template>
    <Bar :data="chartData" :options="chartOptions" />
</template>