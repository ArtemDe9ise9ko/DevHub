import { Controller, Get, Param, Query } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";
import { GitHubService } from "./github.service";
import { GitHubUserResponseDto } from "./dto/github-user-response.dto";
import { GitHubSearchQueryDto } from "./dto/github-search-query.dto";
import { GitHubRepositoryResponseDto } from "./dto/github-repository-response.dto";
import { GitHubRepositoryDetailsResponseDto } from "./dto/github-repository-details-response.dto";
import { GitHubLanguageResponseDto } from "./dto/github-language-response.dto";

@ApiTags("github")
@Controller("github")
export class GitHubController {
  constructor(private readonly githubService: GitHubService) {}

  @Get("users/:username")
  @ApiOperation({ summary: "Fetch a GitHub user profile by username" })
  @ApiParam({ name: "username", description: "GitHub username" })
  @ApiResponse({ status: 200, type: GitHubUserResponseDto })
  async getUser(
    @Param("username") username: string,
  ): Promise<GitHubUserResponseDto> {
    return this.githubService.getUser(username);
  }

  @Get("users/:username/repositories")
  @ApiOperation({ summary: "Fetch a GitHub user's repositories" })
  @ApiParam({ name: "username", description: "GitHub username" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number",
    example: 1,
  })
  @ApiQuery({
    name: "perPage",
    required: false,
    type: Number,
    description: "Number of items per page",
    example: 10,
  })
  @ApiQuery({
    name: "sort",
    required: false,
    type: String,
    description: "Repository sort field",
    example: "updated",
  })
  @ApiQuery({
    name: "direction",
    required: false,
    type: String,
    description: "Sort direction",
    example: "desc",
  })
  @ApiResponse({
    status: 200,
    type: GitHubRepositoryResponseDto,
    isArray: true,
  })
  async getUserRepositories(
    @Param("username") username: string,
    @Query() query: GitHubSearchQueryDto,
  ): Promise<GitHubRepositoryResponseDto[]> {
    return this.githubService.getUserRepositories(username, query);
  }

  @Get("repositories/:owner/:repo")
  @ApiOperation({ summary: "Fetch GitHub repository details" })
  @ApiParam({ name: "owner", description: "Repository owner username" })
  @ApiParam({ name: "repo", description: "Repository name" })
  @ApiResponse({
    status: 200,
    type: GitHubRepositoryDetailsResponseDto,
  })
  async getRepositoryDetails(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
  ): Promise<GitHubRepositoryDetailsResponseDto> {
    return this.githubService.getRepositoryDetails(owner, repo);
  }

  @Get("repositories/:owner/:repo/languages")
  @ApiOperation({ summary: "Fetch GitHub repository language distribution" })
  @ApiParam({ name: "owner", description: "Repository owner username" })
  @ApiParam({ name: "repo", description: "Repository name" })
  @ApiResponse({
    status: 200,
    type: GitHubLanguageResponseDto,
  })
  async getRepositoryLanguages(
    @Param("owner") owner: string,
    @Param("repo") repo: string,
  ): Promise<GitHubLanguageResponseDto> {
    return this.githubService.getRepositoryLanguages(owner, repo);
  }
}
