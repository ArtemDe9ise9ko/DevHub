import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { GitHubUser } from "../models/github-user.model";
import { GitHubRepository } from "../models/github-repository.model";
import { GitHubRepositoryQuery } from "../models/github-repository-query.model";
import { API_CONFIG } from "@core/config/api.config";

@Injectable({ providedIn: "root" })
export class GitHubSearchService {
  constructor(private readonly http: HttpClient) {}

  getUser(username: string): Observable<GitHubUser> {
    const url = `${API_CONFIG.baseUrl}/github/users/${encodeURIComponent(username)}`;
    return this.http.get<GitHubUser>(url);
  }

  getUserRepositories(
    username: string,
    query: GitHubRepositoryQuery,
  ): Observable<GitHubRepository[]> {
    const url = `${API_CONFIG.baseUrl}/github/users/${encodeURIComponent(username)}/repositories`;
    const params = new HttpParams()
      .set("page", String(query.page))
      .set("perPage", String(query.perPage))
      .set("sort", query.sort)
      .set("direction", query.direction);

    return this.http.get<GitHubRepository[]>(url, { params });
  }
}
