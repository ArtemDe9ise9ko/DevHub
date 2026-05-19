import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

/**
 * Search History Page
 * Shows user's search history placeholder
 */

@Component({
  selector: "app-search-history-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: "./search-history-page.component.html",
  styleUrls: ["./search-history-page.component.css"],
})
export class SearchHistoryPageComponent {}
