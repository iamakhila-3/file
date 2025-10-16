import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'lm_token';
  private roleKey = 'lm_role';

  constructor(private api: ApiService) {}

  // 🔐 Login and store token + role
  login(credentials: any): Observable<any> {
    return this.api.post('/auth/login', credentials).pipe(
      map((res: any) => {
        if (res && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          // If backend sends role separately
          if (res.role) {
            localStorage.setItem(this.roleKey, res.role);
          } else {
            // If role is inside JWT payload
            const decoded = this.decodeToken(res.token);
            if (decoded?.role || decoded?.roles) {
              localStorage.setItem(this.roleKey, decoded.role || decoded.roles[0]);
            }
          }
        }
        return res;
      })
    );
  }

  register(user: any): Observable<any> {
    return this.api.post('/auth/register', user);
  }

  forgotPassword(request: any): Observable<any> {
    return this.api.post('/auth/forgot-password', request);
  }

  resetPassword(request: any): Observable<any> {
    return this.api.post('/auth/reset-password', request);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
  }

  // ✅ Token helpers
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getRole() {
    return localStorage.getItem(this.roleKey);
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // ✅ Decode JWT payload
  decodeToken(token?: string): any {
    const jwt = token || this.getToken();
    if (!jwt) return null;
    try {
      const payload = jwt.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  // ✅ Extract user details from token
  getUserDetails() {
    const decoded = this.decodeToken();
    if (!decoded) return null;
    return {
      username: decoded.sub || decoded.username || null,
      role: decoded.role || decoded.roles?.[0] || null,
      employeeId: decoded.employeeId || decoded.sub || null,
      exp: decoded.exp
    };
  }

  // ✅ Check if current user is Admin

isAdmin(): boolean {
  const role = this.getRole() || this.getUserDetails()?.role;
  return role === 'ROLE_ADMIN' || role === 'ADMIN';
}

isManager(): boolean {
  const role = this.getRole() || this.getUserDetails()?.role;
  return role === 'ROLE_MANAGER' || role === 'MANAGER';
}

isEmployee(): boolean {
  const role = this.getRole() || this.getUserDetails()?.role;
  return role === 'ROLE_EMPLOYEE' || role === 'EMPLOYEE';
}


  // ✅ Get employeeId (like EMP3)
  getEmployeeId(): string | null {
    return this.getUserDetails()?.employeeId || null;
  }
}
