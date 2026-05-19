import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

/**
 * GitHub Search Page
 * Search for GitHub repositories placeholder
 */

@Component({
  selector: "app-github-search-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: "./github-search-page.component.html",
  styleUrls: ["./github-search-page.component.css"],
})
export class GitHubSearchPageComponent {}
