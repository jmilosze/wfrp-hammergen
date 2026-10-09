// 4e starting wealth by status.
import { StatusStanding, StatusTier } from "../../../content/career.ts";
import { RollDiceFn } from "../../../../../utils/random.ts";

export function generateCoins4e(
  status: StatusTier,
  standing: StatusStanding,
  rollDiceFn: RollDiceFn,
): [number, number, number] {
  if (status === StatusTier.Brass) {
    return [rollDiceFn(10, 2 * standing), 0, 0];
  } else if (status === StatusTier.Silver) {
    return [0, rollDiceFn(10, standing), 0];
  } else {
    return [0, 0, standing];
  }
}
