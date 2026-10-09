// Status and standing of a career level.
import { Career, isLevel, StatusStanding, StatusTier } from "../../../content/career.ts";
import { Character } from "../../character.ts";

export function generateStatusAndStanding(
  career: Career,
  level: number,
): { status: StatusTier; standing: StatusStanding } {
  if (isLevel(level)) {
    const careerWithLevel = career.getLevel(level);
    return { status: careerWithLevel.status, standing: careerWithLevel.standing };
  }
  return { status: StatusTier.Brass, standing: 0 };
}

export function populateStatusAndStanding(character: Character, careerList: Career[]): void {
  const career = careerList.find((x) => x.id === character.career.id);
  if (!career) {
    character.status = StatusTier.Brass;
    character.standing = 0;
    return;
  }
  const { status, standing } = generateStatusAndStanding(career, character.career.number);
  character.status = status;
  character.standing = standing;
}
