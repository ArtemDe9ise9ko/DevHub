import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { LogoutResponseDto } from "./dto/logout-response.dto";
import { TokenResponseDto } from "./dto/token-response.dto";
import { UserResponseDto } from "../users/dto/user-response.dto";
import { AuthenticatedUser } from "./types/authenticated-user.type";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Log in with email and password" })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access and refresh tokens" })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.authService.refreshToken(dto);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Log out and invalidate refresh token" })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RefreshTokenDto,
  ): Promise<LogoutResponseDto> {
    return this.authService.logout(user.id, dto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "Get current authenticated user" })
  @ApiResponse({ status: 200, type: UserResponseDto })
  async me(@CurrentUser() user: AuthenticatedUser): Promise<UserResponseDto> {
    return this.authService.getCurrentUser(user.id);
  }
}
