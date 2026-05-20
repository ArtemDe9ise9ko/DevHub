import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { LoadingStateComponent } from "@shared/components/loading-state/loading-state.component";
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component";
import { GitHubSearchService } from "../../services/github-search.service";
import { GitHubUser } from "../../models/github-user.model";
import { GitHubRepository } from "../../models/github-repository.model";
import { GitHubRepositoryQuery } from "../../models/github-repository-query.model";
import { FavoritesService } from "@features/favorites/services/favorites.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CreateFavoriteRepositoryRequest } from "@features/favorites/models/create-favorite-repository-request.model";

/**
 * GitHub Search Page
 * Search for GitHub users and list repositories
 */

@Component({
  selector: "app-github-search-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PageHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./github-search-page.component.html",
  styleUrls: ["./github-search-page.component.scss"],
})
export class GitHubSearchPageComponent {
  readonly loading = signal(false);
  readonly submitted = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly user = signal<GitHubUser | null>(null);
  readonly repositories = signal<GitHubRepository[] | null>(null);
  readonly adding = signal<number[]>([]);
  readonly favoriteMessage = signal<string | null>(null);

  readonly repoQuery: GitHubRepositoryQuery = {
    page: 1,
    perPage: 10,
    sort: "updated",
    direction: "desc",
  };

  readonly form = this.fb.group({
    username: ["", [Validators.required, Validators.minLength(1)]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: GitHubSearchService,
    private readonly favorites: FavoritesService,
    private readonly authService: AuthService,
  ) {}

  get username() {
    return this.form.get("username");
  }

  addingId(id: number): boolean {
    return (this.adding() || []).indexOf(id) !== -1;
  }

  addFavorite(repo: GitHubRepository): void {
    this.favoriteMessage.set(null);
    if (!this.authService.isAuthenticated()) {
      this.favoriteMessage.set("Sign in to save favorites.");
      return;
    }

    if (this.addingId(repo.id)) return;

    this.adding.set([...(this.adding() || []), repo.id]);

    const req: CreateFavoriteRepositoryRequest = {
      repositoryId: repo.id,
      name: repo.name,
      fullName: repo.fullName,
      description: repo.description,
      language: repo.language,
      stars: repo.stars,
      forks: repo.forks,
      openIssues: repo.openIssues,
      repositoryUrl: repo.repositoryUrl,
      ownerUsername: repo.ownerUsername,
      ownerAvatarUrl: repo.ownerAvatarUrl,
    };

    this.favorites.addFavorite(req).subscribe({
      next: () => {
        this.favoriteMessage.set("Saved to favorites.");
        this.adding.set((this.adding() || []).filter((i) => i !== repo.id));
      },
      error: (err) => {
        if (err?.status === 409) {
          this.favoriteMessage.set("Repository is already in favorites.");
        } else {
          this.favoriteMessage.set(
            "Unable to update favorites. Please try again.",
          );
        }
        this.adding.set((this.adding() || []).filter((i) => i !== repo.id));
      },
    });
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.favoriteMessage.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const username = (this.form.value.username || "").toString().trim();
    if (!username) return;

    this.loading.set(true);
    this.submitted.set(true);
    this.user.set(null);
    this.repositories.set(null);

    const user$ = this.service.getUser(username);

    const repos$ = this.service
      .getUserRepositories(username, this.repoQuery)
      .pipe(catchError(() => of([] as GitHubRepository[])));

    forkJoin([user$, repos$]).subscribe({
      next: ([user, repos]) => {
        this.user.set(user);
        this.repositories.set(repos);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err?.status === 404) {
          this.errorMessage.set("GitHub user was not found.");
        } else {
          this.errorMessage.set(
            "Unable to load GitHub data. Please try again.",
          );
        }
      },
    });
  }
}
