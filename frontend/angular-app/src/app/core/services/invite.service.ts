import { Injectable, inject, signal } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Convite {
  id: string;
  empresa_id: string;
  email: string;
  token: string;
  status: 'pendente' | 'aceito' | 'expirado';
  criado_em: string;
  expira_em: string;
  empresas?: { nome: string };
}

@Injectable({ providedIn: 'root' })
export class InviteService {
  private supabase: SupabaseClient;
  private authService = inject(AuthService);

  convites = signal<Convite[]>([]);
  loading = signal(false);

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );
  }

  /** Admin: busca todos os convites da empresa atual */
  async loadCompanyInvites(): Promise<void> {
    const company = this.authService.userCompany();
    if (!company) return;

    this.loading.set(true);
    const { data, error } = await this.supabase
      .from('convites')
      .select('*')
      .eq('empresa_id', company.id)
      .order('criado_em', { ascending: false });

    this.loading.set(false);

    if (error) {

      return;
    }

    this.convites.set(data ?? []);
  }

  /** Admin: cria um convite para um e-mail */
  async createInvite(email: string): Promise<{ inviteUrl: string }> {
    const company = this.authService.userCompany();
    if (!company) throw new Error('Empresa não encontrada');


    const { data, error } = await this.supabase
      .from('convites')
      .insert({
        empresa_id: company.id,
        email: email.toLowerCase().trim(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Já existe um convite pendente para este e-mail.');
      }
      throw error;
    }

    await this.loadCompanyInvites();

    const inviteUrl = `${window.location.origin}/login?invite=${data.token}`;
    return { inviteUrl };
  }

  /** Admin: cancela / remove um convite */
  async cancelInvite(inviteId: string): Promise<void> {
    const { error } = await this.supabase
      .from('convites')
      .delete()
      .eq('id', inviteId);

    if (error) throw error;
    await this.loadCompanyInvites();
  }

  /** Funcionário: verifica se há convite pendente para o e-mail do usuário logado */
  async checkPendingInvite(): Promise<Convite | null> {
    const user = this.authService.currentUser();
    if (!user?.email) return null;

    const { data, error } = await this.supabase
      .from('convites')
      .select('*, empresas(nome)')
      .eq('email', user.email.toLowerCase())
      .eq('status', 'pendente')
      .maybeSingle();

    if (error) {

      return null;
    }

    return data ?? null;
  }

  /** Funcionário: aceita o convite e vincula à empresa */
  async acceptInvite(invite: Convite): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) throw new Error('Usuário não autenticado');

    // 1. Vincular à empresa
    const { error: linkError } = await this.supabase
      .from('usuarios_empresas')
      .insert({
        usuario_id: user.id,
        empresa_id: invite.empresa_id,
      });

    if (linkError && linkError.code !== '23505') {
      // ignora duplicata (já vinculado)
      throw linkError;
    }

    // 2. Marcar convite como aceito
    const { error: updateError } = await this.supabase
      .from('convites')
      .update({ status: 'aceito', aceito_por: user.id })
      .eq('id', invite.id);

    if (updateError) {

      // não bloqueia — o vínculo já foi feito
    }

  }
}
