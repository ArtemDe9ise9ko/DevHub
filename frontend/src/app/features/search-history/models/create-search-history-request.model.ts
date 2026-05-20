import { SearchHistoryType } from "./search-history-type.model";

export interface CreateSearchHistoryRequest {
  readonly query: string;
  readonly type: SearchHistoryType;
}
