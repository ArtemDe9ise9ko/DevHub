import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class AddFavoriteRepositoryDto {
  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  repositoryId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  language?: string | null;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stars: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  forks: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  openIssues: number;

  @ApiProperty()
  @IsString()
  @IsUrl()
  repositoryUrl: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ownerUsername: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @IsUrl()
  ownerAvatarUrl?: string | null;
}
