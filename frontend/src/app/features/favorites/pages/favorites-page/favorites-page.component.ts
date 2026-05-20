import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { LoadingStateComponent } from "@shared/components/loading-state/loading-state.component";
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component";
import { FavoritesService } from "@features/favorites/services/favorites.service";
import { FavoriteRepository } from "@features/favorites/models/favorite-repository.model";

@Component({
  selector: "app-favorites-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./favorites-page.component.html",
  styleUrls: ["./favorites-page.component.scss"],
})
export class FavoritesPageComponent implements OnInit {
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly favorites = signal<FavoriteRepository[] | null>(null);

  constructor(private readonly service: FavoritesService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.service.getFavorites().subscribe({
      next: (items) => {
        this.favorites.set(items || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set("Unable to load favorites. Please try again.");
      },
    });
  }

  remove(id: string): void {
    this.errorMessage.set(null);
    this.service.removeFavorite(id).subscribe({
      next: () => {
        const current = this.favorites() || [];
        this.favorites.set(current.filter((f) => f.id !== id));
      },
      error: () => {
        this.errorMessage.set("Unable to update favorites. Please try again.");
      },
    });
  }
}
