import { ApiProperty } from "@nestjs/swagger";

export class GitHubUserResponseDto {
  @ApiProperty()
  username: string;

  @ApiProperty({ nullable: true })
  name: string | null;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty({ nullable: true })
  bio: string | null;

  @ApiProperty({ nullable: true })
  company: string | null;

  @ApiProperty({ nullable: true })
  location: string | null;

  @ApiProperty({ nullable: true })
  blog: string | null;

  @ApiProperty({ nullable: true })
  twitterUsername: string | null;

  @ApiProperty()
  publicRepos: number;

  @ApiProperty()
  followers: number;

  @ApiProperty()
  following: number;

  @ApiProperty()
  profileUrl: string;

  @ApiProperty()
  createdAt: string;
}
