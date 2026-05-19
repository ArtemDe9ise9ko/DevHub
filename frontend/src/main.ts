import { APP_INITIALIZER } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { AuthInterceptor } from "./app/core/auth/interceptors/auth.interceptor";
import { AuthService } from "./app/core/auth/services/auth.service";
import { routes } from "./app/app.routes";

export function initializeAuth(authService: AuthService) {
  return () => authService.loadCurrentUser();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
