<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" md="4">
                <v-card class="mb-5" elevation="2">
                    <v-card-title>คำนวณสินเชื่อ</v-card-title>
                    <v-card-text>
                        <v-form v-model="isFormValid">
                            <v-text-field v-model="formattedLoanAmount" label="ยอดเงินกู้ (บาท)" type="text"
                                suffix="บาท" :rules="rules.loanAmount" />
                            <v-text-field v-model.number="state.interestRate" label="อัตราดอกเบี้ยต่อปี (%)"
                                type="number" suffix="%" :rules="rules.interestRate" />
                            <label class="text-caption">ระยะเวลากู้</label>
                            <div class="d-flex ga-2">
                                <v-text-field v-model.number="state.loanTermYears" type="number" placeholder="ปี"
                                    suffix="ปี" density="compact" />
                                <v-text-field v-model.number="state.loanTermMonths" type="number" placeholder="เดือน"
                                    suffix="เดือน" density="compact" />
                            </div>
                            <v-text-field v-model="state.startDate" label="วันที่เริ่มต้นสัญญา" type="date" />
                        </v-form>
                    </v-card-text>
                </v-card>

                <v-card elevation="2">
                    <v-card-title>ผลการคำนวณ</v-card-title>
                    <v-list>
                        <v-list-item>
                            <v-list-item-title>ยอดผ่อนต่อเดือน</v-list-item-title>
                            <template v-slot:append>
                                <span class="text-h6 text-primary">{{ formatCurrency(monthlyPayment) }}</span>
                            </template>
                        </v-list-item>
                        <v-divider />
                        <v-list-item title="ดอกเบี้ยทั้งหมด" :subtitle="formatCurrency(totalInterest)" />
                        <v-list-item title="ยอดชำระทั้งหมด" :subtitle="formatCurrency(totalPayment)" />
                    </v-list>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn @click="addToComparison" color="primary" variant="flat"
                            prepend-icon="mdi-plus-circle-outline" :disabled="!isFormValid">
                            เพิ่มเพื่อเปรียบเทียบ
                        </v-btn>
                    </v-card-actions>
                </v-card>

                <!-- Pie Chart -->
                <v-card class="mt-5" elevation="2">
                    <v-card-title>สัดส่วนเงินต้นและดอกเบี้ย</v-card-title>
                    <v-card-text style="height: 300px;">
                        <ClientOnly>
                            <LazyLoanPieChart :principal="state.loanAmount" :interest="totalInterest" />
                        </ClientOnly>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- table and charts -->
            <v-col cols="12" md="8">
                <v-card elevation="2">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span>ตารางผ่อนชำระ</span>
                        <div class="d-flex ga-2">
                            <v-btn @click="exportToPDF" prepend-icon="mdi-file-pdf-box" color="red-darken-2"
                                size="small">
                                Export PDF
                            </v-btn>
                            <v-btn @click="exportToCSV" prepend-icon="mdi-file-excel-box" color="green-darken-2"
                                size="small">
                                Export CSV
                            </v-btn>
                        </div>
                    </v-card-title>
                    <v-data-table :headers="headers" :items="amortizationSchedule" density="compact"
                        class="text-no-wrap" fixed-header height="600">
                        <template v-slot:item.payment="{ item }">
                            {{ formatCurrency(item.payment) }}
                        </template>
                        <template v-slot:item.principal="{ item }">
                            {{ formatCurrency(item.principal) }}
                        </template>
                        <template v-slot:item.interest="{ item }">
                            {{ formatCurrency(item.interest) }}
                        </template>
                        <template v-slot:item.balance="{ item }">
                            {{ formatCurrency(item.balance) }}
                        </template>
                    </v-data-table>

                    <!-- Line Chart -->
                    <v-card class="mt-5" elevation="2">
                        <v-card-title>ยอดหนี้คงเหลือรายเดือน</v-card-title>
                        <v-card-text style="height: 300px;">
                            <ClientOnly>
                                <LazyLoanLineChart :schedule="amortizationSchedule" />
                            </ClientOnly>
                        </v-card-text>
                    </v-card>

                    <!-- bar Chart -->
                    <v-card class="mt-5" elevation="2">
                        <v-card-title>เปรียบเทียบดอกเบี้ยรายปี</v-card-title>
                        <v-card-text style="height: 300px;">
                            <ClientOnly>
                                <LazyLoanBarChart :schedule="amortizationSchedule" />
                            </ClientOnly>
                        </v-card-text>
                    </v-card>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup lang="ts">
