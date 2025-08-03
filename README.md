# Loan Calculator Application

โปรเจกต์นี้คือเว็บแอปพลิเคชันสำหรับคำนวณสินเชื่อแบบลดต้นลดดอก และระบบจัดการบทความที่พัฒนาด้วย Nuxt 3 โดยมีระบบ Authentication ที่เชื่อมต่อกับ Firebase และรองรับการทำงานแบบ PWA

## วิธี Setup และรันโปรเจกต์

- **ติดตั้ง Dependencies:** ใช้คำสั่ง `npm install`
- **รัน Development Server:** ใช้คำสั่ง `npm run dev`

## Features ที่ Implement

### เครื่องคำนวณสินเชื่อ

- มี Form สำหรับกรอกข้อมูลสินเชื่อ (ยอดเงินกู้, อัตราดอกเบี้ย, ระยะเวลา)
- แสดงผลการคำนวณแบบ Real-time (ยอดผ่อนต่อเดือน, ดอกเบี้ยรวม, ยอดชำระทั้งหมด)
- แสดงตารางผ่อนชำระ
- มี Pie Chart, Line Chart และ Bar Chart สำหรับ Data Visualization
- มีระบบเปรียบเทียบสินเชื่อ
- Export ตารางผ่อนชำระเป็น PDF และ CSV

### ระบบจัดการบทความ

- ระบบ CRUD สำหรับจัดการบทความ (CREATE, READ, UPDATE, DELETE)
- มี Rich text editor (Tiptap) สำหรับสร้างบทความ
- มีระบบค้นหาบทความพร้อม Filter และ Search suggestions
- มี Dashboard แสดงสถิติบทความ
- มีระบบ Like/Bookmark, Comment, และ View count
- ระบบ Authentication ด้วย Firebase

## Architecture Decisions

- **Nuxt 3 (SSR):** โปรเจกต์ถูกออกแบบมาในรูปแบบ Server-Side Rendering (SSR) เพื่อประสิทธิภาพและ SEO ที่ดี
- **Folder Structure:** จัดโครงสร้างตามแนวทางของ Nuxt โดยแยก Pages, Components, Composables, Store, และ API Routes อย่างชัดเจน
- **State Management:** ใช้ Pinia สำหรับจัดการ Global State และใช้ `localStorage` สำหรับ Client-side Persistence
- **Data:** ใช้ Mock API (Nitro server routes) ร่วมกับ Mock data ใน `server/db`
- **Authentication:** ใช้ Firebase Auth เพื่อจัดการระบบล็อกอิน

## Demo Credentials

สำหรับล็อกอินเข้าระบบจัดการบทความ ข้อมูลผู้ใช้งานที่สร้างไว้ใน Firebase Console

- **Email:** test@example.com
- **Password:** test1234

## Diagram

แนบเป็นรูปไว้กับ gmail

- **Flowchart:**
- **Architecture Diagram:**
