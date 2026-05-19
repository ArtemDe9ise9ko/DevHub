export interface RepositoryLanguage {
  readonly language: string;
  readonly bytes: number;
  readonly percentage: number;
}

export interface RepositoryLanguagesResponse {
  readonly languages: Record<string, number>;
  readonly totalBytes: number;
  readonly items: readonly RepositoryLanguage[];
}
