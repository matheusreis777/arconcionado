import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo">
          <span class="logo-icon">❄️</span>
          <h1>Under Control</h1>
          <p>Gestão de Ar-Condicionado</p>
        </div>

        <form (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="field">
            <label for="email">E-mail</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="seu@email.com"
              required
              [disabled]="loading()"
            />
          </div>

          <div class="field">
            <label for="password">Senha</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
              [disabled]="loading()"
            />
          </div>

          @if (error()) {
            <div class="error-msg">{{ error() }}</div>
          }

          <button type="submit" [disabled]="loading() || !loginForm.valid">
            @if (loading()) {
              <span>Entrando...</span>
            } @else {
              <span>Entrar</span>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    }
    .login-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 2.5rem;
      width: 100%;
      max-width: 380px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.4);
    }
    .logo {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
    .logo h1 { color: #fff; margin: 0; font-size: 1.6rem; font-weight: 700; }
    .logo p { color: rgba(255,255,255,0.5); font-size: 0.85rem; margin: 0.25rem 0 0; }
    .field { margin-bottom: 1rem; }
    .field label { display: block; color: rgba(255,255,255,0.7); font-size: 0.85rem; margin-bottom: 0.4rem; }
    .field input {
      width: 100%; padding: 0.75rem 1rem; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.08);
      color: #fff; font-size: 1rem; outline: none; transition: border 0.2s; box-sizing: border-box;
    }
    .field input:focus { border-color: #00c9a7; }
    .field input::placeholder { color: rgba(255,255,255,0.3); }
    button {
      width: 100%; padding: 0.85rem; margin-top: 0.5rem;
      background: linear-gradient(135deg, #00c9a7, #00b4d8);
      color: #fff; border: none; border-radius: 10px; font-size: 1rem;
      font-weight: 600; cursor: pointer; transition: opacity 0.2s;
    }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    button:hover:not(:disabled) { opacity: 0.9; }
    .error-msg {
      background: rgba(255,80,80,0.15); border: 1px solid rgba(255,80,80,0.3);
      color: #ff6b6b; border-radius: 8px; padding: 0.6rem 1rem; font-size: 0.85rem; margin-bottom: 0.75rem;
    }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private authService: AuthService) {}

  async onLogin() {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.authService.login(this.email, this.password);
    } catch (err: any) {
      this.error.set(err?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      this.loading.set(false);
    }
  }
}
