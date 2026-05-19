export type GitHubRepositorySort =
  | "created"
  | "updated"
  | "pushed"
  | "full_name";
export type GitHubRepositoryDirection = "asc" | "desc";

export interface GitHubRepositoryQuery {
  readonly page: number;
  readonly perPage: number;
  readonly sort: GitHubRepositorySort;
  readonly direction: GitHubRepositoryDirection;
}
