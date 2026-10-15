// Generation data (species skills/talents, Random Talents, class trappings) served by the API per edition.
import { RandomTalents } from "./talents.ts";
import { AxiosInstance } from "axios";

export interface GenerationProps {
  classItems: { equipped: Record<string, string>; carried: Record<string, string> }[];
  randomTalents: RandomTalents;
  // Not every species has generation data, so lookups may return undefined.
  speciesTalents: Partial<Record<string, string[]>>;
  speciesSkills: Partial<Record<string, string[]>>;
}

// 5e generation data adds each species' fluent languages (+30 each).
export interface GenerationProps5e extends GenerationProps {
  speciesLanguages: Partial<Record<string, string[]>>;
}

export async function getGenerationProps(axiosInstance: AxiosInstance): Promise<GenerationProps> {
  const { data } = await axiosInstance.get<{ data: GenerationProps }>("/api/wh/generation");
  return data.data;
}

export async function getGenerationProps5e(axiosInstance: AxiosInstance): Promise<GenerationProps5e> {
  const { data } = await axiosInstance.get<{ data: GenerationProps5e }>("/api/wh/generation", {
    params: { edition: "5e" },
  });
  return data.data;
}
