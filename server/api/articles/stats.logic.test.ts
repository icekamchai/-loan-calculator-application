import { describe, it, expect } from "vitest";
import { getArticleStats } from "./stats.logic";
import type { Article } from "~/server/db/articles";

// Mock data to be used in the test
const mockArticles: Article[] = [
  {
    id: 1,
    title: "Article 1",
    excerpt: "...",
    content: "...",
    coverImage: "...",
    category: "...",
    tags: [],
    authorId: "...",
    publishedAt: "2025-01-01",
    status: "published",
    viewCount: 100,
    isFeatured: false, // เพิ่มบรรทัดนี้
    comments: [
      {
        id: 1,
        author: "A",
        avatar: "B",
        content: "C",
        createdAt: "2025-01-01",
      },
      {
        id: 2,
        author: "D",
        avatar: "E",
        content: "F",
        createdAt: "2025-01-01",
      },
    ],
  },
  {
    id: 2,
    title: "Article 2",
    excerpt: "...",
    content: "...",
    coverImage: "...",
    category: "...",
    tags: [],
    authorId: "...",
    publishedAt: "2025-01-01",
    status: "published",
    viewCount: 200,
    isFeatured: true, // เพิ่มบรรทัดนี้
    comments: [
      {
        id: 3,
        author: "G",
        avatar: "H",
        content: "I",
        createdAt: "2025-01-01",
      },
    ],
  },
  {
    id: 3,
    title: "Article 3",
    excerpt: "...",
    content: "...",
    coverImage: "...",
    category: "...",
    tags: [],
    authorId: "...",
    publishedAt: "2025-01-01",
    status: "archived",
    viewCount: 50,
    isFeatured: false, // เพิ่มบรรทัดนี้
    comments: [],
  },
  {
    id: 4,
    title: "Article 4",
    excerpt: "...",
    content: "...",
    coverImage: "...",
    category: "...",
    tags: [],
    authorId: "...",
    publishedAt: "2025-01-01",
    status: "published",
    viewCount: 300,
    isFeatured: true, // เพิ่มบรรทัดนี้
    comments: [
      {
        id: 4,
        author: "J",
        avatar: "K",
        content: "L",
        createdAt: "2025-01-01",
      },
      {
        id: 5,
        author: "M",
        avatar: "N",
        content: "O",
        createdAt: "2025-01-01",
      },
      {
        id: 6,
        author: "P",
        avatar: "Q",
        content: "R",
        createdAt: "2025-01-01",
      },
    ],
  },
  {
    id: 5,
    title: "Article 5",
    excerpt: "...",
    content: "...",
    coverImage: "...",
    category: "...",
    tags: [],
    authorId: "...",
    publishedAt: "2025-01-01",
    status: "draft",
    viewCount: 10,
    isFeatured: false, // เพิ่มบรรทัดนี้
    comments: [],
  },
];

describe("getArticleStats", () => {
  it("should return correct article statistics", () => {
    const stats = getArticleStats(mockArticles);

    expect(stats.totalArticles).toBe(5);
    expect(stats.publishedCount).toBe(3);
    expect(stats.archivedCount).toBe(1);
    expect(stats.totalViews).toBe(660);
    expect(stats.totalComments).toBe(6);
  });

  it("should return top 3 articles sorted by viewCount", () => {
    const stats = getArticleStats(mockArticles);

    expect(stats.topArticles.length).toBe(3);
    expect(stats.topArticles[0].id).toBe(4);
    expect(stats.topArticles[0].title).toBe("Article 4");
    expect(stats.topArticles[0].viewCount).toBe(300);
    expect(stats.topArticles[1].id).toBe(2);
    expect(stats.topArticles[1].viewCount).toBe(200);
    expect(stats.topArticles[2].id).toBe(1);
    expect(stats.topArticles[2].viewCount).toBe(100);
  });
});
