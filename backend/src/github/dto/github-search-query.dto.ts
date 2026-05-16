import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export enum GitHubRepositorySort {
  created = "created",
  updated = "updated",
  pushed = "pushed",
  full_name = "full_name",
}

export enum GitHubRepositoryDirection {
  asc = "asc",
  desc = "desc",
}

export class GitHubSearchQueryDto {
  @ApiPropertyOptional({ type: Number, minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ type: Number, minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  perPage = 10;

  @ApiPropertyOptional({
    enum: GitHubRepositorySort,
    default: GitHubRepositorySort.updated,
  })
  @IsOptional()
  @IsEnum(GitHubRepositorySort)
  sort: GitHubRepositorySort = GitHubRepositorySort.updated;

  @ApiPropertyOptional({
    enum: GitHubRepositoryDirection,
    default: GitHubRepositoryDirection.desc,
  })
  @IsOptional()
  @IsEnum(GitHubRepositoryDirection)
  direction: GitHubRepositoryDirection = GitHubRepositoryDirection.desc;
}
