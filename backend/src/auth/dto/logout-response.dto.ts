import { ApiProperty } from "@nestjs/swagger";

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  readonly success: boolean;
}
