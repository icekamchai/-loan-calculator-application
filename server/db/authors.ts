export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
}

export const authorsDB: Author[] = [
  {
    id: "khun-jai-lole",
    name: "คุณ ใจ โลเล",
    avatar: "https://i.pravatar.cc/150?u=jai-lole",
    bio: "ผู้เชี่ยวชาญด้านการวางแผนการเงินส่วนบุคคล มีประสบการณ์มากกว่า 10 ปีในการให้คำปรึกษาด้านการออมและการลงทุน",
  },
  {
    id: "rak-tae-pae-pla-too",
    name: "รักแท้แพ้ปลาทู",
    avatar: "https://i.pravatar.cc/150?u=raktae",
    bio: "นักลงทุนและนักวิเคราะห์ตลาดทุน สนใจในเรื่องพลังของดอกเบี้ยทบต้นและการลงทุนในระยะยาว",
  },
  {
    id: "kai-tod-hatyai",
    name: "ไก่ทอดหาดใหญ่",
    avatar: "https://i.pravatar.cc/150?u=kai-tod",
    bio: "นักเขียนอิสระที่ชื่นชอบการแบ่งปันความรู้ด้านการเงินและการลงทุนที่ย่อยง่ายและใช้ได้จริง",
  },
  {
    id: "somchai-jsm",
    name: "สมรชัย ใจสั่งมา",
    avatar: "https://i.pravatar.cc/150?u=somchai-jsm",
    bio: "กูรูด้านการลงทุนในสินทรัพย์ทางเลือกและเทรนด์การลงทุนใหม่ๆ",
  },
  {
    id: "admin",
    name: "Admin",
    avatar: "https://i.pravatar.cc/150?u=admin",
    bio: "ผู้ดูแลระบบและทีมงานเนื้อหาของ Loan Calculator",
  },
];
