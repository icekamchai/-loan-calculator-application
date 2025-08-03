import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLikes } from "./useLikes";
import { ref, onMounted } from "vue";

vi.mock("vue", () => ({
  ref: (value: any) => ({ value }),
  onMounted: (fn: any) => fn(),
}));

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });
Object.defineProperty(global, "process", { value: { client: true } });

describe("useLikes", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should initialize with an empty set of liked articles", () => {
    const { isLiked } = useLikes();
    expect(isLiked(1)).toBe(false);
    expect(isLiked(2)).toBe(false);
  });

  it("should be able to like an article", () => {
    const { isLiked, toggleLike } = useLikes();
    toggleLike(1);
    expect(isLiked(1)).toBe(true);
  });

  it("should be able to unlike an article", () => {
    const { isLiked, toggleLike } = useLikes();
    toggleLike(1); // Like it first
    expect(isLiked(1)).toBe(true);
    toggleLike(1); // Unlike it
    expect(isLiked(1)).toBe(false);
  });

  it("should store liked articles in localStorage", () => {
    const { toggleLike } = useLikes();
    toggleLike(1);
    toggleLike(2);
    expect(localStorage.getItem("liked_articles")).toBe("[1,2]");
  });

  it("should load liked articles from localStorage on initialization", () => {
    localStorage.setItem("liked_articles", JSON.stringify([1, 5]));
    const { isLiked } = useLikes();
    expect(isLiked(1)).toBe(true);
    expect(isLiked(5)).toBe(true);
    expect(isLiked(2)).toBe(false);
  });
});
