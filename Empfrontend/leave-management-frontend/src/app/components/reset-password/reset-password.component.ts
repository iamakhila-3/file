import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  token: string | null = null;

  submitting = false;
  successMessage = '';
  errorMessage = '';

  showPassword = false;
  showConfirm = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', [Validators.required]]
    });

    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  submit() {
    if (this.form.invalid) return;

    const pw = this.form.value.password!;
    const confirm = this.form.value.confirm!;
    if (pw !== confirm) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    if (!this.token) {
      this.errorMessage = 'Missing reset token. Use the link from your email.';
      return;
    }

    this.submitting = true;
    this.errorMessage = this.successMessage = '';

    this.api.resetPassword(this.token, pw).subscribe({
      next: () => {
        this.successMessage = 'Password reset successfully. Redirecting...';
        this.submitting = false;
        setTimeout(() => this.router.navigateByUrl('/login/user'), 1500);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to reset password';
        this.submitting = false;
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm() {
    this.showConfirm = !this.showConfirm;
  }
}
