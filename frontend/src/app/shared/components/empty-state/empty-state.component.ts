import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * Empty State Component
 * Displays an empty state message with title
 */

@Component({
  selector: "app-empty-state",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./empty-state.component.html",
  styleUrls: ["./empty-state.component.scss"],
})
export class EmptyStateComponent {
  @Input() title: string = "No data";
  @Input() message: string = "Nothing to display here.";
}
