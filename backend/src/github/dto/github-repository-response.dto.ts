import { ApiProperty } from "@nestjs/swagger";

export class GitHubRepositoryResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  private: boolean;

  @ApiProperty()
  fork: boolean;

  @ApiProperty({ nullable: true })
  language: string | null;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  forks: number;

  @ApiProperty()
  openIssues: number;

  @ApiProperty()
  watchers: number;

  @ApiProperty()
  defaultBranch: string;

  @ApiProperty()
  repositoryUrl: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  pushedAt: string;

  @ApiProperty()
  ownerUsername: string;

  @ApiProperty()
  ownerAvatarUrl: string;
}
