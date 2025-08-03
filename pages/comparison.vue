<template>
    <v-container>
        <h1 class="text-h4 mb-4">เปรียบเทียบสินเชื่อ</h1>

        <v-sheet v-if="comparisonList.length === 0"
            class="d-flex flex-column align-center justify-center pa-10 text-center" rounded="lg" height="400"
            elevation="2">
            <v-icon icon="mdi-file-compare" size="64" class="mb-4" />
            <h2 class="text-h6 mb-2">ยังไม่มีรายการเปรียบเทียบ</h2>
            <p class="text-body-2 mb-4">
                ไปที่หน้าเครื่องคำนวณเพื่อเพิ่มสินเชื่อ<br>แล้วกลับมาดูผลเปรียบเทียบที่หน้านี้
            </p>
            <v-btn to="/calculator" color="primary" variant="flat">
                ไปที่หน้า Calculator
            </v-btn>
        </v-sheet>

        <v-row v-else>
            <v-col v-for="loan in comparisonList" :key="loan.id" cols="12" md="6" lg="4">
                <v-card elevation="2">
                    <v-card-title class="d-flex justify-space-between">
                        <span>ยอดกู้ {{ formatCurrency(loan.loanAmount) }}</span>
                        <v-btn icon="mdi-close" variant="text" size="small" @click="loanStore.removeLoan(loan.id)" />
                    </v-card-title>
                    <v-list-item :title="formatCurrency(loan.monthlyPayment)" subtitle="ยอดผ่อนต่อเดือน"
                        :class="{ 'text-green-darken-2 font-weight-bold': loan.monthlyPayment === minMonthlyPayment }">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-cash-multiple" class="mr-3" />
                        </template>
                    </v-list-item>
                    <v-divider />
                    <v-list-item :title="`${loan.interestRate}%`" subtitle="อัตราดอกเบี้ย" />
                    <v-list-item :title="`${loan.loanTermYears} ปี ${loan.loanTermMonths} เดือน`" subtitle="ระยะเวลา" />
                    <v-list-item :title="formatCurrency(loan.totalInterest)" subtitle="ดอกเบี้ยทั้งหมด"
                        :class="{ 'text-green-darken-2': loan.totalInterest === minTotalInterest }" />
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useLoanStore } from '../store/loan'

const loanStore = useLoanStore()
const { comparisonList } = storeToRefs(loanStore)

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value)
}

const minMonthlyPayment = computed(() => {
    if (comparisonList.value.length === 0) return null
    return Math.min(...comparisonList.value.map(item => item.monthlyPayment))
})
const minTotalInterest = computed(() => {
    if (comparisonList.value.length === 0) return null
    return Math.min(...comparisonList.value.map(item => item.totalInterest))
})
</script>