import {
  GitHubRepositorySort,
  GitHubRepositoryDirection,
} from "../github/dto/github-search-query.dto";
import { AnalyticsService } from "./analytics.service";

describe("AnalyticsService", () => {
  let service: AnalyticsService;
  const githubService = {
    getUserRepositories: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AnalyticsService(githubService as any);
  });

  it("calculates totals and averages correctly", async () => {
    githubService.getUserRepositories.mockResolvedValue([
      {
        name: "a",
        fullName: "u/a",
        stars: 10,
        forks: 1,
        openIssues: 2,
        language: "TypeScript",
        repositoryUrl: "url",
      },
      {
        name: "b",
        fullName: "u/b",
        stars: 5,
        forks: 2,
        openIssues: 1,
        language: "JavaScript",
        repositoryUrl: "url",
      },
    ]);

    const summary = await service.getUserSummary("u");

    expect(summary.totalRepositories).toBe(2);
    expect(summary.totalStars).toBe(15);
    expect(summary.totalForks).toBe(3);
    expect(summary.totalOpenIssues).toBe(3);
    expect(summary.averageStarsPerRepository).toBe(7.5);
  });

  it("returns top repositories sorted and limited", async () => {
    githubService.getUserRepositories.mockResolvedValue([
      {
        name: "a",
        fullName: "u/a",
        stars: 100,
        forks: 1,
        openIssues: 0,
        language: "TS",
        repositoryUrl: "url",
      },
      {
        name: "b",
        fullName: "u/b",
        stars: 50,
        forks: 20,
        openIssues: 0,
        language: "JS",
        repositoryUrl: "url",
      },
      {
        name: "c",
        fullName: "u/c",
        stars: 10,
        forks: 30,
        openIssues: 0,
        language: "Go",
        repositoryUrl: "url",
      },
    ]);

    const summary = await service.getUserSummary("u");

    expect(summary.topRepositoriesByStars[0].fullName).toBe("u/a");
    expect(summary.topRepositoriesByForks[0].fullName).toBe("u/c");
  });

  it("loads multiple pages of repositories", async () => {
    const firstPage = Array.from({ length: 100 }, (_, index) => ({
      name: `repo-${index + 1}`,
      fullName: `u/repo-${index + 1}`,
      stars: index + 1,
      forks: index,
      openIssues: 0,
      language: "TypeScript",
      repositoryUrl: "url",
    }));
    const secondPage = [
      {
        name: "repo-101",
        fullName: "u/repo-101",
        stars: 101,
        forks: 10,
        openIssues: 0,
        language: "JavaScript",
        repositoryUrl: "url",
      },
    ];

    githubService.getUserRepositories.mockImplementation(
      async (_username, query) => {
        if (query.page === 1) return firstPage;
        return secondPage;
      },
    );

    const summary = await service.getUserSummary("u");

    expect(summary.totalRepositories).toBe(101);
    expect(summary.topRepositoriesByStars[0].fullName).toBe("u/repo-101");
    expect(githubService.getUserRepositories).toHaveBeenCalledTimes(2);
    expect(githubService.getUserRepositories).toHaveBeenCalledWith("u", {
      page: 1,
      perPage: 100,
      sort: GitHubRepositorySort.updated,
      direction: GitHubRepositoryDirection.desc,
    });
  });

  it("calculates language distribution and percentages", async () => {
    githubService.getUserRepositories.mockResolvedValue([
      {
        name: "a",
        fullName: "u/a",
        stars: 1,
        forks: 0,
        openIssues: 0,
        language: "TypeScript",
        repositoryUrl: "url",
      },
      {
        name: "b",
        fullName: "u/b",
        stars: 1,
        forks: 0,
        openIssues: 0,
        language: "TypeScript",
        repositoryUrl: "url",
      },
      {
        name: "c",
        fullName: "u/c",
        stars: 1,
        forks: 0,
        openIssues: 0,
        language: null,
        repositoryUrl: "url",
      },
    ]);

    const languages = await service.getUserLanguages("u");

    expect(languages[0].language).toBe("TypeScript");
    expect(languages.find((l) => l.language === "Unknown")).toBeDefined();
    const ts = languages.find((l) => l.language === "TypeScript");
    expect(ts.repositoryCount).toBe(2);
    expect(ts.percentage).toBe(66.67);
  });

  it("handles empty repository list", async () => {
    githubService.getUserRepositories.mockResolvedValue([]);

    const summary = await service.getUserSummary("u");
    expect(summary.totalRepositories).toBe(0);
    expect(summary.averageStarsPerRepository).toBe(0);
    expect(summary.topRepositoriesByStars).toEqual([]);
    expect(summary.languages).toEqual([]);
  });
});
