import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

/**
 * Register Page
 * User registration placeholder
 */

@Component({
  selector: "app-register-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.css"],
})
export class RegisterPageComponent {}
