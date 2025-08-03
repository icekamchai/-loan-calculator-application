<script setup lang="ts">
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

const props = defineProps({
    principal: { type: Number, required: true },
    interest: { type: Number, required: true },
})

const chartData = computed(() => ({
    labels: ['เงินต้น', 'ดอกเบี้ย'],
    datasets: [
        {
            backgroundColor: ['#41B883', '#E46651'],
            data: [props.principal, props.interest],
        },
    ],
}))

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
}
</script>

<template>
    <Pie :data="chartData" :options="chartOptions" />
</template>