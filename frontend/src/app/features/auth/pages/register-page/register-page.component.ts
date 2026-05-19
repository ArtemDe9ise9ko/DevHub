import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { AuthService } from "@core/auth/services/auth.service";
import { RegisterRequest } from "@core/auth/models/register-request.model";

/**
 * Register Page
 * Creates a new user account using email and password
 */

@Component({
  selector: "app-register-page",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PageHeaderComponent,
  ],
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.scss"],
})
export class RegisterPageComponent {
  errorMessage = signal<string | null>(null);
  isSubmitting = signal(false);

  registerForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  get email() {
    return this.registerForm.get("email");
  }

  get password() {
    return this.registerForm.get("password");
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    this.authService
      .register(this.registerForm.value as RegisterRequest)
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(
            error?.error?.message || "Unable to register. Please try again.",
          );
        },
      });
  }
}
