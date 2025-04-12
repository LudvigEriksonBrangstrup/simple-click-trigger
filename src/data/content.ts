
import { Category, ContentItem } from "../types/content";

export const categories: Category[] = [
  { id: "trending", name: "Trending Now" },
  { id: "bipedals", name: "Bipedals" },
  { id: "rovers", name: "Rovers" },
];

// These will be used as fallback content items if Supabase fails
export const contentItems: ContentItem[] = [
  {
    id: "1",
    title: "Go2",
    imageUrl: "/src/data/images/GO_2.png",
    description: "A nimble, four-legged robot designed for industrial inspections and remote operations.",
    categories: ["bipedals","trending"],
    urdfPath: "/urdf/go2_description/urdf/go2_description.urdf",
  },
  {
    id: "2",
    title: "Cassie",
    imageUrl: "/src/data/images/cassie.png",
    description: "A bipedal robot designed for dynamic walking and running tasks.",
    categories: ["bipedals","trending"],
    urdfPath: "/urdf/cassie_description/urdf/cassie_v4.urdf",
  },
  {
    id: "3",
    title: "Stretch",
    imageUrl: "/src/data/images/Stretch.png",
    description: "A robot designed for warehouse automation and material handling.",
    categories: ["trending","rovers"],
    urdfPath: "/urdf/stretch_description/urdf/stretch.urdf",
  },
  {
    id: "4",
    title: "GO",
    imageUrl: "/src/data/images/GO.png",
    description:  "A bipedal Star Wars robot.",
    categories: ["bipedals","trending"],
    urdfPath: "/urdf/GO/go_bdx.urdf",
  },
  {
    id: "5",
    title: "T12",
    imageUrl: "/src/data/images/Athlete.png",
    description: "A humanoid robot designed for customer interaction and emotional recognition.",
    categories: ["trending", "rovers"],
    urdfPath: "/urdf/T12/urdf/T12.URDF",
  },
];
