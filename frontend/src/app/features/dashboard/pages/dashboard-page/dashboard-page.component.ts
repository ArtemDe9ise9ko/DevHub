import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { AuthService } from "@core/auth/services/auth.service";

import type { User } from "@core/auth/models/user.model";

/**
 * Dashboard Page
 * Main dashboard view for DevHub overview
 */

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, RouterModule],
  templateUrl: "./dashboard-page.component.html",
  styleUrls: ["./dashboard-page.component.scss"],
})
export class DashboardPageComponent {
  readonly currentUser = this.authService.currentUser;

  constructor(private readonly authService: AuthService) {}

  userEmail(): string | undefined {
    const u = this.currentUser();
    return u ? u.email : undefined;
  }
}
