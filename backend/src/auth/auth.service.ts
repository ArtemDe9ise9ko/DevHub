import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { LogoutResponseDto } from "./dto/logout-response.dto";
import { TokenResponseDto } from "./dto/token-response.dto";
import { UserResponseDto } from "../users/dto/user-response.dto";
import { RefreshTokenPayload } from "./types/refresh-token-payload.type";
import { JwtPayload } from "./types/jwt-payload.type";
import { RefreshToken, User } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const existingUser = await this.usersService.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new ConflictException("Email is already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, this.getSaltRounds());

    const user = await this.usersService.createUser(
      normalizedEmail,
      passwordHash,
    );
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);
    const passwordIsValid =
      user && (await bcrypt.compare(dto.password, user.passwordHash));

    if (!user || !passwordIsValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return this.buildAuthResponse(user);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<TokenResponseDto> {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.usersService.findById(payload.sub);

    if (!user || !payload.jti) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const oldToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        jti: payload.jti,
        expiresAt: { gt: new Date() },
      },
    });

    if (
      !oldToken ||
      !(await bcrypt.compare(dto.refreshToken, oldToken.tokenHash))
    ) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    await this.prisma.refreshToken.delete({ where: { id: oldToken.id } });

    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(
      user.id,
      tokens.refreshToken,
      tokens.refreshTokenJti,
    );
    return tokens;
  }

  async logout(
    userId: string,
    dto: RefreshTokenDto,
  ): Promise<LogoutResponseDto> {
    let payload: RefreshTokenPayload;

    try {
      payload = await this.verifyRefreshToken(dto.refreshToken);
    } catch {
      return { success: true };
    }

    if (payload.sub !== userId || !payload.jti) {
      return { success: true };
    }

    const token = await this.prisma.refreshToken.findFirst({
      where: {
        userId,
        jti: payload.jti,
        expiresAt: { gt: new Date() },
      },
    });

    if (token && (await bcrypt.compare(dto.refreshToken, token.tokenHash))) {
      await this.prisma.refreshToken.delete({ where: { id: token.id } });
    }

    return {
      success: true,
    };
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  private async buildAuthResponse(user: User): Promise<AuthResponseDto> {
    const tokens = await this.generateTokens(user);
    await this.storeRefreshToken(
      user.id,
      tokens.refreshToken,
      tokens.refreshTokenJti,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private async generateTokens(
    user: User,
  ): Promise<TokenResponseDto & { refreshTokenJti: string }> {
    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const accessPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: "access",
      jti: accessJti,
    };

    const refreshPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: "refresh",
      jti: refreshJti,
    };

    const accessOptions: JwtSignOptions = {
      secret: this.configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
      expiresIn: this.configService.getOrThrow<string>(
        "JWT_ACCESS_EXPIRES_IN",
      ) as JwtSignOptions["expiresIn"],
    };

    const refreshOptions: JwtSignOptions = {
      secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
      expiresIn: this.configService.getOrThrow<string>(
        "JWT_REFRESH_EXPIRES_IN",
      ) as JwtSignOptions["expiresIn"],
    };

    const accessToken = await this.jwtService.signAsync(
      accessPayload,
      accessOptions,
    );
    const refreshToken = await this.jwtService.signAsync(
      refreshPayload,
      refreshOptions,
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenJti: refreshJti,
    };
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
    jti: string,
  ) {
    const tokenHash = await bcrypt.hash(refreshToken, this.getSaltRounds());

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        jti,
        expiresAt: this.getRefreshTokenExpiry(),
      },
    });
  }

  private async verifyRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenPayload> {
    let payload: RefreshTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
        },
      );
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }

    if (payload.type !== "refresh") {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return payload;
  }

  private async findStoredRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken | null> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });

    for (const token of tokens) {
      if (await bcrypt.compare(refreshToken, token.tokenHash)) {
        return token;
      }
    }

    return null;
  }

  private getSaltRounds(): number {
    return Number(this.configService.getOrThrow<string>("BCRYPT_SALT_ROUNDS"));
  }

  private getRefreshTokenExpiry(): Date {
    const expiresIn =
      this.configService.get<string>("JWT_REFRESH_EXPIRES_IN") ?? "7d";
    const amount = parseInt(expiresIn, 10);
    const expiresAt = new Date();

    if (expiresIn.endsWith("d")) {
      expiresAt.setDate(expiresAt.getDate() + amount);
    } else if (expiresIn.endsWith("h")) {
      expiresAt.setHours(expiresAt.getHours() + amount);
    } else if (expiresIn.endsWith("m")) {
      expiresAt.setMinutes(expiresAt.getMinutes() + amount);
    } else {
      expiresAt.setDate(expiresAt.getDate() + amount);
    }

    return expiresAt;
  }
}
