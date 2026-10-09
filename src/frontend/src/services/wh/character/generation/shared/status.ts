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

// Without a current career (or when it is not in the list), status is Brass 0.
export function populateStatusAndStanding(character: Character, careerList: Career[]): void {
  const current = character.career;
  const career = current && careerList.find((x) => x.id === current.id);
  if (!current || !career) {
    character.status = StatusTier.Brass;
    character.standing = 0;
    return;
  }
  const { status, standing } = generateStatusAndStanding(career, current.number);
  character.status = status;
  character.standing = standing;
}
