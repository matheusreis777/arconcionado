import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-company-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-setup.component.html',
  styleUrl: './company-setup.component.scss',
})
export class CompanySetupComponent {
  authService = inject(AuthService);

  loading = signal(false);
  error = signal('');
  step = signal(1); // 1 = form, 2 = success (optional)

  formData = {
    nome: '',
    cnpj: '',
    telefone: '',
    endereco: '',
  };

  get currentUser() {
    return this.authService.currentUser();
  }

  formatCNPJ(value: string): string {
    return value
      .replace(/\D/g, '')
      .slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  onCNPJInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.cnpj = this.formatCNPJ(input.value);
    input.value = this.formData.cnpj;
  }

  formatPhone(value: string): string {
    return value
      .replace(/\D/g, '')
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.formData.telefone = this.formatPhone(input.value);
    input.value = this.formData.telefone;
  }

  async submit() {
    if (!this.formData.nome.trim()) {
      this.error.set('O nome da empresa é obrigatório.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.authService.registerCompany({
        nome: this.formData.nome.trim(),
        cnpj: this.formData.cnpj || undefined,
        telefone: this.formData.telefone || undefined,
        endereco: this.formData.endereco || undefined,
      });
      // Navigation is handled inside registerCompany
    } catch (err: any) {

      this.error.set(
        err?.message?.includes('duplicate')
          ? 'Este CNPJ já está cadastrado no sistema.'
          : 'Erro ao cadastrar empresa. Verifique os dados e tente novamente.'
      );
    } finally {
      this.loading.set(false);
    }
  }
}
