import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InviteService, Convite } from '../../core/services/invite.service';

@Component({
  selector: 'app-invite-collaborator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invite-collaborator.component.html',
  styleUrl: './invite-collaborator.component.scss',
})
export class InviteCollaboratorComponent implements OnInit {
  inviteService = inject(InviteService);

  email = '';
  loading = signal(false);
  error = signal('');
  successUrl = signal('');
  copied = signal(false);

  async ngOnInit() {
    await this.inviteService.loadCompanyInvites();
  }

  async sendInvite() {
    if (!this.email.trim()) {
      this.error.set('Informe um e-mail válido.');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.successUrl.set('');

    try {
      const { inviteUrl } = await this.inviteService.createInvite(this.email);
      this.successUrl.set(inviteUrl);
      this.email = '';
    } catch (err: any) {
      this.error.set(err?.message || 'Erro ao criar convite. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }

  async copyLink() {
    if (!this.successUrl()) return;
    try {
      await navigator.clipboard.writeText(this.successUrl());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      this.copied.set(false);
    }
  }

  async cancelInvite(id: string) {
    try {
      await this.inviteService.cancelInvite(id);
    } catch (err: any) {

    }
  }

  statusLabel(status: string): string {
    return { pendente: 'Pendente', aceito: 'Aceito', expirado: 'Expirado' }[status] ?? status;
  }

  isExpired(invite: Convite): boolean {
    return new Date(invite.expira_em) < new Date();
  }
}
