import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({ example: "5f9af3e2-3d4b-4d8a-b4f5-cb0d15d0c6b5" })
  readonly id: string;

  @ApiProperty({ example: "user@example.com" })
  readonly email: string;

  @ApiProperty({ example: "2026-05-17T12:00:00.000Z" })
  readonly createdAt: Date;
}
