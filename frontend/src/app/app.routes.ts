import { Routes } from "@angular/router";
import { AppShellComponent } from "@core/layout/app-shell/app-shell.component";
import { DashboardPageComponent } from "@features/dashboard/pages/dashboard-page/dashboard-page.component";
import { GitHubSearchPageComponent } from "@features/github-search/pages/github-search-page/github-search-page.component";
import { RepositoryDetailsPageComponent } from "@features/repository-details/pages/repository-details-page/repository-details-page.component";
import { FavoritesPageComponent } from "@features/favorites/pages/favorites-page/favorites-page.component";
import { SearchHistoryPageComponent } from "@features/search-history/pages/search-history-page/search-history-page.component";
import { AnalyticsPageComponent } from "@features/analytics/pages/analytics-page/analytics-page.component";
import { LoginPageComponent } from "@features/auth/pages/login-page/login-page.component";
import { RegisterPageComponent } from "@features/auth/pages/register-page/register-page.component";

/**
 * Application Routes
 * Defines all routes for the DevHub application
 */

export const routes: Routes = [
  {
    path: "",
    component: AppShellComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: DashboardPageComponent,
      },
      {
        path: "github-search",
        component: GitHubSearchPageComponent,
      },
      {
        path: "repositories/:owner/:repo",
        component: RepositoryDetailsPageComponent,
      },
      {
        path: "favorites",
        component: FavoritesPageComponent,
      },
      {
        path: "search-history",
        component: SearchHistoryPageComponent,
      },
      {
        path: "analytics",
        component: AnalyticsPageComponent,
      },
      {
        path: "login",
        component: LoginPageComponent,
      },
      {
        path: "register",
        component: RegisterPageComponent,
      },
      {
        path: "**",
        redirectTo: "dashboard",
      },
    ],
  },
];
