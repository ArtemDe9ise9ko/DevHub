import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { AnalyticsService } from "./analytics.service";
import { UserAnalyticsSummaryResponseDto } from "./dto/user-analytics-summary-response.dto";
import { LanguageDistributionItemDto } from "./dto/language-distribution-item.dto";

@ApiTags("analytics")
@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("users/:username/summary")
  @ApiOperation({ summary: "Get aggregated analytics for a GitHub user" })
  @ApiParam({ name: "username", description: "GitHub username" })
  @ApiResponse({ status: 200, type: UserAnalyticsSummaryResponseDto })
  async getUserSummary(
    @Param("username") username: string,
  ): Promise<UserAnalyticsSummaryResponseDto> {
    return this.analyticsService.getUserSummary(username);
  }

  @Get("users/:username/languages")
  @ApiOperation({ summary: "Get language distribution for a GitHub user" })
  @ApiParam({ name: "username", description: "GitHub username" })
  @ApiResponse({
    status: 200,
    type: LanguageDistributionItemDto,
    isArray: true,
  })
  async getUserLanguages(
    @Param("username") username: string,
  ): Promise<LanguageDistributionItemDto[]> {
    return this.analyticsService.getUserLanguages(username);
  }
}
