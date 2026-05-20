import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { forkJoin, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { LoadingStateComponent } from "@shared/components/loading-state/loading-state.component";
import { EmptyStateComponent } from "@shared/components/empty-state/empty-state.component";
import { AnalyticsService } from "@features/analytics/services/analytics.service";
import { AnalyticsSummary } from "@features/analytics/models/analytics-summary.model";
import { AnalyticsLanguagesResponse } from "@features/analytics/models/analytics-language.model";

@Component({
  selector: "app-analytics-page",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./analytics-page.component.html",
  styleUrls: ["./analytics-page.component.scss"],
})
export class AnalyticsPageComponent {
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly summary = signal<AnalyticsSummary | null>(null);
  readonly languages = signal<AnalyticsLanguagesResponse | null>(null);

  readonly form = this.fb.group({
    username: ["", [Validators.required, Validators.minLength(1)]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly service: AnalyticsService,
  ) {}

  get username() {
    return this.form.get("username");
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const username = (this.form.value.username || "").toString().trim();
    if (!username) return;

    this.loading.set(true);
    this.summary.set(null);
    this.languages.set(null);

    const summary$ = this.service.getUserSummary(username).pipe(
      catchError((err) => {
        throw err;
      }),
    );
    const languages$ = this.service
      .getUserLanguages(username)
      .pipe(catchError(() => of({ items: [] } as AnalyticsLanguagesResponse)));

    forkJoin([summary$, languages$]).subscribe({
      next: ([summary, langs]) => {
        this.summary.set(summary);
        this.languages.set(langs);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        if (err?.status === 404) {
          this.errorMessage.set("GitHub user was not found.");
        } else {
          this.errorMessage.set("Unable to load analytics. Please try again.");
        }
      },
    });
  }
}
