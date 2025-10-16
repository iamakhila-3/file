import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';
  success = '';
showPassword = false;

toggleShow() {
  this.showPassword = !this.showPassword;
}

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]], // ✅ changed to "password"
      role: ['EMPLOYEE', Validators.required] // ✅ default role Employee
    });
  }

  onSubmit() {
    this.error = '';
    if (this.registerForm.valid) {
      const payload = this.registerForm.value;

      this.auth.register(payload).subscribe({
        next: () => {
          this.success = 'Registration successful! Redirecting to login...';
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Registration failed. Try again.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
