import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  private static readonly ACCESS_TOKEN_KEY = "devhub_access_token";
  private static readonly REFRESH_TOKEN_KEY = "devhub_refresh_token";

  getAccessToken(): string | null {
    return localStorage.getItem(TokenStorageService.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(TokenStorageService.REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(TokenStorageService.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(TokenStorageService.REFRESH_TOKEN_KEY, refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(TokenStorageService.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TokenStorageService.REFRESH_TOKEN_KEY);
  }
}
