import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class FavoriteRepositoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  repositoryId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ nullable: true })
  language: string | null;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  forks: number;

  @ApiProperty()
  openIssues: number;

  @ApiProperty()
  repositoryUrl: string;

  @ApiProperty()
  ownerUsername: string;

  @ApiPropertyOptional({ nullable: true })
  ownerAvatarUrl?: string | null;

  @ApiProperty()
  createdAt: string;
}
