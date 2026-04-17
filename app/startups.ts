export type Decision = "Interested" | "Pass" | "Pending";

export interface Startup {
  id: string;
  name: string;
  industry: string;
  stage: string;
  summary: string;
  strengths: string[];
  risks: string[];
  score: number;
  decision: Decision;
  reason: string;
  founded: string;
  location: string;
}

export const startups: Startup[] = [
  {
    id: "1",
    name: "NovaMed AI",
    industry: "HealthTech",
    stage: "Series A",
    summary:
      "AI-powered diagnostics platform that reduces misdiagnosis rates by 40% using multimodal imaging analysis. Currently deployed in 12 hospitals across Southeast Asia.",
    strengths: [
      "FDA breakthrough device designation",
      "Strong clinical validation data",
      "Experienced founding team with 2 prior exits",
      "90%+ gross margins on SaaS contracts",
    ],
    risks: [
      "Regulatory approval timelines unpredictable",
      "High customer acquisition cost in enterprise healthcare",
      "Competitive pressure from established players like Siemens Healthineers",
    ],
    score: 9,
    decision: "Interested",
    reason:
      "Exceptional clinical outcomes data, defensible IP moat, and a proven go-to-market in a high-value vertical.",
    founded: "2021",
    location: "Singapore",
  },
  {
    id: "2",
    name: "LoopCart",
    industry: "E-Commerce",
    stage: "Seed",
    summary:
      "Social commerce platform enabling micro-influencers to host live shopping events. GMV grew 3x last quarter but profitability runway is under 8 months.",
    strengths: [
      "Viral growth loops with low CAC",
      "Strong Gen-Z retention metrics",
      "First-mover in Tier-2 Indian cities",
    ],
    risks: [
      "Unit economics unproven at scale",
      "Short cash runway",
      "Market is crowded with well-funded competitors",
      "Founder team lacks financial discipline",
    ],
    score: 5,
    decision: "Pending",
    reason:
      "Interesting traction but cash efficiency needs improvement before we commit capital.",
    founded: "2023",
    location: "Bengaluru, India",
  },
  {
    id: "3",
    name: "CarbonLedger",
    industry: "ClimaTech",
    stage: "Pre-Seed",
    summary:
      "Blockchain-based carbon credit verification protocol targeting voluntary carbon markets. Still pre-revenue with a prototype in beta testing.",
    strengths: [
      "Novel technical approach to credit double-counting problem",
      "Strong academic advisors from MIT Climate Lab",
    ],
    risks: [
      "Pre-revenue with no paying customers",
      "Regulatory landscape for carbon markets is highly uncertain",
      "Token-based model faces legal ambiguity",
      "Long sales cycles in corporate sustainability teams",
      "Competing open-source protocols emerging",
    ],
    score: 3,
    decision: "Pass",
    reason:
      "Too early-stage for our fund mandate and the regulatory risk in voluntary carbon markets is currently too high.",
    founded: "2024",
    location: "Berlin, Germany",
  },
];
