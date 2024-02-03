import { RandomTalents } from "./characterGeneration/generateSpeciesTalents.ts";
import { AxiosInstance, AxiosResponse } from "axios";

export interface GenerationProps {
  classItems: { equipped: Record<string, string>; carried: Record<string, string> }[];
  randomTalents: RandomTalents;
  speciesTalents: Record<string, string[]>;
  speciesSkills: Record<string, string[]>;
}

export async function getGenerationProps(axiosInstance: AxiosInstance): Promise<GenerationProps> {
  const serverResp = await axiosInstance.get("/api/wh/generation");
  return (serverResp as AxiosResponse<{ data: GenerationProps }, any>).data.data;
}
