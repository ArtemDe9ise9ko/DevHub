import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { API_CONFIG } from "@core/config/api.config";
import { FavoriteRepository } from "@features/favorites/models/favorite-repository.model";
import { CreateFavoriteRepositoryRequest } from "@features/favorites/models/create-favorite-repository-request.model";

@Injectable({ providedIn: "root" })
export class FavoritesService {
  constructor(private readonly http: HttpClient) {}

  getFavorites(): Observable<FavoriteRepository[]> {
    return this.http.get<FavoriteRepository[]>(
      `${API_CONFIG.baseUrl}/favorites/repositories`,
    );
  }

  addFavorite(
    request: CreateFavoriteRepositoryRequest,
  ): Observable<FavoriteRepository> {
    return this.http.post<FavoriteRepository>(
      `${API_CONFIG.baseUrl}/favorites/repositories`,
      request,
    );
  }

  removeFavorite(id: string): Observable<void> {
    return this.http.delete<void>(
      `${API_CONFIG.baseUrl}/favorites/repositories/${encodeURIComponent(id)}`,
    );
  }
}
