import { ApiProperty } from "@nestjs/swagger";
import { SearchHistoryType } from "@prisma/client";

export class SearchHistoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  query: string;

  @ApiProperty({ enum: SearchHistoryType })
  type: SearchHistoryType;

  @ApiProperty()
  createdAt: string;
}
