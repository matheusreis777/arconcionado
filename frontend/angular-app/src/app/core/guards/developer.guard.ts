import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const developerGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasRole('desenvolvedor')) {
    return true;
  }

  // If not a developer, redirect to common dashboard
  router.navigate(['/dashboard']);
  return false;
};
