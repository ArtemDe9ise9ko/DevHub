import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

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
export class AppShellComponent {}
