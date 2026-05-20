import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { LoadingStateComponent } from "@shared/components/loading-state/loading-state.component";
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component";
import { SearchHistoryService } from "@features/search-history/services/search-history.service";
import { SearchHistoryItem } from "@features/search-history/models/search-history-item.model";

@Component({
  selector: "app-search-history-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./search-history-page.component.html",
  styleUrls: ["./search-history-page.component.scss"],
})
export class SearchHistoryPageComponent implements OnInit {
  readonly loading = signal(false);
  readonly clearing = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly history = signal<SearchHistoryItem[] | null>(null);

  constructor(private readonly service: SearchHistoryService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  private loadHistory(): void {
    this.loading.set(true);
    this.errorMessage.set(null);
    this.service.getHistory().subscribe({
      next: (items) => {
        this.history.set(items || []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set(
          "Unable to load search history. Please try again.",
        );
      },
    });
  }

  clear(): void {
    this.errorMessage.set(null);
    this.clearing.set(true);
    this.service.clearHistory().subscribe({
      next: () => {
        this.history.set([]);
        this.clearing.set(false);
      },
      error: () => {
        this.errorMessage.set(
          "Unable to clear search history. Please try again.",
        );
        this.clearing.set(false);
      },
    });
  }
}
