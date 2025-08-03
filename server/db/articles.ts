export interface VersionHistory {
  timestamp: string;
  editorId: string;
  title: string;
  content: string;
}

export interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorId: string;
  publishedAt: string;
  status: "published" | "archived" | "draft";
  viewCount: number;
  isFeatured: boolean;
  comments: Comment[];
  metaTitle?: string;
  metaDescription?: string;
  versionHistory?: VersionHistory[];
  series?: string;
}

export const articlesDB: Article[] = [
  {
    id: 1,
    title: "5 วิธีวางแผนการเงินสำหรับผู้เริ่มต้น",
    excerpt:
      "เริ่มต้นวางแผนอนาคตทางการเงินของคุณตั้งแต่วันนี้ด้วย 5 ขั้นตอนง่ายๆ ที่ใครก็ทำตามได้...",
    content: `<p>การวางแผนการเงินเป็นสิ่งสำคัญที่ไม่ว่าใครก็ควรทำ นี่คือ 5 ขั้นตอนง่ายๆ ที่จะช่วยให้คุณเริ่มต้นได้...</p>`,
    coverImage:
      "https://placehold.co/1200x600/77BEF0/FFFFFF?text=Financial+Planning",
    category: "การเงินส่วนบุคคล",
    tags: ["วางแผนการเงิน", "ออมเงิน", "ลงทุน"],
    authorId: "khun-jai-lole",
    publishedAt: "2025-08-01",
    status: "published",
    viewCount: 1523,
    isFeatured: true,
    comments: [
      {
        id: 1,
        author: "สมชาย",
        avatar: "https://i.pravatar.cc/150?u=somchai",
        content: "เป็นบทความที่ดีมากครับ!",
        createdAt: "2025-08-01T10:00:00Z",
      },
      {
        id: 2,
        author: "สมหญิง",
        avatar: "https://i.pravatar.cc/150?u=somying",
        content: "ได้ความรู้เยอะเลย ขอบคุณครับ",
        createdAt: "2025-08-01T11:30:00Z",
      },
    ],
    versionHistory: [
      {
        timestamp: "2025-08-01T09:00:00Z",
        editorId: "khun-jai-lole",
        title: "5 วิธีวางแผนการเงินสำหรับผู้เริ่มต้น",
        content: `<p>การวางแผนการเงินเป็นสิ่งสำคัญที่ไม่ว่าใครก็ควรทำ นี่คือ 5 ขั้นตอนง่ายๆ ที่จะช่วยให้คุณเริ่มต้นได้...</p>`,
      },
    ],
    series: "Series A: เริ่มต้นวางแผนการเงิน",
  },
  {
    id: 2,
    title: 'ทำความเข้าใจ "ดอกเบี้ยทบต้น" พลังมหัศจรรย์ของการลงทุน',
    excerpt:
      "ดอกเบี้ยทบต้นคืออะไร? ทำไมไอน์สไตน์ถึงเรียกว่าสิ่งมหัศจรรย์อันดับ 8 ของโลก มาหาคำตอบกัน...",
    content: `<p>ดอกเบี้ยทบต้นคือการที่ดอกเบี้ยที่คุณได้รับ ถูกนำกลับไปลงทุนต่อเพื่อสร้างดอกเบี้ยเพิ่มขึ้นไปอีก...</p>`,
    coverImage:
      "https://placehold.co/1200x600/FFCB61/FFFFFF?text=Compound+Interest",
    category: "การลงทุน",
    tags: ["ลงทุน", "ดอกเบี้ย", "ระยะยาว"],
    authorId: "rak-tae-pae-pla-too",
    publishedAt: "2025-07-25",
    status: "published",
    viewCount: 2658,
    isFeatured: true,
    comments: [],
    versionHistory: [
      {
        timestamp: "2025-07-25T14:00:00Z",
        editorId: "rak-tae-pae-pla-too",
        title: 'ทำความเข้าใจ "ดอกเบี้ยทบต้น" พลังมหัศจรรย์ของการลงทุน',
        content: `<p>ดอกเบี้ยทบต้นคือการที่ดอกเบี้ยที่คุณได้รับ ถูกนำกลับไปลงทุนต่อเพื่อสร้างดอกเบี้ยเพิ่มขึ้นไปอีก...</p>`,
      },
    ],
    series: "Series B: เทคนิคการลงทุนเบื้องต้น",
  },
  {
    id: 3,
    title: "เคล็ดลับการออมเงิน ฉบับมนุษย์เงินเดือน",
    excerpt:
      "เทคนิคง่ายๆ ในการเพิ่มเงินออมของคุณในแต่ละเดือน แม้เงินเดือนจะเท่าเดิม...",
    content:
      "<p>การออมเงินไม่ใช่เรื่องยาก แม้จะมีรายได้จำกัด หากรู้จักวางแผนและมีวินัย...</p>",
    coverImage: "https://placehold.co/1200x600/98D7C2/FFFFFF?text=Saving+Tips",
    category: "การเงินส่วนบุคคล",
    tags: ["ออมเงิน", "มนุษย์เงินเดือน", "วางแผนการเงิน"],
    authorId: "khun-jai-lole",
    publishedAt: "2025-08-02",
    status: "published",
    viewCount: 980,
    isFeatured: true,
    comments: [],
    versionHistory: [
      {
        timestamp: "2025-08-02T12:00:00Z",
        editorId: "khun-jai-lole",
        title: "เคล็ดลับการออมเงิน ฉบับมนุษย์เงินเดือน",
        content:
          "<p>การออมเงินไม่ใช่เรื่องยาก แม้จะมีรายได้จำกัด หากรู้จักวางแผนและมีวินัย...</p>",
      },
    ],
    series: "Series A: เริ่มต้นวางแผนการเงิน",
  },
  {
    id: 4,
    title: "ลงทุนในหุ้นสำหรับมือใหม่ เริ่มต้นอย่างไรดี?",
    excerpt:
      "อยากเริ่มลงทุนในตลาดหุ้น แต่ไม่รู้จะเริ่มตรงไหน? บทความนี้มีคำตอบสำหรับคุณ",
    content:
      "<p>การลงทุนในหุ้นอาจดูน่ากลัวสำหรับมือใหม่ แต่ด้วยความเข้าใจที่ถูกต้อง ทุกคนก็สามารถเริ่มต้นได้...</p>",
    coverImage:
      "https://placehold.co/1200x600/F28D8D/FFFFFF?text=Stock+Investing",
    category: "การลงทุน",
    tags: ["ลงทุน", "หุ้น", "มือใหม่"],
    authorId: "rak-tae-pae-pla-too",
    publishedAt: "2025-07-15",
    status: "published",
    viewCount: 1890,
    isFeatured: false,
    comments: [],
    versionHistory: [
      {
        timestamp: "2025-07-15T08:30:00Z",
        editorId: "rak-tae-pae-pla-too",
        title: "ลงทุนในหุ้นสำหรับมือใหม่ เริ่มต้นอย่างไรดี?",
        content:
          "<p>การลงทุนในหุ้นอาจดูน่ากลัวสำหรับมือใหม่ แต่ด้วยความเข้าใจที่ถูกต้อง ทุกคนก็สามารถเริ่มต้นได้...</p>",
      },
    ],
    series: "Series B: เทคนิคการลงทุนเบื้องต้น",
  },
  {
    id: 5,
    title: "การจัดการหนี้สินอย่างชาญฉลาด",
    excerpt:
      "หนี้ไม่ใช่เรื่องน่ากลัวเสมอไปหากเรารู้จักจัดการมันอย่างถูกวิธี มาดูเทคนิคปลดหนี้กัน",
    content:
      "<p>หนี้สินเป็นภาระที่สามารถจัดการได้ ขั้นตอนแรกคือการยอมรับและทำความเข้าใจสถานะหนี้ทั้งหมดของคุณ...</p>",
    coverImage:
      "https://placehold.co/1200x600/C5A2F2/FFFFFF?text=Debt+Management",
    category: "การเงินส่วนบุคคล",
    tags: ["หนี้สิน", "วางแผนการเงิน"],
    authorId: "khun-jai-lole",
    publishedAt: "2025-06-20",
    status: "published",
    viewCount: 730,
    isFeatured: false,
    comments: [],
    versionHistory: [
      {
        timestamp: "2025-06-20T11:00:00Z",
        editorId: "khun-jai-lole",
        title: "การจัดการหนี้สินอย่างชาญฉลาด",
        content:
          "<p>หนี้สินเป็นภาระที่สามารถจัดการได้ ขั้นตอนแรกคือการยอมรับและทำความเข้าใจสถานะหนี้ทั้งหมดของคุณ...</p>",
      },
    ],
  },
  {
    id: 6,
    title: "กองทุนรวม RMF/SSF เลือกกองไหนดีสำหรับลดหย่อนภาษี",
    excerpt:
      "สิ้นปีใกล้เข้ามาแล้ว! มาดูกันว่ากองทุนรวม RMF และ SSF กองไหนที่น่าสนใจสำหรับแผนลดหย่อนภาษีของคุณ",
    content:
      "<p>การเลือกลงทุนใน RMF และ SSF เป็นวิธีลดหย่อนภาษีที่ได้รับความนิยม แต่ละกองทุนมีนโยบายและความเสี่ยงต่างกัน...</p>",
    coverImage:
      "https://placehold.co/1200x600/8DA3F2/FFFFFF?text=Tax+Saving+Funds",
    category: "การลงทุน",
    tags: ["ลงทุน", "กองทุนรวม", "ภาษี", "RMF", "SSF"],
    authorId: "kai-tod-hatyai",
    publishedAt: "2025-05-30",
    status: "published",
    viewCount: 3120,
    isFeatured: true,
    comments: [],
    versionHistory: [
      {
        timestamp: "2025-05-30T10:00:00Z",
        editorId: "kai-tod-hatyai",
        title: "กองทุนรวม RMF/SSF เลือกกองไหนดีสำหรับลดหย่อนภาษี",
        content:
          "<p>การเลือกลงทุนใน RMF และ SSF เป็นวิธีลดหย่อนภาษีที่ได้รับความนิยม แต่ละกองทุนมีนโยบายและความเสี่ยงต่างกัน...</p>",
      },
    ],
  },
  {
    id: 7,
    title: "สร้าง Passive Income จากการลงทุนอสังหาริมทรัพย์",
    excerpt:
      "ฝันอยากมีรายได้โดยไม่ต้องทำงานหนักตลอดเวลา? การลงทุนในอสังหาริมทรัพย์อาจเป็นคำตอบ",
    content:
      "<p>Passive Income คือรายได้ที่เข้ามาอย่างสม่ำเสมอโดยที่เราไม่ต้องลงแรงทำงานตลอดเวลา การลงทุนอสังหาฯ เพื่อปล่อยเช่าเป็นหนึ่งในวิธีที่นิยมที่สุด...</p>",
    coverImage: "https://placehold.co/1200x600/F2C5A2/FFFFFF?text=Real+Estate",
    category: "การลงทุน",
    tags: ["ลงทุน", "อสังหาริมทรัพย์", "Passive Income", "ระยะยาว"],
    authorId: "rak-tae-pae-pla-too",
    publishedAt: "2025-04-11",
    status: "published",
    viewCount: 2450,
    isFeatured: false,
    comments: [],
    versionHistory: [
      {
        timestamp: "2025-04-11T13:00:00Z",
        editorId: "rak-tae-pae-pla-too",
        title: "สร้าง Passive Income จากการลงทุนอสังหาริมทรัพย์",
        content:
          "<p>Passive Income คือรายได้ที่เข้ามาอย่างสม่ำเสมอโดยที่เราไม่ต้องลงแรงทำงานตลอดเวลา การลงทุนอสังหาฯ เพื่อปล่อยเช่าเป็นหนึ่งในวิธีที่นิยมที่สุด...</p>",
      },
    ],
    series: "Series B: เทคนิคการลงทุนเบื้องต้น",
  },
  {
    id: 8,
    title: "5 ประกันที่ควรมีติดตัวไว้ อุ่นใจทุกสถานการณ์",
    excerpt:
      "การประกันไม่ใช่ค่าใช้จ่าย แต่คือการลงทุนในความปลอดภัยของชีวิตและทรัพย์สินของคุณ",
    content:
      "<p>ไม่มีใครรู้ว่าจะเกิดอะไรขึ้นในอนาคต การมีประกันที่เหมาะสมจะช่วยลดภาระทางการเงินเมื่อเกิดเหตุไม่คาดฝัน...</p>",
    coverImage: "https://placehold.co/1200x600/A2D8F2/FFFFFF?text=Insurance",
    category: "การเงินส่วนบุคคล",
    tags: ["ประกัน", "วางแผนการเงิน", "ความเสี่ยง"],
    authorId: "khun-jai-lole",
    publishedAt: "2025-03-18",
    status: "published",
    viewCount: 1150,
    isFeatured: false,
    comments: [],
    versionHistory: [
      {
        timestamp: "2025-03-18T09:00:00Z",
        editorId: "khun-jai-lole",
        title: "5 ประกันที่ควรมีติดตัวไว้ อุ่นใจทุกสถานการณ์",
        content:
          "<p>ไม่มีใครรู้ว่าจะเกิดอะไรขึ้นในอนาคต การมีประกันที่เหมาะสมจะช่วยลดภาระทางการเงินเมื่อเกิดเหตุไม่คาดฝัน...</p>",
      },
    ],
  },
  {
    id: 9,
    title: "เทรนด์การลงทุนปี 2025 ที่คุณไม่ควรพลาด",
    excerpt:
      "โลกกำลังเปลี่ยนแปลงไปอย่างรวดเร็ว มาอัปเดตเทรนด์การลงทุนที่กำลังมาแรงและน่าจับตามองในปี 2025",
    content:
      "<p>เทคโนโลยี, ความยั่งยืน (ESG), และสุขภาพ เป็นเมกะเทรนด์ที่จะขับเคลื่อนเศรษฐกิจโลกในอนาคต...</p>",
    coverImage:
      "https://placehold.co/1200x600/8DF2A2/FFFFFF?text=Investment+Trends",
    category: "การลงทุน",
    tags: ["ลงทุน", "เทรนด์", "อนาคต"],
    authorId: "somchai-jsm",
    publishedAt: "2025-02-28",
    status: "published",
    viewCount: 1999,
    isFeatured: true,
    comments: [],
    versionHistory: [
      {
        timestamp: "2025-02-28T09:00:00Z",
        editorId: "somchai-jsm",
        title: "เทรนด์การลงทุนปี 2025 ที่คุณไม่ควรพลาด",
        content:
          "<p>เทคโนโลยี, ความยั่งยืน (ESG), และสุขภาพ เป็นเมกะเทรนด์ที่จะขับเคลื่อนเศรษฐกิจโลกในอนาคต...</p>",
      },
    ],
  },
  {
    id: 10,
    title: "บทความเก่า: การลงทุนในทองคำ (Archived)",
    excerpt: "บทความนี้ถูกย้ายไปเก็บถาวรแล้ว",
    content: "<p>เนื้อหานี้เป็นของบทความเก่าที่ถูกพักการเผยแพร่...</p>",
    coverImage: "https://placehold.co/1200x600/E0E0E0/000000?text=Archived",
    category: "การลงทุน",
    tags: ["ลงทุน", "ทองคำ"],
    authorId: "rak-tae-pae-pla-too",
    publishedAt: "2024-01-10",
    status: "archived",
    viewCount: 550,
    isFeatured: false,
    comments: [],
  },
  {
    id: 11,
    title: "บทความฉบับร่าง: การลงทุนในกองทุนรวม",
    excerpt: "บทความนี้ยังไม่ถูกเผยแพร่",
    content: "<p>เนื้อหานี้เป็นเพียงฉบับร่างที่กำลังจัดทำ...</p>",
    coverImage: "https://placehold.co/1200x600/BDBDBD/000000?text=Draft",
    category: "การลงทุน",
    tags: ["ลงทุน", "กองทุนรวม"],
    authorId: "admin",
    publishedAt: "2025-08-15T09:00:00Z",
    status: "draft",
    viewCount: 0,
    isFeatured: false,
    comments: [],
    series: "Series B: เทคนิคการลงทุนเบื้องต้น",
  },
];
