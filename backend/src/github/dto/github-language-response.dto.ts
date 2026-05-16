import { ApiProperty } from "@nestjs/swagger";

export class GitHubLanguageItemDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  bytes: number;

  @ApiProperty()
  percentage: number;
}

export class GitHubLanguageResponseDto {
  @ApiProperty({ type: Object })
  languages: Record<string, number>;

  @ApiProperty()
  totalBytes: number;

  @ApiProperty({ type: [GitHubLanguageItemDto] })
  items: GitHubLanguageItemDto[];
}
