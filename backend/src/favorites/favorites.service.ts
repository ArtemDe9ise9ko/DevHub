import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FavoriteRepository } from "@prisma/client";
import { AddFavoriteRepositoryDto } from "./dto/add-favorite-repository.dto";
import { FavoriteRepositoryResponseDto } from "./dto/favorite-repository-response.dto";

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  private mapToResponse(
    favorite: FavoriteRepository,
  ): FavoriteRepositoryResponseDto {
    return {
      id: favorite.id,
      repositoryId: favorite.githubId,
      name: favorite.name,
      fullName: favorite.fullName,
      description: favorite.description,
      language: favorite.language,
      stars: favorite.stars,
      forks: favorite.forks,
      openIssues: favorite.openIssues,
      repositoryUrl: favorite.url,
      ownerUsername: favorite.owner,
      ownerAvatarUrl: favorite.ownerAvatarUrl,
      createdAt: favorite.createdAt.toISOString(),
    };
  }

  async addFavorite(
    userId: string,
    input: AddFavoriteRepositoryDto,
  ): Promise<FavoriteRepositoryResponseDto> {
    const existing = await this.prisma.favoriteRepository.findFirst({
      where: {
        userId,
        fullName: input.fullName,
      },
    });

    if (existing) {
      throw new ConflictException("Repository is already in favorites");
    }

    const favorite = await this.prisma.favoriteRepository.create({
      data: {
        userId,
        githubId: input.repositoryId,
        owner: input.ownerUsername,
        name: input.name,
        fullName: input.fullName,
        description: input.description,
        language: input.language,
        stars: input.stars,
        forks: input.forks,
        openIssues: input.openIssues,
        url: input.repositoryUrl,
        ownerAvatarUrl: input.ownerAvatarUrl,
      },
    });

    return this.mapToResponse(favorite);
  }

  async findAll(userId: string): Promise<FavoriteRepositoryResponseDto[]> {
    const favorites = await this.prisma.favoriteRepository.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return favorites.map((favorite) => this.mapToResponse(favorite));
  }

  async removeFavorite(
    userId: string,
    id: string,
  ): Promise<{ message: string }> {
    const deleted = await this.prisma.favoriteRepository.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      throw new NotFoundException("Favorite repository not found");
    }

    return { message: "Repository removed from favorites" };
  }
}
