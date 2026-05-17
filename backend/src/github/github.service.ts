import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  Logger,
  BadGatewayException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";
import { GitHubUserResponseDto } from "./dto/github-user-response.dto";
import { GitHubSearchQueryDto } from "./dto/github-search-query.dto";
import { GitHubApiUser } from "./types/github-api-user.type";
import { GitHubRepositoryResponseDto } from "./dto/github-repository-response.dto";
import { GitHubApiRepository } from "./types/github-api-repository.type";
import { GitHubRepositoryDetailsResponseDto } from "./dto/github-repository-details-response.dto";
import { GitHubLanguageResponseDto } from "./dto/github-language-response.dto";

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);

  constructor(private readonly httpService: HttpService) {}

  private async request<T>(url: string, params?: Record<string, unknown>) {
    try {
      return await firstValueFrom(this.httpService.get<T>(url, { params }));
    } catch (error) {
      this.handleGitHubError(error, url);
    }
  }

  private handleGitHubError(error: unknown, resource: string): never {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      this.logger.error(
        `GitHub request failed for ${resource} with status ${status}`,
        error.stack,
      );

      if (status === 404) {
        throw new NotFoundException("GitHub resource not found");
      }

      if (status === 403 || status === 429) {
        throw new HttpException(
          "GitHub rate limit exceeded or access is restricted",
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }

    this.logger.error(
      `Unexpected GitHub error for ${resource}`,
      error instanceof Error ? error.stack : undefined,
    );
    throw new BadGatewayException("Unable to fetch GitHub data");
  }

  private mapUser(user: GitHubApiUser): GitHubUserResponseDto {
    return {
      username: user.login,
      name: user.name ?? null,
      avatarUrl: user.avatar_url,
      bio: user.bio ?? null,
      company: user.company ?? null,
      location: user.location ?? null,
      blog: user.blog ?? null,
      twitterUsername: user.twitter_username ?? null,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      profileUrl: user.html_url,
      createdAt: user.created_at,
    };
  }

  private mapRepository(
    repo: GitHubApiRepository,
  ): GitHubRepositoryResponseDto {
    return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description ?? null,
      private: repo.private,
      fork: repo.fork,
      language: repo.language ?? null,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      watchers: repo.watchers_count,
      defaultBranch: repo.default_branch,
      repositoryUrl: repo.html_url,
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      ownerUsername: repo.owner.login,
      ownerAvatarUrl: repo.owner.avatar_url,
    };
  }

  private mapRepositoryDetails(
    repo: GitHubApiRepository,
  ): GitHubRepositoryDetailsResponseDto {
    return {
      ...this.mapRepository(repo),
      cloneUrl: repo.clone_url,
      sshUrl: repo.ssh_url,
      homepage: repo.homepage ?? null,
      licenseName: repo.license?.name ?? null,
      topics: repo.topics ?? [],
    };
  }

  async getUser(username: string): Promise<GitHubUserResponseDto> {
    const response = await this.request<GitHubApiUser>(`/users/${username}`);
    return this.mapUser(response.data);
  }

  async getUserRepositories(
    username: string,
    query: GitHubSearchQueryDto,
  ): Promise<GitHubRepositoryResponseDto[]> {
    const response = await this.request<GitHubApiRepository[]>(
      `/users/${username}/repos`,
      {
        page: query.page,
        per_page: query.perPage,
        sort: query.sort,
        direction: query.direction,
      },
    );
    return response.data.map((repo) => this.mapRepository(repo));
  }

  async getRepositoryDetails(
    owner: string,
    repo: string,
  ): Promise<GitHubRepositoryDetailsResponseDto> {
    const response = await this.request<GitHubApiRepository>(
      `/repos/${owner}/${repo}`,
    );
    return this.mapRepositoryDetails(response.data);
  }

  async getRepositoryLanguages(
    owner: string,
    repo: string,
  ): Promise<GitHubLanguageResponseDto> {
    const response = await this.request<Record<string, number>>(
      `/repos/${owner}/${repo}/languages`,
    );

    const languages = response.data ?? {};
    const totalBytes = Object.values(languages).reduce(
      (sum, value) => sum + value,
      0,
    );
    const items = Object.entries(languages).map(([language, bytes]) => ({
      language,
      bytes,
      percentage:
        totalBytes > 0 ? Number(((bytes / totalBytes) * 100).toFixed(2)) : 0,
    }));

    return {
      languages,
      totalBytes,
      items,
    };
  }
}
