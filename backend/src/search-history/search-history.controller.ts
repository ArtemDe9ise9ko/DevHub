import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { AuthenticatedUser } from "../auth/types/authenticated-user.type";
import { CreateSearchHistoryDto } from "./dto/create-search-history.dto";
import { SearchHistoryService } from "./search-history.service";
import { SearchHistoryResponseDto } from "./dto/search-history-response.dto";
import { SearchHistoryQueryDto } from "./dto/search-history-query.dto";
import { ClearSearchHistoryResponseDto } from "./dto/clear-search-history-response.dto";

@ApiTags("search-history")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("search-history")
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) {}

  @Post()
  @ApiOperation({ summary: "Add a search history item for the current user" })
  @ApiBody({ type: CreateSearchHistoryDto })
  @ApiResponse({ status: 201, type: SearchHistoryResponseDto })
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() input: CreateSearchHistoryDto,
  ): Promise<SearchHistoryResponseDto> {
    return this.searchHistoryService.create(user.id, input);
  }

  @Get()
  @ApiOperation({ summary: "List the current user's search history" })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of history items to return",
    example: 20,
  })
  @ApiResponse({ status: 200, type: SearchHistoryResponseDto, isArray: true })
  async findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: SearchHistoryQueryDto,
  ): Promise<SearchHistoryResponseDto[]> {
    return this.searchHistoryService.findAll(user.id, query.limit);
  }

  @Delete()
  @ApiOperation({ summary: "Clear the current user's search history" })
  @ApiResponse({ status: 200, type: ClearSearchHistoryResponseDto })
  async clear(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ClearSearchHistoryResponseDto> {
    return this.searchHistoryService.clear(user.id);
  }
}
