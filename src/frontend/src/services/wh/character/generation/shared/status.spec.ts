import { describe, expect, test } from "vitest";
import { generateStatusAndStanding, populateStatusAndStanding } from "./status.ts";
import { Career, StatusTier } from "../../../content/career.ts";
import { Character } from "../../character.ts";

describe("status", () => {
  test("generateStatusAndStanding returns level status and standing", () => {
    const career = new Career();
    career.level1.status = StatusTier.Silver;
    career.level1.standing = 3;

    const result = generateStatusAndStanding(career, 1);
    expect(result).toEqual({ status: StatusTier.Silver, standing: 3 });
  });

  test("populateStatusAndStanding updates status on character", () => {
    const career = new Career({ id: "c1" });
    career.level2.status = StatusTier.Gold;
    career.level2.standing = 2;
    const char = new Character({ career: { id: "c1", number: 2 } });

    populateStatusAndStanding(char, [career]);
    expect(char.status).toEqual(StatusTier.Gold);
    expect(char.standing).toEqual(2);
  });

  test("populateStatusAndStanding sets Brass 0 when the character has no career", () => {
    const career = new Career({ id: "c1" });
    career.level1.status = StatusTier.Gold;
    const char = new Character({ status: StatusTier.Silver, standing: 3 });

    populateStatusAndStanding(char, [career]);
    expect(char.status).toEqual(StatusTier.Brass);
    expect(char.standing).toEqual(0);
  });
});
