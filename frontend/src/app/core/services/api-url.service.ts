import { Injectable } from "@angular/core";
import { API_CONFIG } from "../config/api.config";

/**
 * API URL Service
 * Provides centralized access to API base URL
 */

@Injectable({
  providedIn: "root",
})
export class ApiUrlService {
  get baseUrl(): string {
    return API_CONFIG.baseUrl;
  }
}
