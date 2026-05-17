import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SearchHistory } from "@prisma/client";
import { CreateSearchHistoryDto } from "./dto/create-search-history.dto";
import { SearchHistoryResponseDto } from "./dto/search-history-response.dto";

@Injectable()
export class SearchHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToResponse(history: SearchHistory): SearchHistoryResponseDto {
    return {
      id: history.id,
      query: history.query,
      type: history.type,
      createdAt: history.createdAt.toISOString(),
    };
  }

  async create(
    userId: string,
    input: CreateSearchHistoryDto,
  ): Promise<SearchHistoryResponseDto> {
    const query = input.query.trim();

    if (!query) {
      throw new BadRequestException("Search query must not be empty");
    }

    const history = await this.prisma.searchHistory.create({
      data: {
        userId,
        query,
        type: input.type,
      },
    });

    return this.mapToResponse(history);
  }

  async findAll(
    userId: string,
    limit = 20,
  ): Promise<SearchHistoryResponseDto[]> {
    const items = await this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return items.map((history) => this.mapToResponse(history));
  }

  async clear(userId: string): Promise<{ message: string }> {
    await this.prisma.searchHistory.deleteMany({
      where: { userId },
    });

    return { message: "Search history cleared" };
  }
}