import { useLoanCalculator } from '~/composables/useLoanCalculator'
import 'jspdf-autotable'
import LoanBarChart from '~/components/LoanBarChart.vue'
import LoanPieChart from '~/components/LoanPieChart.vue'
import LoanLineChart from '~/components/LoanLineChart.vue'
import { useLoanStore } from '~/store/loan'

const state = ref({
    loanAmount: 1000000,
    interestRate: 5.5,
    loanTermYears: 30,
    loanTermMonths: 0,
    startDate: new Date().toISOString().split('T')[0],
})

const isFormValid = ref(true)

const rules = {
    loanAmount: [
        (v: string) => !!v || 'จำเป็นต้องกรอกยอดเงินกู้',
        (v: string) => {
            const value = Number(v.replace(/,/g, ''))
            return (value >= 100000 && value <= 10000000) || 'ยอดเงินกู้ต้องอยู่ระหว่าง 100,000 ถึง 10,000,000'
        },
    ],
    interestRate: [
        (v: number) => !!v || 'จำเป็นต้องกรอกอัตราดอกเบี้ย',
        (v: number) => (v >= 1 && v <= 20) || 'อัตราดอกเบี้ยต้องอยู่ระหว่าง 1 ถึง 20',
    ],
};

const formattedLoanAmount = computed({
    get() {
        return state.value.loanAmount.toLocaleString('en-US')
    },
    set(value) {
        const rawValue = Number(value.replace(/,/g, ''))
        if (!isNaN(rawValue)) {
            state.value.loanAmount = rawValue
        }
    }
})

const {
    monthlyPayment,
    totalPayment,
    totalInterest,
    amortizationSchedule
} = useLoanCalculator(state.value)

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2,
    }).format(value)
}

const headers = [
    { title: 'งวดที่', key: 'month', align: 'start' },
    { title: 'ยอดผ่อน', key: 'payment', align: 'end' },
    { title: 'ชำระเงินต้น', key: 'principal', align: 'end' },
    { title: 'ชำระดอกเบี้ย', key: 'interest', align: 'end' },
    { title: 'เงินต้นคงเหลือ', key: 'balance', align: 'end' },
] as const;

const loanStore = useLoanStore()
function addToComparison() {
    loanStore.addLoan({
        loanAmount: state.value.loanAmount,
        interestRate: state.value.interestRate,
        loanTermYears: state.value.loanTermYears,
        loanTermMonths: state.value.loanTermMonths,
        monthlyPayment: monthlyPayment.value,
        totalInterest: totalInterest.value,
        totalPayment: totalPayment.value,
    })
    alert('เพิ่มในรายการเปรียบเทียบแล้ว!')
}

const exportToPDF = async () => {
    try {
        const { default: jsPDF } = await import('jspdf')
        const { default: autoTable } = await import('jspdf-autotable')
        const fontResponse = await fetch('/fonts/Sarabun-Regular.ttf')
        const font = await fontResponse.arrayBuffer()
        const fontBase64 = btoa(new Uint8Array(font).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        const doc = new jsPDF()
        doc.addFileToVFS('Sarabun-Regular.ttf', fontBase64);
        doc.addFont('Sarabun-Regular.ttf', 'Sarabun', 'normal');
        doc.setFont('Sarabun');
        const tableHead = [headers.map(h => h.title)]
        const tableBody = amortizationSchedule.value.map(row => [
            row.month,
            formatCurrency(row.payment),
            formatCurrency(row.principal),
            formatCurrency(row.interest),
            formatCurrency(row.balance),
        ])
        doc.text("ตารางผ่อนชำระสินเชื่อ", 14, 15)
        autoTable(doc, {
            head: tableHead,
            body: tableBody,
            startY: 20,
            theme: 'grid',
            styles: {
                font: "Sarabun",
                fontStyle: 'normal'
            },
        })
        doc.save('amortization-schedule.pdf')
    } catch (error) {
        console.error("Failed to export PDF:", error)
    }
}

const exportToCSV = () => {
    const headersRow = headers.map(h => h.title).join(',')
    const bodyRows = amortizationSchedule.value.map(row => {
        return [row.month, row.payment, row.principal, row.interest, row.balance].join(',')
    }).join('\n')
    const csvContent = `${headersRow}\n${bodyRows}`
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', 'amortization-schedule.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
</script>

<style lang="scss" scoped></style>