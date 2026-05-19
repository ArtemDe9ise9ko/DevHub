import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";

/**
 * App Shell Component
 * Main layout wrapper for the application
 * Includes header with navigation
 */

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./app-shell.component.html",
  styleUrls: ["./app-shell.component.scss"],
})
export class AppShellComponent {
  currentUser = this.authService.currentUser;
  isAuthenticated = this.authService.isAuthenticated;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(["/login"]),
    });
  }
}
