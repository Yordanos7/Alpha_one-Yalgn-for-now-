export type ReatType = "hourly" | "fixed";
export type ExperienceLevel = "entry" | "intermediate" | "expert";
export type Rating = 1 | 2 | 3 | 4 | 5;

export interface FreelancerFiltersState {
  search: string;
  category: string | null;
  rateType: ReatType | null;
  experiences: ExperienceLevel | null;
  language: string | null;
  rating: Rating | null;
  level: ExperienceLevel | null;
  estimatedDelivery: number | null;
}
