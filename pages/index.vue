<template>
    <v-container class="text-center pa-10" fluid>

        <v-row justify="center" align="center">
            <v-col cols="12" md="8">
                <v-responsive class="mx-auto" max-width="600">
                    <h1 class="text-h2 font-weight-bold mb-4">
                        Loan Calculator Application
                    </h1>
                    <h2 class="text-h6 text-medium-emphasis mb-8">
                        เว็บแอปพลิเคชันสำหรับคำนวณสินเชื่อแบบลดต้นลดดอก
                    </h2>
                    <v-btn to="/calculator" color="primary" size="x-large" variant="flat" class="font-weight-bold">
                        เริ่มคำนวณเลย
                    </v-btn>
                </v-responsive>
            </v-col>
        </v-row>

        <v-divider class="my-5"></v-divider>

        <!-- === Featured Articles Section === -->
        <v-row justify="center">
            <v-col cols="12" md="10">
                <FeaturedArticles />
            </v-col>
        </v-row>
    </v-container>
</template>