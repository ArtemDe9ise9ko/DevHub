import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "@core/config/api.config";
import { SearchHistoryItem } from "@features/search-history/models/search-history-item.model";
import { CreateSearchHistoryRequest } from "@features/search-history/models/create-search-history-request.model";

@Injectable({ providedIn: "root" })
export class SearchHistoryService {
  constructor(private readonly http: HttpClient) {}

  getHistory(): Observable<SearchHistoryItem[]> {
    return this.http.get<SearchHistoryItem[]>(
      `${API_CONFIG.baseUrl}/search-history`,
    );
  }

  addHistory(
    request: CreateSearchHistoryRequest,
  ): Observable<SearchHistoryItem> {
    return this.http.post<SearchHistoryItem>(
      `${API_CONFIG.baseUrl}/search-history`,
      request,
    );
  }

  clearHistory(): Observable<void> {
    return this.http.delete<void>(`${API_CONFIG.baseUrl}/search-history`);
  }
}
