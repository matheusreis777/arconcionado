import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { InviteService } from '../../../core/services/invite.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-selection.component.html',
  styleUrl: './role-selection.component.scss',
})
export class RoleSelectionComponent {
  authService = inject(AuthService);
  inviteService = inject(InviteService);
  router = inject(Router);

  loading = false;
  error = '';

  // Mensagem especial para funcionário sem convite
  noInviteMessage = signal('');

  roles = [
    {
      name: 'admin',
      title: 'Administrador',
      description: 'Gestão total de equipamentos, clientes e ordens de serviço.',
    },
    {
      name: 'funcionario',
      title: 'Técnico / Funcionário',
      description: 'Execução de ordens de serviço e manutenção de equipamentos.',
    },
    {
      name: 'cliente',
      title: 'Cliente Final',
      description: 'Acompanhamento de OS, histórico de manutenções e perfil.',
    },
  ];

  async selectRole(roleName: string) {
    this.loading = true;
    this.error = '';
    this.noInviteMessage.set('');

    try {
      // Funcionário: verificar convite pendente antes de atribuir role
      if (roleName === 'funcionario') {
        const invite = await this.inviteService.checkPendingInvite();

        if (!invite) {
          this.noInviteMessage.set(
            'Você precisa de um convite de uma empresa para acessar como Técnico/Funcionário. ' +
            'Solicite o convite ao administrador da empresa.'
          );
          return;
        }

        // Atribui a role primeiro
        await this.authService.assignInitialRole(roleName);

        // Aceita o convite e vincula à empresa
        await this.inviteService.acceptInvite(invite);

        // Redireciona para dashboard
        this.router.navigate(['/dashboard']);
        return;
      }

      // Admin e Cliente: fluxo normal
      await this.authService.assignInitialRole(roleName);
    } catch (err: any) {
      this.error = 'Erro ao vincular cargo. Tente novamente.';

    } finally {
      this.loading = false;
    }
  }
}
