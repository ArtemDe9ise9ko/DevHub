import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { FavoritesService } from "./favorites.service";
import { AddFavoriteRepositoryDto } from "./dto/add-favorite-repository.dto";
import { FavoriteRepositoryResponseDto } from "./dto/favorite-repository-response.dto";

@ApiTags("favorites")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("favorites")
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post("/repositories")
  @ApiOperation({ summary: "Add a repository to the current user's favorites" })
  @ApiBody({ type: AddFavoriteRepositoryDto })
  @ApiResponse({ status: 201, type: FavoriteRepositoryResponseDto })
  async addFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Body() input: AddFavoriteRepositoryDto,
  ): Promise<FavoriteRepositoryResponseDto> {
    return this.favoritesService.addFavorite(user.id, input);
  }

  @Get("/repositories")
  @ApiOperation({ summary: "List favorite repositories for the current user" })
  @ApiResponse({
    status: 200,
    type: FavoriteRepositoryResponseDto,
    isArray: true,
  })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<FavoriteRepositoryResponseDto[]> {
    return this.favoritesService.findAll(user.id);
  }

  @Delete("/repositories/:id")
  @ApiOperation({
    summary: "Remove a repository from the current user's favorites",
  })
  @ApiParam({ name: "id", description: "Favorite repository id" })
  @ApiResponse({
    status: 200,
    description: "Repository removed from favorites",
  })
  async remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<{ message: string }> {
    return this.favoritesService.removeFavorite(user.id, id);
  }
}
