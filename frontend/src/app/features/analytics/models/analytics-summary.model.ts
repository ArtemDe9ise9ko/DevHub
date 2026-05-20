export interface TopRepositorySummary {
  readonly id: number;
  readonly name: string;
  readonly fullName: string;
  readonly stars: number;
  readonly forks: number;
  readonly openIssues: number;
  readonly repositoryUrl: string;
}

export interface AnalyticsSummary {
  readonly username?: string;
  readonly avatarUrl?: string;
  readonly totalRepositories: number;
  readonly totalStars: number;
  readonly totalForks: number;
  readonly totalOpenIssues: number;
  readonly topRepositories?: TopRepositorySummary[];
}
