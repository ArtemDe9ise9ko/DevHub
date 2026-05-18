import { ApiProperty } from "@nestjs/swagger";

export class LanguageDistributionItemDto {
  @ApiProperty()
  language: string;

  @ApiProperty()
  repositoryCount: number;

  @ApiProperty()
  percentage: number;
}
