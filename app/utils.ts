import { Startup } from "./startups";

// ─── Pipeline Grouping ────────────────────────────────────────────────────────

export interface PipelineGroups {
  Interested: Startup[];
  "Due Diligence": Startup[];
  Passed: Startup[];
}

export function groupByPipeline(startups: Startup[]): PipelineGroups {
  const groups: PipelineGroups = { Interested: [], "Due Diligence": [], Passed: [] };
  for (const startup of startups) {
    if (startup.decision === "Interested") groups.Interested.push(startup);
    else if (startup.decision === "Pending") groups["Due Diligence"].push(startup);
    else if (startup.decision === "Pass") groups.Passed.push(startup);
  }
  return groups;
}

// ─── Filter + Sort ────────────────────────────────────────────────────────────

export interface StartupFilters {
  industry?: string;
  stage?: string;
  decision?: string;
  sortBy?: "score" | "newest";
}

export function filterAndSortStartups(
  startups: Startup[],
  filters: StartupFilters
): Startup[] {
  let result = [...startups];

  if (filters.industry) result = result.filter((s) => s.industry === filters.industry);
  if (filters.stage) result = result.filter((s) => s.stage === filters.stage);
  if (filters.decision) result = result.filter((s) => s.decision === filters.decision);

  if (filters.sortBy === "score") {
    result.sort((a, b) => b.score - a.score);
  } else if (filters.sortBy === "newest") {
    result.sort((a, b) => parseInt(b.founded) - parseInt(a.founded));
  }

  return result;
}
