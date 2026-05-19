import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

/**
 * Favorites Page
 * Shows user's favorite repositories placeholder
 */

@Component({
  selector: "app-favorites-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: "./favorites-page.component.html",
  styleUrls: ["./favorites-page.component.scss"],
})
export class FavoritesPageComponent {}
