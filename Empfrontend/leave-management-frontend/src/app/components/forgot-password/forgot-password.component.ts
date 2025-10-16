import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  form!: FormGroup;

  sending = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.sending = true;
    this.successMessage = this.errorMessage = '';

    const email = this.form.value.email!;
    this.api.forgotPassword(email).subscribe({
      next: () => {
        this.successMessage = 'If that email exists, a reset link was sent.';
        this.sending = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to send reset email';
        this.sending = false;
      }
    });
  }
}
