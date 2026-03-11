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
    <div class="auth-wrapper">
      <div class="description-side">
        <div class="description-content">
          <div class="logo">
            <span class="logo-icon">❄️</span>
            <h1>Under Control</h1>
          </div>
          <h2>Gestão Inteligente de Ar-Condicionado</h2>
          <p>Potencialize sua produtividade com nosso sistema completo de controle de manutenções. Gerencie ordens de serviço, equipamentos e clientes em um só lugar.</p>
          <ul class="features">
            <li>✅ Controle de Ordens de Serviço</li>
            <li>✅ Histórico de Manutenções</li>
            <li>✅ Gestão de Equipamentos</li>
            <li>✅ Cadastro de Clientes</li>
          </ul>
        </div>
      </div>

      <div class="form-side">
        <div class="form-container">
          <div class="form-header">
            <h3>{{ isLoginMode() ? 'Bem-vindo de volta' : 'Crie sua conta' }}</h3>
            <p>{{ isLoginMode() ? 'Acesse sua conta para gerenciar seus serviços' : 'Comece agora a organizar suas manutenções' }}</p>
          </div>

          <form (ngSubmit)="onSubmit()" #authForm="ngForm">
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
                minlength="6"
              />
            </div>

            @if (error()) {
              <div class="error-msg">{{ error() }}</div>
            }

            <button type="submit" class="submit-btn" [disabled]="loading() || !authForm.valid">
              @if (loading()) {
                <span>Carregando...</span>
              } @else {
                <span>{{ isLoginMode() ? 'Entrar' : 'Cadastrar' }}</span>
              }
            </button>
          </form>

          <div class="toggle-mode">
            <p>
              {{ isLoginMode() ? 'Ainda não tem conta?' : 'Já possui conta?' }}
              <button type="button" class="btn-link" (click)="toggleMode()">
                {{ isLoginMode() ? 'Criar Conta' : 'Fazer Login' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    .auth-wrapper {
      display: flex;
      height: 100vh;
      width: 100%;
      overflow: hidden;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .description-side {
      flex: 1.2;
      background: linear-gradient(135deg, #0056b3, #007bff);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem;
      position: relative;
    }
    .description-side::before {
      content: '❄️';
      position: absolute;
      font-size: 20rem;
      opacity: 0.05;
      right: -5rem;
      top: -5rem;
    }
    .description-content {
      max-width: 500px;
      z-index: 1;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2.5rem;
    }
    .logo-icon { font-size: 2.5rem; }
    .logo h1 { font-size: 1.8rem; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
    .description-content h2 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; margin-bottom: 1.5rem; }
    .description-content p { font-size: 1.1rem; line-height: 1.6; color: rgba(255,255,255,0.9); margin-bottom: 2rem; }
    .features { list-style: none; padding: 0; margin: 0; }
    .features li { margin-bottom: 0.75rem; font-weight: 500; font-size: 1rem; }

    .form-side {
      flex: 1;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .form-container {
      width: 100%;
      max-width: 400px;
    }
    .form-header {
      margin-bottom: 2.5rem;
    }
    .form-header h3 { font-size: 1.75rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem; }
    .form-header p { color: #666; font-size: 0.95rem; }

    .field { margin-bottom: 1.25rem; }
    .field label { display: block; color: #444; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; }
    .field input {
      width: 100%; padding: 0.85rem 1rem; border-radius: 8px;
      border: 1px solid #ddd; background: #fdfdfd;
      color: #333; font-size: 1rem; outline: none; transition: border 0.2s, box-shadow 0.2s; box-sizing: border-box;
    }
    .field input:focus { border-color: #007bff; box-shadow: 0 0 0 4px rgba(0,123,255,0.1); }
    .field input::placeholder { color: #aaa; }

    .submit-btn {
      width: 100%; padding: 1rem; margin-top: 1rem;
      background: #007bff; color: #fff; border: none; border-radius: 8px;
      font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s;
    }
    .submit-btn:disabled { background: #ccc; cursor: not-allowed; }
    .submit-btn:hover:not(:disabled) { background: #0056b3; }

    .error-msg {
      background: #fff5f5; border: 1px solid #feb2b2;
      color: #c53030; border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; margin-bottom: 1rem;
    }

    .toggle-mode { text-align: center; margin-top: 2rem; }
    .toggle-mode p { color: #666; font-size: 0.9rem; }
    .btn-link {
      background: none; border: none; color: #007bff; font-size: 0.9rem;
      font-weight: 600; cursor: pointer; padding: 0; margin-left: 0.25rem;
    }
    .btn-link:hover { text-decoration: underline; }

    @media (max-width: 900px) {
      .description-side { display: none; }
    }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  isLoginMode = signal(true);

  constructor(private authService: AuthService) {}

  toggleMode() {
    this.isLoginMode.update(v => !v);
    this.error.set('');
  }

  async onSubmit() {
    this.loading.set(true);
    this.error.set('');
    try {
      if (this.isLoginMode()) {
        await this.authService.login(this.email, this.password);
      } else {
        await this.authService.signUp(this.email, this.password);
      }
    } catch (err: any) {
      this.error.set(err?.message || 'Erro ao processar solicitação. Verifique os dados.');
    } finally {
      this.loading.set(false);
    }
  }
}
