import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
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
