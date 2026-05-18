import { ApiProperty } from "@nestjs/swagger";
import { RepositoryRankItemDto } from "./repository-rank-item.dto";
import { LanguageDistributionItemDto } from "./language-distribution-item.dto";

export class UserAnalyticsSummaryResponseDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  totalRepositories: number;

  @ApiProperty()
  totalStars: number;

  @ApiProperty()
  totalForks: number;

  @ApiProperty()
  totalOpenIssues: number;

  @ApiProperty()
  averageStarsPerRepository: number;

  @ApiProperty({ type: [RepositoryRankItemDto] })
  topRepositoriesByStars: RepositoryRankItemDto[];

  @ApiProperty({ type: [RepositoryRankItemDto] })
  topRepositoriesByForks: RepositoryRankItemDto[];

  @ApiProperty({ type: [LanguageDistributionItemDto] })
  languages: LanguageDistributionItemDto[];
}
