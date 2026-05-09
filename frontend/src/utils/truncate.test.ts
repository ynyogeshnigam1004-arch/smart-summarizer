/**
 * Tests for truncateText utility.
 *
 * Validates: Requirements 3.5
 *
 * Mirrors the backend property test in tests/unit/test_truncate.py.
 * Uses fast-check for property-based testing (Property 1).
 */

import { describe, test, expect } from "vitest";
import fc from "fast-check";
import { truncateText } from "./truncate";

// ── Unit tests ─────────────────────────────────────────────────────────────

describe("truncateText – unit tests", () => {
  test("returns empty string unchanged", () => {
    expect(truncateText("")).toBe("");
  });

  test("returns short text unchanged", () => {
    const text = "Hello, world!";
    expect(truncateText(text)).toBe(text);
  });

  test("returns text of exactly 30,000 chars unchanged", () => {
    const text = "a".repeat(30_000);
    expect(truncateText(text)).toBe(text);
  });

  test("truncates text of 30,001 chars to first 15,000 + last 15,000", () => {
    const text = "a".repeat(15_000) + "b".repeat(15_001);
    const result = truncateText(text);
    expect(result).toBe(text.slice(0, 15_000) + text.slice(text.length - 15_000));
    expect(result.length).toBe(30_000);
  });

  test("truncates text of 60,000 chars to first 15,000 + last 15,000", () => {
    const head = "H".repeat(15_000);
    const middle = "M".repeat(30_000);
    const tail = "T".repeat(15_000);
    const text = head + middle + tail;
    const result = truncateText(text);
    expect(result).toBe(head + tail);
    expect(result.length).toBe(30_000);
  });

  test("custom maxChars parameter is respected", () => {
    const text = "abcdefghij"; // 10 chars
    expect(truncateText(text, 10)).toBe(text);
    expect(truncateText(text, 8)).toBe("abcd" + "ghij");
  });
});

// ── Property-based tests ───────────────────────────────────────────────────

/**
 * Feature: ai-smart-summarizer, Property 1: Text truncation preserves boundaries
 *
 * Validates: Requirements 3.5
 */
describe("truncateText – property-based tests (Property 1)", () => {
  test("short strings (≤ 30,000 chars) are returned unchanged", () => {
    fc.assert(
      fc.property(
        fc.string({ maxLength: 30_000 }),
        (text) => {
          const result = truncateText(text);
          return result === text;
        }
      ),
      { numRuns: 200 }
    );
  });

  test("long strings (> 30,000 chars) are truncated to first 15,000 + last 15,000", () => {
    fc.assert(
      fc.property(
        // Generate strings strictly longer than 30,000 chars (up to 60,000)
        fc.string({ minLength: 30_001, maxLength: 60_000 }),
        (text) => {
          const result = truncateText(text);
          const expected = text.slice(0, 15_000) + text.slice(text.length - 15_000);
          return result === expected && result.length === 30_000;
        }
      ),
      { numRuns: 100 }
    );
  });
});
