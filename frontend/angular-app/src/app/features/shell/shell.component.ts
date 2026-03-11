import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  auth = inject(AuthService);

  sidebarOpen = false;

  get user()      { return this.auth.currentUser(); }
  get company()   { return this.auth.userCompany(); }
  get isAdmin()   { return this.auth.hasRole('admin'); }

  get userInitials(): string {
    const meta = (this.user?.user_metadata as any);
    const name: string = meta?.nome ?? meta?.name ?? this.user?.email ?? '';
    return name
      .split(' ')
      .slice(0, 2)
      .map((n: string) => n[0]?.toUpperCase())
      .join('') || this.user?.email?.[0]?.toUpperCase() || '?';
  }

  get userName(): string {
    const meta = (this.user?.user_metadata as any);
    return meta?.nome ?? meta?.name ?? this.user?.email ?? 'Usuário';
  }

  get userRole(): string {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      funcionario: 'Técnico / Funcionário',
      cliente: 'Cliente',
      desenvolvedor: 'Desenvolvedor',
    };
    return labels[this.auth.userRoles()[0]] ?? '—';
  }

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }

  logout() { this.auth.logout(); }
}
