import { describe, it, expect, beforeEach } from "vitest";
// Import the core logic directly from the new logic file
import { getSuggestionsLogic } from "./suggestions.logic";
import { articlesDB } from "~/server/db/articles";

// Mock the articlesDB for consistent test results
const mockArticlesDB = [
  {
    id: 1,
    title: "5 วิธีวางแผนการเงินสำหรับผู้เริ่มต้น",
    excerpt: "เริ่มต้นวางแผนอนาคตทางการเงินของคุณตั้งแต่วันนี้...",
    status: "published",
  },
  {
    id: 2,
    title: "ทำความเข้าใจ ดอกเบี้ยทบต้น",
    excerpt: "ดอกเบี้ยทบต้นคืออะไร? ทำไมถึงเป็นสิ่งมหัศจรรย์...",
    status: "published",
  },
  {
    id: 3,
    title: "เคล็ดลับการออมเงิน ฉบับมนุษย์เงินเดือน",
    excerpt: "เทคนิคง่ายๆ ในการเพิ่มเงินออมของคุณ...",
    status: "published",
  },
  {
    id: 4,
    title: "บทความเก่า: การลงทุนในหุ้น",
    excerpt: "บทความนี้ถูกเก็บถาวรแล้ว",
    status: "archived",
  },
];

describe("getSuggestionsLogic", () => {
  let originalArticlesDB: any[];

  beforeEach(() => {
    originalArticlesDB = articlesDB.slice();
    articlesDB.length = 0;
    articlesDB.push(...mockArticlesDB);
  });

  it("should return search suggestions for a valid query and highlight matches", () => {
    const suggestions = getSuggestionsLogic("ดอกเบี้ย");

    expect(suggestions.length).toBe(1);
    expect(suggestions[0].id).toBe(2);
    expect(suggestions[0].title).toBe("ทำความเข้าใจ ดอกเบี้ยทบต้น");
    expect(suggestions[0].highlightedTitle).toBe(
      'ทำความเข้าใจ <span class="highlight">ดอกเบี้ย</span>ทบต้น'
    );
  });

  it("should be case-insensitive", () => {
    const suggestions = getSuggestionsLogic("เงิน");

    expect(suggestions.length).toBe(2);
    expect(suggestions[0].title).toBe("5 วิธีวางแผนการเงินสำหรับผู้เริ่มต้น");
    expect(suggestions[0].highlightedTitle).toBe(
      '5 วิธีวางแผนการ<span class="highlight">เงิน</span>สำหรับผู้เริ่มต้น'
    );
  });

  it("should not return suggestions for a query less than 2 characters", () => {
    const suggestions = getSuggestionsLogic("ว");

    expect(suggestions.length).toBe(0);
  });

  it("should return an empty array if no matches are found", () => {
    const suggestions = getSuggestionsLogic("ไม่เจอ");

    expect(suggestions.length).toBe(0);
  });

  it("should only return suggestions for published articles", () => {
    const suggestions = getSuggestionsLogic("บทความเก่า");

    expect(suggestions.length).toBe(0);
  });
});
