import { ApiProperty } from "@nestjs/swagger";
import { GitHubRepositoryResponseDto } from "./github-repository-response.dto";

export class GitHubRepositoryDetailsResponseDto extends GitHubRepositoryResponseDto {
  @ApiProperty()
  cloneUrl: string;

  @ApiProperty()
  sshUrl: string;

  @ApiProperty({ nullable: true })
  homepage: string | null;

  @ApiProperty({ nullable: true })
  licenseName: string | null;

  @ApiProperty({ type: [String] })
  topics: string[];
}
