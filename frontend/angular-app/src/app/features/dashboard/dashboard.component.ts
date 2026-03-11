import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <nav class="sidebar">
        <div class="sidebar-logo">
          <span>❄️</span>
          <span>Under Control</span>
        </div>
        <ul class="nav-list">
          <li><a routerLink="/dashboard">🏠 Dashboard</a></li>
          <li><a routerLink="/service-orders">📋 Ordens de Serviço</a></li>
          <li><a routerLink="/equipments">🌡️ Equipamentos</a></li>
          <li><a routerLink="/clients">👥 Clientes</a></li>
          <li><a routerLink="/profile">👤 Perfil</a></li>
        </ul>
        <button class="logout-btn" (click)="logout()">🚪 Sair</button>
      </nav>

      <main class="main-content">
        <header class="topbar">
          <h2>Dashboard</h2>
          <span class="user-email">{{ auth.currentUser()?.email }}</span>
        </header>

        <div class="cards-grid">
          <div class="card">
            <div class="card-icon">📋</div>
            <div class="card-info">
              <span class="card-label">Ordens de Serviço</span>
              <a routerLink="/service-orders" class="card-link">Ver todas →</a>
            </div>
          </div>
          <div class="card">
            <div class="card-icon">🌡️</div>
            <div class="card-info">
              <span class="card-label">Equipamentos</span>
              <a routerLink="/equipments" class="card-link">Gerenciar →</a>
            </div>
          </div>
          <div class="card">
            <div class="card-icon">👥</div>
            <div class="card-info">
              <span class="card-label">Clientes</span>
              <a routerLink="/clients" class="card-link">Ver todos →</a>
            </div>
          </div>
          <div class="card">
            <div class="card-icon">✅</div>
            <div class="card-info">
              <span class="card-label">Sistema Ativo</span>
              <span class="card-link" style="color:#00c9a7">Conectado ao Supabase</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; min-height: 100vh; background: #0f1117; color: #fff; }
    .sidebar {
      width: 240px; background: #161b22; border-right: 1px solid rgba(255,255,255,0.08);
      display: flex; flex-direction: column; padding: 1.5rem 0;
    }
    .sidebar-logo {
      display: flex; align-items: center; gap: 0.5rem; padding: 0 1.25rem 1.5rem;
      font-size: 1.1rem; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 1rem;
    }
    .nav-list { list-style: none; margin: 0; padding: 0; flex: 1; }
    .nav-list li a {
      display: block; padding: 0.75rem 1.25rem; color: rgba(255,255,255,0.6);
      text-decoration: none; transition: all 0.2s; font-size: 0.9rem; border-radius: 8px; margin: 0.15rem 0.75rem;
    }
    .nav-list li a:hover { background: rgba(255,255,255,0.07); color: #fff; }
    .logout-btn {
      margin: 0.75rem; padding: 0.65rem; background: rgba(255,80,80,0.1);
      color: #ff6b6b; border: 1px solid rgba(255,80,80,0.2); border-radius: 8px;
      cursor: pointer; font-size: 0.9rem; transition: all 0.2s;
    }
    .logout-btn:hover { background: rgba(255,80,80,0.2); }
    .main-content { flex: 1; display: flex; flex-direction: column; }
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.25rem 2rem; background: #161b22; border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .topbar h2 { margin: 0; font-size: 1.25rem; }
    .user-email { color: rgba(255,255,255,0.5); font-size: 0.85rem; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem; padding: 2rem; }
    .card {
      background: #161b22; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px;
      padding: 1.5rem; display: flex; align-items: center; gap: 1rem; transition: transform 0.2s;
    }
    .card:hover { transform: translateY(-3px); }
    .card-icon { font-size: 2rem; }
    .card-label { display: block; color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 0.3rem; }
    .card-link { color: #00c9a7; font-size: 0.85rem; text-decoration: none; }
  `],
})
export class DashboardComponent {
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
