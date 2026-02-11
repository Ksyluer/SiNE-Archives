export type Category = 
  | "characters"
  | "locations"
  | "cultures"
  | "magic"
  | "technology"
  | "timeline"
  | "misc";

export interface Entry {
  id: string;
  title: string;
  category: Category;
  tags: string[];
  content: string;
  imageUrl?: string;
  relations: { targetId: string; type: string }[];
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: "characters", label: "Characters", icon: "Users" },
  { id: "locations", label: "Locations", icon: "Map" },
  { id: "cultures", label: "Cultures", icon: "Globe" },
  { id: "magic", label: "Redactory", icon: "Sparkles" },
  { id: "technology", label: "Technology", icon: "Cpu" },
  { id: "timeline", label: "Timeline", icon: "Clock" },
  { id: "misc", label: "Miscellaneous", icon: "FileBox" },
];
