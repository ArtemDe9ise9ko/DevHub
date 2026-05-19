import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";

/**
 * Login Page
 * User login placeholder
 */

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent {}
