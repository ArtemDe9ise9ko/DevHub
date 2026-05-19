/**
 * API Error Response Model
 * Represents error responses from the backend API
 */

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface ApiErrorResponse {
  error: ApiError;
  timestamp: string;
}
