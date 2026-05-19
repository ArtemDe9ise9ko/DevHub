import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

/**
 * Repository Details Page
 * Shows details for a specific repository placeholder
 */

@Component({
  selector: "app-repository-details-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: "./repository-details-page.component.html",
  styleUrls: ["./repository-details-page.component.scss"],
})
export class RepositoryDetailsPageComponent {}
