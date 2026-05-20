import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { forkJoin } from "rxjs";

import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { LoadingStateComponent } from "@shared/components/loading-state/loading-state.component";
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component";
import { RepositoryDetailsService } from "../../services/repository-details.service";
import { RepositoryDetails } from "../../models/repository-details.model";
import { RepositoryLanguagesResponse } from "../../models/repository-language.model";
import { FavoritesService } from "@features/favorites/services/favorites.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CreateFavoriteRepositoryRequest } from "@features/favorites/models/create-favorite-repository-request.model";

/**
 * Repository Details Page
 * Shows details for a specific GitHub repository
 */

@Component({
  selector: "app-repository-details-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./repository-details-page.component.html",
  styleUrls: ["./repository-details-page.component.scss"],
})
export class RepositoryDetailsPageComponent implements OnInit {
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly repository = signal<RepositoryDetails | null>(null);
  readonly languages = signal<RepositoryLanguagesResponse | null>(null);
  readonly adding = signal(false);

  private readonly owner = signal<string | null>(null);
  private readonly repo = signal<string | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly service: RepositoryDetailsService,
    private readonly favorites: FavoritesService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const owner = params.get("owner");
      const repo = params.get("repo");

      if (!owner || !repo) {
        this.errorMessage.set("Repository information is missing.");
        return;
      }

      this.owner.set(owner);
      this.repo.set(repo);
      this.loadRepositoryDetails();
    });
  }

  addFavoriteFromDetails(): void {
    const repo = this.repository();
    if (!repo) return;

    if (!this.authService.isAuthenticated()) {
      this.errorMessage.set("Sign in to save favorites.");
      return;
    }

    if (this.adding()) return;
    this.adding.set(true);

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
        this.adding.set(false);
      },
      error: (err) => {
        if (err?.status === 409) {
          this.errorMessage.set("Repository is already in favorites.");
        } else {
          this.errorMessage.set(
            "Unable to update favorites. Please try again.",
          );
        }
        this.adding.set(false);
      },
    });
  }

  private loadRepositoryDetails(): void {
    const owner = this.owner();
    const repo = this.repo();

    if (!owner || !repo) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.repository.set(null);
    this.languages.set(null);

    const details$ = this.service.getRepositoryDetails(owner, repo);
    const languages$ = this.service.getRepositoryLanguages(owner, repo);

    forkJoin([details$, languages$]).subscribe({
      next: ([details, langs]) => {
        this.repository.set(details);
        this.languages.set(langs);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err?.status === 404) {
          this.errorMessage.set("Repository was not found.");
        } else {
          this.errorMessage.set(
            "Unable to load repository details. Please try again.",
          );
        }
      },
    });
  }
}
