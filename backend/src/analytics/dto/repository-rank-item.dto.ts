import { ApiProperty } from "@nestjs/swagger";

export class RepositoryRankItemDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  forks: number;

  @ApiProperty()
  openIssues: number;

  @ApiProperty({ nullable: true })
  language: string | null;

  @ApiProperty()
  url: string;
}
