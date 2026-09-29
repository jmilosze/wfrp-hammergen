import { RandomTalents } from "./characterGeneration/generateSpeciesTalents.ts";
import { AxiosInstance, AxiosResponse } from "axios";

export interface GenerationProps {
  classItems: { equipped: Record<string, string>; carried: Record<string, string> }[];
  randomTalents: RandomTalents;
  // Not every species has generation data, so lookups may return undefined.
  speciesTalents: Partial<Record<string, string[]>>;
  speciesSkills: Partial<Record<string, string[]>>;
}

export async function getGenerationProps(axiosInstance: AxiosInstance): Promise<GenerationProps> {
  const serverResp = await axiosInstance.get("/api/wh/generation");
  return (serverResp as AxiosResponse<{ data: GenerationProps }, any>).data.data;
}
