import { Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  firstValueFrom,
  catchError,
  switchMap,
  tap,
  throwError,
  Observable,
  map,
  of,
} from "rxjs";
import { API_CONFIG } from "@core/config/api.config";
import { LoginRequest } from "../models/login-request.model";
import { RegisterRequest } from "../models/register-request.model";
import { TokenResponse } from "../models/token-response.model";
import { TokenStorageService } from "./token-storage.service";
import { User } from "../models/user.model";
import { AuthResponse } from "../models/auth-response.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = signal(false);
  authLoading = signal(true);

  constructor(
    private readonly http: HttpClient,
    private readonly tokenStorage: TokenStorageService,
  ) {}

  private handleTokens(response: TokenResponse): void {
    this.tokenStorage.setTokens(response.accessToken, response.refreshToken);
  }

  login(request: LoginRequest): Observable<User> {
    return this.http
      .post<AuthResponse>(`${API_CONFIG.baseUrl}/auth/login`, request)
      .pipe(
        tap((response) => this.handleTokens(response)),
        tap((response) => {
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        }),
        map((response) => response.user),
      );
  }
  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!refreshToken) {
      return throwError(() => new Error("Refresh token is missing"));
    }

    return this.http
      .post<TokenResponse>(`${API_CONFIG.baseUrl}/auth/refresh`, {
        refreshToken,
      })
      .pipe(tap((response) => this.handleTokens(response)));
  }
  register(request: RegisterRequest): Observable<User> {
    return this.http
      .post<AuthResponse>(`${API_CONFIG.baseUrl}/auth/register`, request)
      .pipe(
        tap((response) => this.handleTokens(response)),
        tap((response) => {
          this.currentUser.set(response.user);
          this.isAuthenticated.set(true);
        }),
        map((response) => response.user),
      );
  }

  logout(): Observable<void> {
    const refreshToken = this.tokenStorage.getRefreshToken();

    if (!refreshToken) {
      this.clearAuthState();
      return of(void 0);
    }

    return this.http
      .post<{ success: boolean }>(`${API_CONFIG.baseUrl}/auth/logout`, {
        refreshToken,
      })
      .pipe(
        catchError(() => of({ success: true })),
        tap(() => this.clearAuthState()),
        map(() => void 0),
      );
  }

  loadCurrentUser(): Promise<void> {
    const accessToken = this.tokenStorage.getAccessToken();
    if (!accessToken) {
      this.clearAuthState();
      this.authLoading.set(false);
      return Promise.resolve();
    }

    this.authLoading.set(true);

    return firstValueFrom(
      this.http.get<User>(`${API_CONFIG.baseUrl}/auth/me`).pipe(
        tap((user) => {
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        }),
      ),
    )
      .then(() => {
        this.authLoading.set(false);
      })
      .catch(() => {
        this.clearAuthState();
        this.authLoading.set(false);
      });
  }
  private clearAuthState(): void {
    this.tokenStorage.clearTokens();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }
}
