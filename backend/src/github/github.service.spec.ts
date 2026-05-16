import { of, throwError } from "rxjs";
import { AxiosError } from "axios";
import {
  HttpException,
  BadGatewayException,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { GitHubService } from "./github.service";
import { GitHubApiUser } from "./types/github-api-user.type";
import { GitHubApiRepository } from "./types/github-api-repository.type";

describe("GitHubService", () => {
  let service: GitHubService;
  const httpService = {
    get: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);

    service = new GitHubService(httpService as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("maps GitHub user response correctly", async () => {
    const apiUser: GitHubApiUser = {
      login: "octocat",
      name: "The Octocat",
      avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      bio: "I love GitHub",
      company: "GitHub",
      location: "San Francisco",
      blog: "https://github.blog",
      twitter_username: "octocat",
      public_repos: 8,
      followers: 4132,
      following: 9,
      html_url: "https://github.com/octocat",
      created_at: "2011-01-25T18:44:36Z",
    };

    httpService.get.mockReturnValue(of({ data: apiUser }));

    const result = await service.getUser("octocat");

    expect(result).toEqual({
      username: "octocat",
      name: "The Octocat",
      avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      bio: "I love GitHub",
      company: "GitHub",
      location: "San Francisco",
      blog: "https://github.blog",
      twitterUsername: "octocat",
      publicRepos: 8,
      followers: 4132,
      following: 9,
      profileUrl: "https://github.com/octocat",
      createdAt: "2011-01-25T18:44:36Z",
    });
    expect(httpService.get).toHaveBeenCalledWith("/users/octocat", {
      params: undefined,
    });
  });

  it("throws NotFoundException for GitHub 404", async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 404, data: {} },
      config: {},
      name: "AxiosError",
      message: "Not Found",
      toJSON: () => ({}),
    } as AxiosError;

    httpService.get.mockReturnValue(throwError(() => axiosError));

    await expect(service.getUser("missing-user")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("maps repository list correctly", async () => {
    const apiRepo: GitHubApiRepository = {
      id: 123,
      name: "devhub",
      full_name: "octocat/devhub",
      description: "Repository description",
      private: false,
      fork: false,
      language: "TypeScript",
      stargazers_count: 42,
      forks_count: 10,
      open_issues_count: 3,
      watchers_count: 100,
      default_branch: "main",
      html_url: "https://github.com/octocat/devhub",
      clone_url: "https://github.com/octocat/devhub.git",
      ssh_url: "git@github.com:octocat/devhub.git",
      homepage: "https://devhub.example.com",
      license: { name: "MIT" },
      topics: ["nestjs", "github"],
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
      pushed_at: "2024-01-03T00:00:00Z",
      owner: {
        login: "octocat",
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      },
    };

    httpService.get.mockReturnValue(of({ data: [apiRepo] }));

    const result = await service.getUserRepositories("octocat", {
      page: 1,
      perPage: 10,
      sort: "updated",
      direction: "desc",
    } as any);

    expect(result).toEqual([
      {
        id: 123,
        name: "devhub",
        fullName: "octocat/devhub",
        description: "Repository description",
        private: false,
        fork: false,
        language: "TypeScript",
        stars: 42,
        forks: 10,
        openIssues: 3,
        watchers: 100,
        defaultBranch: "main",
        repositoryUrl: "https://github.com/octocat/devhub",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
        pushedAt: "2024-01-03T00:00:00Z",
        ownerUsername: "octocat",
        ownerAvatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      },
    ]);
    expect(httpService.get).toHaveBeenCalledWith("/users/octocat/repos", {
      params: { page: 1, per_page: 10, sort: "updated", direction: "desc" },
    });
  });

  it("maps repository details correctly", async () => {
    const apiRepo: GitHubApiRepository = {
      id: 123,
      name: "devhub",
      full_name: "octocat/devhub",
      description: "Repository description",
      private: false,
      fork: false,
      language: "TypeScript",
      stargazers_count: 42,
      forks_count: 10,
      open_issues_count: 3,
      watchers_count: 100,
      default_branch: "main",
      html_url: "https://github.com/octocat/devhub",
      clone_url: "https://github.com/octocat/devhub.git",
      ssh_url: "git@github.com:octocat/devhub.git",
      homepage: "https://devhub.example.com",
      license: { name: "MIT" },
      topics: ["nestjs", "github"],
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-02T00:00:00Z",
      pushed_at: "2024-01-03T00:00:00Z",
      owner: {
        login: "octocat",
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
      },
    };

    httpService.get.mockReturnValue(of({ data: apiRepo }));

    const result = await service.getRepositoryDetails("octocat", "devhub");

    expect(result).toEqual({
      id: 123,
      name: "devhub",
      fullName: "octocat/devhub",
      description: "Repository description",
      private: false,
      fork: false,
      language: "TypeScript",
      stars: 42,
      forks: 10,
      openIssues: 3,
      watchers: 100,
      defaultBranch: "main",
      repositoryUrl: "https://github.com/octocat/devhub",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
      pushedAt: "2024-01-03T00:00:00Z",
      ownerUsername: "octocat",
      ownerAvatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      cloneUrl: "https://github.com/octocat/devhub.git",
      sshUrl: "git@github.com:octocat/devhub.git",
      homepage: "https://devhub.example.com",
      licenseName: "MIT",
      topics: ["nestjs", "github"],
    });
    expect(httpService.get).toHaveBeenCalledWith("/repos/octocat/devhub", {
      params: undefined,
    });
  });

  it("calculates language percentages correctly", async () => {
    httpService.get.mockReturnValue(
      of({ data: { TypeScript: 1200, HTML: 300 } }),
    );

    const result = await service.getRepositoryLanguages("octocat", "devhub");

    expect(result).toEqual({
      languages: { TypeScript: 1200, HTML: 300 },
      totalBytes: 1500,
      items: [
        { language: "TypeScript", bytes: 1200, percentage: 80 },
        { language: "HTML", bytes: 300, percentage: 20 },
      ],
    });
    expect(httpService.get).toHaveBeenCalledWith(
      "/repos/octocat/devhub/languages",
      { params: undefined },
    );
  });

  it("maps GitHub 403 rate limit to status 429", async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 403, data: {} },
      config: {},
      name: "AxiosError",
      message: "Forbidden",
      toJSON: () => ({}),
    } as AxiosError;

    httpService.get.mockReturnValue(throwError(() => axiosError));

    try {
      await service.getUser("rate-limit");
      fail("Expected service.getUser to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(429);
    }
  });

  it("maps other GitHub errors to BadGatewayException", async () => {
    const axiosError = {
      isAxiosError: true,
      response: { status: 500, data: {} },
      config: {},
      name: "AxiosError",
      message: "Server Error",
      toJSON: () => ({}),
    } as AxiosError;

    httpService.get.mockReturnValue(throwError(() => axiosError));

    await expect(service.getUser("error")).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});
