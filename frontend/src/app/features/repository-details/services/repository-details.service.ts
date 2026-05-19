import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RepositoryDetails } from "../models/repository-details.model";
import { RepositoryLanguagesResponse } from "../models/repository-language.model";
import { API_CONFIG } from "@core/config/api.config";

@Injectable({ providedIn: "root" })
export class RepositoryDetailsService {
  constructor(private readonly http: HttpClient) {}

  getRepositoryDetails(
    owner: string,
    repo: string,
  ): Observable<RepositoryDetails> {
    const url = `${API_CONFIG.baseUrl}/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
    return this.http.get<RepositoryDetails>(url);
  }

  getRepositoryLanguages(
    owner: string,
    repo: string,
  ): Observable<RepositoryLanguagesResponse> {
    const url = `${API_CONFIG.baseUrl}/github/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`;
    return this.http.get<RepositoryLanguagesResponse>(url);
  }
}
