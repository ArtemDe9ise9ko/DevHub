import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

/**
 * Analytics Page
 * Shows analytics dashboard placeholder
 */

@Component({
  selector: "app-analytics-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: "./analytics-page.component.html",
  styleUrls: ["./analytics-page.component.css"],
})
export class AnalyticsPageComponent {}
