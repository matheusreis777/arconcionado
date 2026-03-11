import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="padding:2rem;background:#0f1117;min-height:100vh;color:#fff;">
      <h2>👤 Meu Perfil</h2>
      <p style="color:rgba(255,255,255,0.5)">Usuário: {{ auth.currentUser()?.email }}</p>
      <a routerLink="/dashboard" style="color:#00c9a7">← Voltar ao Dashboard</a>
    </div>
  `,
})
export class ProfileComponent {
  auth = inject(AuthService);
}
