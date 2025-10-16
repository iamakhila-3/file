import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  role: string = 'employee';
  showPassword = false;
  rememberMe = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.role = params['role'] || 'employee';
    });

    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { username, password } = this.form.value;
    const credentials = { username, password, role: this.role };

    this.auth.login(credentials).subscribe({
      next: (res: any) => {
        if (res && res.token) {
          // ✅ Store employee ID for later
          localStorage.setItem('userRole', this.role);
          localStorage.setItem('employeeId', res.id); // <-- save employee id

          // ✅ Redirect properly
          if (this.role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/employee']);
          }
        } else {
          this.error = 'Invalid credentials';
        }
      },
      error: (err) => {
        console.error(err);
        this.error = 'Login failed. Please try again.';
      }
    });
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
