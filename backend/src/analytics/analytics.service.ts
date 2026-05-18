import { Injectable } from "@nestjs/common";
import { GitHubService } from "../github/github.service";
import { RepositoryRankItemDto } from "./dto/repository-rank-item.dto";
import { LanguageDistributionItemDto } from "./dto/language-distribution-item.dto";
import { UserAnalyticsSummaryResponseDto } from "./dto/user-analytics-summary-response.dto";
import { GitHubRepositoryResponseDto } from "../github/dto/github-repository-response.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly githubService: GitHubService) {}

  private mapToRepositoryRankItem(
    repo: GitHubRepositoryResponseDto,
  ): RepositoryRankItemDto {
    return {
      name: repo.name,
      fullName: repo.fullName,
      stars: repo.stars,
      forks: repo.forks,
      openIssues: repo.openIssues,
      language: repo.language ?? null,
      url: repo.repositoryUrl,
    };
  }

  private roundPercentage(value: number): number {
    return Number(value.toFixed(2));
  }

  private calculateLanguageDistribution(repos: GitHubRepositoryResponseDto[]) {
    const counts: Record<string, number> = {};
    const total = repos.length;

    repos.forEach((r) => {
      const lang = r.language && r.language.trim() ? r.language : "Unknown";
      counts[lang] = (counts[lang] || 0) + 1;
    });

    const items: LanguageDistributionItemDto[] = Object.entries(counts)
      .map(([language, repositoryCount]) => ({
        language,
        repositoryCount,
        percentage: this.roundPercentage((repositoryCount / total) * 100),
      }))
      .sort((a, b) => b.repositoryCount - a.repositoryCount);

    return items;
  }

  private getTopRepositoriesBy(
    repos: GitHubRepositoryResponseDto[],
    key: "stars" | "forks",
    limit = 5,
  ) {
    return repos
      .slice()
      .sort((a, b) => b[key] - a[key])
      .slice(0, limit)
      .map((r) => this.mapToRepositoryRankItem(r));
  }

  async getUserSummary(
    username: string,
  ): Promise<UserAnalyticsSummaryResponseDto> {
    const repos = await this.githubService.getUserRepositories(username, {
      page: 1,
      perPage: 100,
      sort: "updated",
      direction: "desc",
    } as any);

    const totalRepositories = repos.length;
    const totalStars = repos.reduce((s, r) => s + (r.stars || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks || 0), 0);
    const totalOpenIssues = repos.reduce((s, r) => s + (r.openIssues || 0), 0);
    const averageStarsPerRepository =
      totalRepositories > 0
        ? Number((totalStars / totalRepositories).toFixed(2))
        : 0;

    const topRepositoriesByStars = this.getTopRepositoriesBy(repos, "stars");
    const topRepositoriesByForks = this.getTopRepositoriesBy(repos, "forks");
    const languages =
      totalRepositories > 0 ? this.calculateLanguageDistribution(repos) : [];

    return {
      username,
      totalRepositories,
      totalStars,
      totalForks,
      totalOpenIssues,
      averageStarsPerRepository,
      topRepositoriesByStars,
      topRepositoriesByForks,
      languages,
    };
  }

  async getUserLanguages(
    username: string,
  ): Promise<LanguageDistributionItemDto[]> {
    const repos = await this.githubService.getUserRepositories(username, {
      page: 1,
      perPage: 100,
      sort: "updated",
      direction: "desc",
    } as any);

    if (repos.length === 0) return [];

    return this.calculateLanguageDistribution(repos);
  }
}
