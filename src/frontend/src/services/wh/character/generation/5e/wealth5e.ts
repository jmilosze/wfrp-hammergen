// 5e starting wealth by status.
import { StatusStanding, StatusTier } from "../../../content/career.ts";
import { RollDiceFn } from "../../../../../utils/random.ts";

// Starting wealth by status (p. 39): Brass 20 d + 2d10 per Standing, Silver 10/– + 1d10 per Standing,
// Gold 2 GC + 1 per Standing.
export function generateCoins5e(
  status: StatusTier,
  standing: StatusStanding,
  rollDiceFn: RollDiceFn,
): [number, number, number] {
  if (status === StatusTier.Brass) {
    return [20 + rollDiceFn(10, 2 * standing), 0, 0];
  } else if (status === StatusTier.Silver) {
    return [0, 10 + rollDiceFn(10, standing), 0];
  } else {
    return [0, 0, 2 + standing];
  }
}
