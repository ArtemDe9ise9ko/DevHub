import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { AuthService } from "@core/auth/services/auth.service";
import { LoginRequest } from "@core/auth/models/login-request.model";

/**
 * Login Page
 * Authenticates the user using email and password
 */

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PageHeaderComponent,
  ],
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent {
  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.authService.login(this.loginForm.value as LoginRequest).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.router.navigate(["/dashboard"]);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          error?.error?.message ||
            "Unable to sign in. Please check your credentials.",
        );
      },
    });
  }
}
