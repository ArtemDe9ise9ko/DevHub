import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

/**
 * Dashboard Page
 * Main dashboard view placeholder
 */

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.css"],
})
export class DashboardPageComponent {}
