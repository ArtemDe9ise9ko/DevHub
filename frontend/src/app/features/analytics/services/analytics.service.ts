import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "@core/config/api.config";
import { AnalyticsSummary } from "@features/analytics/models/analytics-summary.model";
import { AnalyticsLanguagesResponse } from "@features/analytics/models/analytics-language.model";

@Injectable({ providedIn: "root" })
export class AnalyticsService {
  constructor(private readonly http: HttpClient) {}

  getUserSummary(username: string): Observable<AnalyticsSummary> {
    return this.http.get<AnalyticsSummary>(
      `${API_CONFIG.baseUrl}/analytics/users/${encodeURIComponent(username)}/summary`,
    );
  }

  getUserLanguages(username: string): Observable<AnalyticsLanguagesResponse> {
    return this.http.get<AnalyticsLanguagesResponse>(
      `${API_CONFIG.baseUrl}/analytics/users/${encodeURIComponent(username)}/languages`,
    );
  }
}
