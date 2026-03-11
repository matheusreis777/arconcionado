import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { developerGuard } from './core/guards/developer.guard';

export const routes: Routes = [
  // ─── Rotas públicas (sem shell) ────────────────────────────────────────────
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'role-selection',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/role-selection/role-selection.component').then(
        (m) => m.RoleSelectionComponent
      ),
  },
  {
    path: 'company-setup',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/auth/company-setup/company-setup.component').then(
        (m) => m.CompanySetupComponent
      ),
  },

  // ─── Rota do desenvolvedor (layout próprio) ────────────────────────────────
  {
    path: 'developer',
    canActivate: [authGuard, developerGuard],
    loadComponent: () =>
      import('./features/developer/developer.component').then(
        (m) => m.DeveloperComponent
      ),
  },

  // ─── Shell: todas as rotas autenticadas com sidebar + header ───────────────
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shell/shell.component').then(
        (m) => m.ShellComponent
      ),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'service-orders',
        loadComponent: () =>
          import('./features/service-orders/service-orders.component').then(
            (m) => m.ServiceOrdersComponent
          ),
      },
      {
        path: 'equipments',
        loadComponent: () =>
          import('./features/equipments/equipments.component').then(
            (m) => m.EquipmentsComponent
          ),
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/clients.component').then(
            (m) => m.ClientsComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile.component').then(
            (m) => m.ProfileComponent
          ),
      },
      {
        path: 'invite-collaborator',
        loadComponent: () =>
          import('./features/invite-collaborator/invite-collaborator.component').then(
            (m) => m.InviteCollaboratorComponent
          ),
      },
    ],
  },

  // ─── Fallback ──────────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'dashboard' },
];
