import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GitHubController } from "./github.controller";
import { GitHubService } from "./github.service";

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const token = configService.get<string>("GITHUB_TOKEN");
        const headers: Record<string, string> = {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "DevHub",
        };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        return {
          baseURL: "https://api.github.com",
          headers,
          timeout: 5000,
        };
      },
    }),
  ],
  controllers: [GitHubController],
  providers: [GitHubService],
  exports: [GitHubService],
})
export class GitHubModule {}
