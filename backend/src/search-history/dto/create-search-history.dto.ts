import { ApiProperty } from "@nestjs/swagger";
import { SearchHistoryType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateSearchHistoryDto {
  @ApiProperty()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiProperty({ enum: SearchHistoryType })
  @IsEnum(SearchHistoryType)
  type: SearchHistoryType;
}
