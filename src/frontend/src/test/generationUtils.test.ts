import { describe, expect, test, vi } from "vitest";
import { parseQuantityOrRoll, selectIdFromCandidates } from "../services/wh/characterGeneration/generationUtils.ts";
import { SelectRandomFn } from "../utils/random.ts";

describe("generationUtils", () => {
  describe("selectIdFromCandidates", () => {
    test("returns single ID without calling selectRandomFn", () => {
      const mockRandom: SelectRandomFn = vi.fn();
      const result = selectIdFromCandidates("sword", mockRandom);

      expect(result).toBe("sword");
      expect(mockRandom).not.toHaveBeenCalled();
    });

    test("calls selectRandomFn when multiple comma-separated IDs are present", () => {
      let passedItems: unknown[] = [];
      const mockRandom: SelectRandomFn = <T>(items: T[]): T => {
        passedItems = items;
        return items[1];
      };
      const result = selectIdFromCandidates("sword,axe,mace", mockRandom);

      expect(passedItems).toEqual(["sword", "axe", "mace"]);
      expect(result).toBe("axe");
    });
  });

  describe("parseQuantityOrRoll", () => {
    test("parses plain integer strings without rolling dice", () => {
      const mockRoll = vi.fn();
      expect(parseQuantityOrRoll("1", mockRoll)).toBe(1);
      expect(parseQuantityOrRoll("12", mockRoll)).toBe(12);
      expect(mockRoll).not.toHaveBeenCalled();
    });

    test("evaluates single dice roll strings like 1d10", () => {
      const mockRoll = vi.fn((sides: number, rolls: number) => {
        expect(sides).toBe(10);
        expect(rolls).toBe(1);
        return 7;
      });

      const result = parseQuantityOrRoll("1d10", mockRoll);
      expect(result).toBe(7);
      expect(mockRoll).toHaveBeenCalledTimes(1);
    });

    test("evaluates multiple dice roll strings like 2d6", () => {
      const mockRoll = vi.fn((sides: number, rolls: number) => {
        expect(sides).toBe(6);
        expect(rolls).toBe(2);
        return 8;
      });

      const result = parseQuantityOrRoll("2d6", mockRoll);
      expect(result).toBe(8);
      expect(mockRoll).toHaveBeenCalledTimes(1);
    });
  });
});
