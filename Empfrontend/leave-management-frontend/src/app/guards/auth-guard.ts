import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login/admin']); // redirect to login
      return false;
    }

    const roles = route.data['roles'] as string[]; // allow multiple roles
    if (roles && !roles.includes(this.auth.getRole() || '')) {
      this.router.navigate(['/home']); // redirect if role mismatch
      return false;
    }

    return true;
  }
}
