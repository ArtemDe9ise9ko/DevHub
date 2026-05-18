import { Injectable } from "@nestjs/common";
import { GitHubService } from "../github/github.service";
import { GitHubRepositoryResponseDto } from "../github/dto/github-repository-response.dto";
import {
  GitHubRepositorySort,
  GitHubRepositoryDirection,
} from "../github/dto/github-search-query.dto";
import { RepositoryRankItemDto } from "./dto/repository-rank-item.dto";
import { LanguageDistributionItemDto } from "./dto/language-distribution-item.dto";
import { UserAnalyticsSummaryResponseDto } from "./dto/user-analytics-summary-response.dto";

@Injectable()
export class AnalyticsService {
  constructor(private readonly githubService: GitHubService) {}

  private async loadAllUserRepositories(
    username: string,
  ): Promise<GitHubRepositoryResponseDto[]> {
    const repositories: GitHubRepositoryResponseDto[] = [];
    let page = 1;

    while (true) {
      const pageItems = await this.githubService.getUserRepositories(username, {
        page,
        perPage: 100,
        sort: GitHubRepositorySort.updated,
        direction: GitHubRepositoryDirection.desc,
      });

      repositories.push(...pageItems);

      if (pageItems.length < 100) {
        break;
      }

      page += 1;
    }

    return repositories;
  }

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

  private calculateLanguageDistribution(
    repos: GitHubRepositoryResponseDto[],
  ): LanguageDistributionItemDto[] {
    const counts: Record<string, number> = {};
    const total = repos.length;

    repos.forEach((repo) => {
      const language =
        repo.language && repo.language.trim() ? repo.language : "Unknown";
      counts[language] = (counts[language] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([language, repositoryCount]) => ({
        language,
        repositoryCount,
        percentage: this.roundPercentage((repositoryCount / total) * 100),
      }))
      .sort((a, b) => b.repositoryCount - a.repositoryCount);
  }

  private getTopRepositoriesBy(
    repos: GitHubRepositoryResponseDto[],
    key: "stars" | "forks",
    limit = 5,
  ): RepositoryRankItemDto[] {
    return repos
      .slice()
      .sort((a, b) => b[key] - a[key])
      .slice(0, limit)
      .map((repo) => this.mapToRepositoryRankItem(repo));
  }

  async getUserSummary(
    username: string,
  ): Promise<UserAnalyticsSummaryResponseDto> {
    const repos = await this.loadAllUserRepositories(username);

    const totalRepositories = repos.length;
    const totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks, 0);
    const totalOpenIssues = repos.reduce(
      (sum, repo) => sum + repo.openIssues,
      0,
    );
    const averageStarsPerRepository =
      totalRepositories > 0
        ? Number((totalStars / totalRepositories).toFixed(2))
        : 0;

    return {
      username,
      totalRepositories,
      totalStars,
      totalForks,
      totalOpenIssues,
      averageStarsPerRepository,
      topRepositoriesByStars: this.getTopRepositoriesBy(repos, "stars"),
      topRepositoriesByForks: this.getTopRepositoriesBy(repos, "forks"),
      languages:
        totalRepositories > 0 ? this.calculateLanguageDistribution(repos) : [],
    };
  }

  async getUserLanguages(
    username: string,
  ): Promise<LanguageDistributionItemDto[]> {
    const repos = await this.loadAllUserRepositories(username);

    return repos.length > 0 ? this.calculateLanguageDistribution(repos) : [];
  }
}
