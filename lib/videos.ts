export type BriefingVideo = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  source: string;
  uploadDate?: string;
  owned: boolean;
};

export const videos: BriefingVideo[] = [
  {
    id: "oz1Bq6Wtw9g",
    title: "Matt Gaetz Interviews Cory Gautereux and John Frankman",
    description:
      "Interview with Cory Gautereaux, founder of The GOAT Initiative, and John Frankman. Published on The GOAT Initiative YouTube channel.",
    date: "2025",
    category: "INTERVIEW",
    source: "The GOAT Initiative",
    uploadDate: "2025-02-19T03:37:50Z",
    owned: true,
  },
  {
    id: "VVQTfAdIs00",
    title: "California Smuggling Network Exposed",
    description:
      "High-risk actors, passports, phones linked to extremists. Segment on smuggling operations uncovered at the southern border.",
    date: "2024",
    category: "FIELD REPORT",
    source: "IRONCLAD",
    owned: false,
  },
  {
    id: "q5IVsKHwZ80",
    title: "Exposing CCP Infiltration Plot",
    description:
      "Trailer on evidence of Chinese Communist Party-linked individuals exploiting border vulnerabilities.",
    date: "2024",
    category: "INVESTIGATION",
    source: "IRONCLAD",
    owned: false,
  },
  {
    id: "9KapPxGtkEI",
    title: "High Tech Human Smuggling Ops",
    description:
      "How criminal organizations use technology, encrypted communications, and coordinated networks to move people across the border.",
    date: "2024",
    category: "INTEL BRIEF",
    source: "IRONCLAD",
    owned: false,
  },
  {
    id: "Df5EOGSe_TE",
    title: "Terrorist Smuggling Operation Preview",
    description:
      "Preview of reporting on a terror-linked smuggling operation and its connection to special interest aliens.",
    date: "2024",
    category: "PREVIEW",
    source: "IRONCLAD",
    owned: false,
  },
];

export function watchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}
