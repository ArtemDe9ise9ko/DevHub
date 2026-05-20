export interface AnalyticsLanguage {
  readonly language: string;
  readonly bytes?: number;
  readonly percentage?: number;
}

export interface AnalyticsLanguagesResponse {
  readonly items: AnalyticsLanguage[];
  readonly totalBytes?: number;
}
