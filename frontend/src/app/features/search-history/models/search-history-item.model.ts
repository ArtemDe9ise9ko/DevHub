import { SearchHistoryType } from "./search-history-type.model";

export interface SearchHistoryItem {
  readonly id: string;
  readonly query: string;
  readonly type: SearchHistoryType;
  readonly createdAt: string;
}
