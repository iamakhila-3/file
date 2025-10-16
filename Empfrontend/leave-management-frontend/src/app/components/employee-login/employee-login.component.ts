import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-employee-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-login.component.html',
  styleUrls: ['./employee-login.component.css']
})
export class EmployeeLoginComponent {
  employeeId = '';
  password = '';
  rememberMe = false;
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    if (!this.employeeId || !this.password) {
      this.error = 'Please enter employee ID and password.';
      return;
    }

    this.loading = true;
    this.auth.login({ username: this.employeeId, password: this.password }).subscribe({
      next: (res) => {
        try {
          const decoded = this.auth.decodeToken(res.token);
          const storage = this.rememberMe ? localStorage : sessionStorage;

          storage.setItem('lm_token', res.token);
          storage.setItem('lm_role', decoded.role);
          storage.setItem('employeeId', decoded.sub);

          if (decoded.role === 'ADMIN') this.router.navigate(['/admin']);
          else this.router.navigate(['/employee']);
        } catch (err) {
          this.error = 'Invalid token received';
        } finally {
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Login failed';
        this.loading = false;
      }
    });
  }

  forgotPassword() { this.router.navigate(['/forgot-password']); }
  goToRegister() { this.router.navigate(['/register']); }
}
