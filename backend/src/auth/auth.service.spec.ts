import { UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

type BcryptHash = (
  data: string,
  saltOrRounds: string | number,
) => Promise<string>;

type BcryptCompare = (data: string, encrypted: string) => Promise<boolean>;

describe("AuthService", () => {
  let service: AuthService;
  const usersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    createUser: jest.fn(),
  };
  const prismaService = {
    refreshToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
  };
  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };
  const configService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case "JWT_ACCESS_SECRET":
          return "access-secret";
        case "JWT_REFRESH_SECRET":
          return "refresh-secret";
        case "JWT_ACCESS_EXPIRES_IN":
          return "15m";
        case "JWT_REFRESH_EXPIRES_IN":
          return "7d";
        case "BCRYPT_SALT_ROUNDS":
          return "10";
        default:
          return undefined;
      }
    }),
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case "JWT_ACCESS_SECRET":
          return "access-secret";
        case "JWT_REFRESH_SECRET":
          return "refresh-secret";
        case "JWT_ACCESS_EXPIRES_IN":
          return "15m";
        case "JWT_REFRESH_EXPIRES_IN":
          return "7d";
        case "BCRYPT_SALT_ROUNDS":
          return "10";
        default:
          throw new Error(`Missing env ${key}`);
      }
    }),
  };

  const bcryptHashMock =
    bcrypt.hash as unknown as jest.MockedFunction<BcryptHash>;
  const bcryptCompareMock =
    bcrypt.compare as unknown as jest.MockedFunction<BcryptCompare>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(
      usersService as any,
      prismaService as any,
      jwtService as any,
      configService as any,
    );
  });

  it("registers a new user and stores a hashed refresh token", async () => {
    usersService.findByEmail.mockResolvedValue(null);
    usersService.createUser.mockResolvedValue({
      id: "user-id",
      email: "user@example.com",
      createdAt: new Date("2026-05-17T12:00:00.000Z"),
    });
    bcryptHashMock.mockResolvedValue("hashed-password");
    jwtService.signAsync
      .mockResolvedValueOnce("access-token")
      .mockResolvedValueOnce("refresh-token");
    prismaService.refreshToken.create.mockResolvedValue({});

    const response = await service.register({
      email: "user@example.com",
      password: "strongPassword123",
    });

    expect(response.user.id).toBe("user-id");
    expect(response.accessToken).toBe("access-token");
    expect(response.refreshToken).toBe("refresh-token");
    expect(prismaService.refreshToken.create).toHaveBeenCalled();
  });

  it("throws UnauthorizedException when login credentials are invalid", async () => {
    usersService.findByEmail.mockResolvedValue({
      id: "user-id",
      email: "user@example.com",
      passwordHash: "hashed-password",
    });
    bcryptCompareMock.mockResolvedValue(false);

    await expect(
      service.login({
        email: "user@example.com",
        password: "wrongPassword",
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rotates refresh tokens on refreshToken request", async () => {
    usersService.findById.mockResolvedValue({
      id: "user-id",
      email: "user@example.com",
      createdAt: new Date("2026-05-17T12:00:00.000Z"),
    });
    jwtService.verifyAsync.mockResolvedValue({
      sub: "user-id",
      email: "user@example.com",
      type: "refresh",
      jti: "old-refresh-jti",
    });
    prismaService.refreshToken.findFirst.mockResolvedValue({
      id: "token-id",
      userId: "user-id",
      jti: "old-refresh-jti",
      tokenHash: "hashed-refresh-token",
      expiresAt: new Date(Date.now() + 10000),
    });
    bcryptCompareMock.mockResolvedValue(true);
    jwtService.signAsync
      .mockResolvedValueOnce("new-access-token")
      .mockResolvedValueOnce("new-refresh-token");
    prismaService.refreshToken.delete.mockResolvedValue({});
    prismaService.refreshToken.create.mockResolvedValue({});

    const response = await service.refreshToken({
      refreshToken: "refresh-token",
    });

    expect(response.accessToken).toBe("new-access-token");
    expect(response.refreshToken).toBe("new-refresh-token");
    expect(prismaService.refreshToken.findFirst).toHaveBeenCalledWith({
      where: {
        userId: "user-id",
        jti: "old-refresh-jti",
        expiresAt: { gt: expect.any(Date) },
      },
    });
    expect(prismaService.refreshToken.delete).toHaveBeenCalledWith({
      where: { id: "token-id" },
    });
    expect(prismaService.refreshToken.create).toHaveBeenCalled();
  });

  it("returns success true on logout even when no refresh token exists", async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error("Invalid token"));
    prismaService.refreshToken.delete.mockResolvedValue({});

    const response = await service.logout("user-id", {
      refreshToken: "missing-token",
    });

    expect(response).toEqual({ success: true });
    expect(prismaService.refreshToken.delete).not.toHaveBeenCalled();
  });
});
