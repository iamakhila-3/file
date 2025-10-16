import { Routes } from '@angular/router';

// Guards
import { AuthGuard } from './guards/auth-guard';


// ✅ Standard Components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// ✅ Admin Dashboard Components
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminLeaveRequestsComponent } from './components/admin-leave-requests/admin-leave-requests.component';
import { AdminLeaveTypesComponent } from './components/admin-leave-types/admin-leave-types.component';
import { EmployeesComponent } from './components/employees/employees.component';

// ✅ Employee Dashboard Components
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { EmployeeLeaveRequestsComponent } from './components/employee-leave-requests/employee-leave-requests.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login/:role', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // 👇 Admin Dashboard with children
  {
  path: 'admin',
  component: AdminDashboardComponent,
  canActivate: [AuthGuard],
  data: { roles: ['ADMIN','MANAGER'] },
  children: [
    { path: 'employees', component: EmployeesComponent },
    { path: 'leave-types', component: AdminLeaveTypesComponent },
    { path: 'leave-requests', component: AdminLeaveRequestsComponent },
    { path: '', redirectTo: 'employees', pathMatch: 'full' }
  ]
},
{
  path: 'employee',
  component: EmployeeDashboardComponent,
  canActivate: [AuthGuard],
  data: { roles: ['EMPLOYEE'] },
  children: [
    { path: 'leave-requests', component: EmployeeLeaveRequestsComponent },
    { path: '', redirectTo: 'leave-requests', pathMatch: 'full' }
  ]
},


  // 👇 Lazy-loaded components (Forgot & Reset Password)
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./components/forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent)
  },

  // 👇 Wildcard route
  { path: '**', redirectTo: 'home' }
];
