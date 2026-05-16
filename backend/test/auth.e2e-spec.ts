import { HttpExceptionFilter } from "../src/common/filters/http-exception.filter";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { ValidationPipe, INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request = require("supertest");

describe("Auth API (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;
  let latestAccessToken: string;
  let latestRefreshToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    server = app.getHttpServer();
  });

  afterAll(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
    await prisma.$disconnect();
  });

  it("registers a new user and returns tokens", async () => {
    const response = await request(server)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "strongPassword123" })
      .expect(201);

    expect(response.body.user.email).toBe("test@example.com");
    expect(typeof response.body.accessToken).toBe("string");
    expect(typeof response.body.refreshToken).toBe("string");
    expect(response.body.user.passwordHash).toBeUndefined();

    latestAccessToken = response.body.accessToken;
    latestRefreshToken = response.body.refreshToken;
  });

  it("returns 409 for duplicate registration", async () => {
    await request(server)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "strongPassword123" })
      .expect(409);
  });

  it("logs in with valid credentials", async () => {
    const response = await request(server)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "strongPassword123" })
      .expect(200);

    expect(typeof response.body.accessToken).toBe("string");
    expect(typeof response.body.refreshToken).toBe("string");

    latestAccessToken = response.body.accessToken;
    latestRefreshToken = response.body.refreshToken;
  });

  it("returns 401 for invalid login password", async () => {
    const response = await request(server)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "wrongPassword" })
      .expect(401);

    expect(response.body.message).toBe("Invalid email or password");
  });

  it("returns 401 for /auth/me without token", async () => {
    await request(server).get("/auth/me").expect(401);
  });

  it("returns current user with valid access token", async () => {
    const response = await request(server)
      .get("/auth/me")
      .set("Authorization", `Bearer ${latestAccessToken}`)
      .expect(200);

    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe("test@example.com");
    expect(response.body.passwordHash).toBeUndefined();
  });

  it("refreshes tokens and rotates refresh tokens", async () => {
    const initialRefreshToken = latestRefreshToken;

    const response = await request(server)
      .post("/auth/refresh")
      .send({ refreshToken: initialRefreshToken })
      .expect(200);

    expect(typeof response.body.accessToken).toBe("string");
    expect(typeof response.body.refreshToken).toBe("string");

    latestAccessToken = response.body.accessToken;
    latestRefreshToken = response.body.refreshToken;

    await request(server)
      .post("/auth/refresh")
      .send({ refreshToken: initialRefreshToken })
      .expect(401);
  });

  it("logs out and invalidates the refresh token", async () => {
    const response = await request(server)
      .post("/auth/logout")
      .set("Authorization", `Bearer ${latestAccessToken}`)
      .send({ refreshToken: latestRefreshToken })
      .expect(200);

    expect(response.body).toEqual({ success: true });
  });

  it("rejects refresh after logout", async () => {
    await request(server)
      .post("/auth/refresh")
      .send({ refreshToken: latestRefreshToken })
      .expect(401);
  });
});
