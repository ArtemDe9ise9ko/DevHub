import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "../../users/dto/user-response.dto";

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  readonly user: UserResponseDto;

  @ApiProperty({ example: "access.token.value" })
  readonly accessToken: string;

  @ApiProperty({ example: "refresh.token.value" })
  readonly refreshToken: string;
}
