import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * Loading State Component
 * Displays a loading indicator with optional message
 */

@Component({
  selector: "app-loading-state",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./loading-state.component.html",
  styleUrls: ["./loading-state.component.scss"],
})
export class LoadingStateComponent {
  @Input() message: string = "Loading...";
}
