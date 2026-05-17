import { ApiProperty } from "@nestjs/swagger";

export class ClearSearchHistoryResponseDto {
  @ApiProperty()
  message: string;
}
