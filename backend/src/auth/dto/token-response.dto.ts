import { ApiProperty } from "@nestjs/swagger";

export class TokenResponseDto {
  @ApiProperty({ example: "access.token.value" })
  readonly accessToken: string;

  @ApiProperty({ example: "refresh.token.value" })
  readonly refreshToken: string;
}
