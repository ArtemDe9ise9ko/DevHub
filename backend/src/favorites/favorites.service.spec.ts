import { ConflictException, NotFoundException } from "@nestjs/common";
import { FavoritesService } from "./favorites.service";

describe("FavoritesService", () => {
  let service: FavoritesService;
  const prismaService = {
    favoriteRepository: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new FavoritesService(prismaService as any);
  });

  it("creates a favorite for the current user", async () => {
    prismaService.favoriteRepository.findFirst.mockResolvedValue(null);
    prismaService.favoriteRepository.create.mockResolvedValue({
      id: "fav-1",
      githubId: 123,
      name: "DevHub",
      fullName: "octocat/DevHub",
      description: "Repository description",
      language: "TypeScript",
      stars: 5,
      forks: 2,
      openIssues: 1,
      url: "https://github.com/octocat/DevHub",
      owner: "octocat",
      ownerAvatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      createdAt: new Date("2026-05-17T12:00:00.000Z"),
    });

    const result = await service.addFavorite("user-id", {
      repositoryId: 123,
      name: "DevHub",
      fullName: "octocat/DevHub",
      description: "Repository description",
      language: "TypeScript",
      stars: 5,
      forks: 2,
      openIssues: 1,
      repositoryUrl: "https://github.com/octocat/DevHub",
      ownerUsername: "octocat",
      ownerAvatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
    });

    expect(result).toEqual({
      id: "fav-1",
      repositoryId: 123,
      name: "DevHub",
      fullName: "octocat/DevHub",
      description: "Repository description",
      language: "TypeScript",
      stars: 5,
      forks: 2,
      openIssues: 1,
      repositoryUrl: "https://github.com/octocat/DevHub",
      ownerUsername: "octocat",
      ownerAvatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      createdAt: "2026-05-17T12:00:00.000Z",
    });
    expect(prismaService.favoriteRepository.create).toHaveBeenCalledWith({
      data: {
        userId: "user-id",
        githubId: 123,
        owner: "octocat",
        name: "DevHub",
        fullName: "octocat/DevHub",
        description: "Repository description",
        language: "TypeScript",
        stars: 5,
        forks: 2,
        openIssues: 1,
        url: "https://github.com/octocat/DevHub",
        ownerAvatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
      },
    });
  });

  it("throws ConflictException if duplicate favorite exists", async () => {
    prismaService.favoriteRepository.findFirst.mockResolvedValue({
      id: "fav-1",
    });

    await expect(
      service.addFavorite("user-id", {
        repositoryId: 123,
        name: "DevHub",
        fullName: "octocat/DevHub",
        description: null,
        language: null,
        stars: 5,
        forks: 2,
        openIssues: 1,
        repositoryUrl: "https://github.com/octocat/DevHub",
        ownerUsername: "octocat",
        ownerAvatarUrl: null,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("returns favorites sorted by createdAt desc for current user", async () => {
    prismaService.favoriteRepository.findMany.mockResolvedValue([
      {
        id: "fav-2",
        githubId: 124,
        name: "AnotherRepo",
        fullName: "octocat/AnotherRepo",
        description: null,
        language: null,
        stars: 1,
        forks: 0,
        openIssues: 0,
        url: "https://github.com/octocat/AnotherRepo",
        owner: "octocat",
        ownerAvatarUrl: null,
        createdAt: new Date("2026-05-17T13:00:00.000Z"),
      },
      {
        id: "fav-1",
        githubId: 123,
        name: "DevHub",
        fullName: "octocat/DevHub",
        description: "Repository description",
        language: "TypeScript",
        stars: 5,
        forks: 2,
        openIssues: 1,
        url: "https://github.com/octocat/DevHub",
        owner: "octocat",
        ownerAvatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
        createdAt: new Date("2026-05-17T12:00:00.000Z"),
      },
    ]);

    const result = await service.findAll("user-id");

    expect(result).toEqual([
      {
        id: "fav-2",
        repositoryId: 124,
        name: "AnotherRepo",
        fullName: "octocat/AnotherRepo",
        description: null,
        language: null,
        stars: 1,
        forks: 0,
        openIssues: 0,
        repositoryUrl: "https://github.com/octocat/AnotherRepo",
        ownerUsername: "octocat",
        ownerAvatarUrl: null,
        createdAt: "2026-05-17T13:00:00.000Z",
      },
      {
        id: "fav-1",
        repositoryId: 123,
        name: "DevHub",
        fullName: "octocat/DevHub",
        description: "Repository description",
        language: "TypeScript",
        stars: 5,
        forks: 2,
        openIssues: 1,
        repositoryUrl: "https://github.com/octocat/DevHub",
        ownerUsername: "octocat",
        ownerAvatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
        createdAt: "2026-05-17T12:00:00.000Z",
      },
    ]);
    expect(prismaService.favoriteRepository.findMany).toHaveBeenCalledWith({
      where: { userId: "user-id" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("removes a favorite for the current user", async () => {
    prismaService.favoriteRepository.deleteMany.mockResolvedValue({ count: 1 });

    const result = await service.removeFavorite("user-id", "fav-1");

    expect(result).toEqual({ message: "Repository removed from favorites" });
    expect(prismaService.favoriteRepository.deleteMany).toHaveBeenCalledWith({
      where: { id: "fav-1", userId: "user-id" },
    });
  });

  it("throws NotFoundException when removing a non-existing favorite for the current user", async () => {
    prismaService.favoriteRepository.deleteMany.mockResolvedValue({ count: 0 });

    await expect(
      service.removeFavorite("user-id", "missing-id"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
