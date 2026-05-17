import { BadRequestException } from "@nestjs/common";
import { SearchHistoryType } from "@prisma/client";
import { SearchHistoryService } from "./search-history.service";

describe("SearchHistoryService", () => {
  let service: SearchHistoryService;
  const prismaService = {
    searchHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SearchHistoryService(prismaService as any);
  });

  it("creates a search history item for the current user", async () => {
    prismaService.searchHistory.create.mockResolvedValue({
      id: "item-1",
      userId: "user-id",
      query: "octocat",
      type: SearchHistoryType.USER,
      createdAt: new Date("2026-05-17T12:00:00.000Z"),
    });

    const result = await service.create("user-id", {
      query: "octocat",
      type: SearchHistoryType.USER,
    });

    expect(result).toEqual({
      id: "item-1",
      query: "octocat",
      type: SearchHistoryType.USER,
      createdAt: "2026-05-17T12:00:00.000Z",
    });
    expect(prismaService.searchHistory.create).toHaveBeenCalledWith({
      data: {
        userId: "user-id",
        query: "octocat",
        type: SearchHistoryType.USER,
      },
    });
  });

  it("trims the query before saving", async () => {
    prismaService.searchHistory.create.mockResolvedValue({
      id: "item-2",
      userId: "user-id",
      query: "octocat",
      type: SearchHistoryType.REPOSITORY,
      createdAt: new Date("2026-05-17T12:00:00.000Z"),
    });

    await service.create("user-id", {
      query: "  octocat  ",
      type: SearchHistoryType.REPOSITORY,
    });

    expect(prismaService.searchHistory.create).toHaveBeenCalledWith({
      data: {
        userId: "user-id",
        query: "octocat",
        type: SearchHistoryType.REPOSITORY,
      },
    });
  });

  it("throws BadRequestException for empty trimmed query", async () => {
    await expect(
      service.create("user-id", { query: "   ", type: SearchHistoryType.USER }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("finds all history for current user with default limit", async () => {
    prismaService.searchHistory.findMany.mockResolvedValue([
      {
        id: "item-2",
        userId: "user-id",
        query: "repo",
        type: SearchHistoryType.REPOSITORY,
        createdAt: new Date("2026-05-17T13:00:00.000Z"),
      },
      {
        id: "item-1",
        userId: "user-id",
        query: "octocat",
        type: SearchHistoryType.USER,
        createdAt: new Date("2026-05-17T12:00:00.000Z"),
      },
    ]);

    const result = await service.findAll("user-id");

    expect(result).toEqual([
      {
        id: "item-2",
        query: "repo",
        type: SearchHistoryType.REPOSITORY,
        createdAt: "2026-05-17T13:00:00.000Z",
      },
      {
        id: "item-1",
        query: "octocat",
        type: SearchHistoryType.USER,
        createdAt: "2026-05-17T12:00:00.000Z",
      },
    ]);
    expect(prismaService.searchHistory.findMany).toHaveBeenCalledWith({
      where: { userId: "user-id" },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  });

  it("finds history with custom limit", async () => {
    prismaService.searchHistory.findMany.mockResolvedValue([]);

    await service.findAll("user-id", 10);

    expect(prismaService.searchHistory.findMany).toHaveBeenCalledWith({
      where: { userId: "user-id" },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  });

  it("clears current user's history and returns a message", async () => {
    prismaService.searchHistory.deleteMany.mockResolvedValue({ count: 3 });

    const result = await service.clear("user-id");

    expect(result).toEqual({ message: "Search history cleared" });
    expect(prismaService.searchHistory.deleteMany).toHaveBeenCalledWith({
      where: { userId: "user-id" },
    });
  });
});
