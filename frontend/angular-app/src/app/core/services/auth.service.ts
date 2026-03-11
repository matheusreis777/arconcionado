import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private supabase: SupabaseClient;
  currentUser = signal<User | null>(null);
  userRoles = signal<string[]>([]);
  userCompany = signal<any | null>(null);

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseAnonKey
    );

    // Conectando os eventos de forma mais eficiente
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;
      const currentUser = this.currentUser();
      
      // Se o usuário mudou (ou logou), buscamos os roles
      if (user && user.id !== currentUser?.id) {
        this.currentUser.set(user);
        
        await this.fetchUserRoles(user.id);
      } else if (!user) {
        this.currentUser.set(null);
        this.userRoles.set([]);
      }
    });

    // Initialize session check
    this.initSession();
  }

  private async initSession() {
    
    const { data } = await this.supabase.auth.getSession();
    const user = data.session?.user ?? null;
    this.currentUser.set(user);
    if (user) {
      await this.fetchUserRoles(user.id);
    }
  }

  private async fetchUserRoles(userId: string) {
    if (!userId) return;
    
    // Timeout safeguard to prevent hanging the whole app
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Supabase query timeout (5s)')), 5000)
    );

    try {
      // Usando Promise.race para não travar se o Supabase não responder
      await Promise.race([
        (async () => {
          // Step 1: Mapping
          const { data: mappingData, error: mappingError } = await this.supabase
            .from('usuarios_roles')
            .select('role_id')
            .eq('usuario_id', userId);

          if (mappingError) {
            return;
          }

          if (!mappingData || mappingData.length === 0) {

            this.userRoles.set([]);
            return;
          }

          const roleIds = mappingData.map(m => m.role_id);

          // Step 2: Names
          const { data: rolesData, error: rolesError } = await this.supabase
            .from('roles')
            .select('nome')
            .in('id', roleIds);

          if (rolesError) {

            return;
          }

          const roles = rolesData?.map(r => r.nome) || [];
          this.userRoles.set(roles);
        })(),
        timeout
      ]);
    } catch (err: any) {

      // Fallback: Default to empty roles if it fails, so it doesn't hang the app
      this.userRoles.set([]);
    }
  }

  private async redirectBasedOnRole() {
    const roles = this.userRoles();
    
    if (roles.length === 0) {
      this.router.navigate(['/role-selection']);
      return;
    }

    if (roles.includes('desenvolvedor')) {
      this.router.navigate(['/developer']);
      return;
    }

    // Admins must have a company linked before accessing the dashboard
    if (roles.includes('admin')) {
      await this.fetchUserCompany();
      if (!this.userCompany()) {
        this.router.navigate(['/company-setup']);
        return;
      }
    }

    this.router.navigate(['/dashboard']);
  }

  async fetchUserCompany(): Promise<void> {
    const user = this.currentUser();
    if (!user) return;

    try {
      // Busca a empresa vinculada ao usuário via tabela de junção
      const { data, error } = await this.supabase
        .from('usuarios_empresas')
        .select('empresa_id, empresas(*)')
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (error) {

        this.userCompany.set(null);
        return;
      }

      const company = (data as any)?.empresas ?? null;
      this.userCompany.set(company);
    } catch (err) {

      this.userCompany.set(null);
    }
  }

  async registerCompany(companyData: {
    nome: string;
    cnpj?: string;
    telefone?: string;
    endereco?: string;
  }): Promise<void> {
    const user = this.currentUser();
    if (!user) throw new Error('Usuário não autenticado');


    // 1. Criar a empresa
    const { data: empresa, error: empresaError } = await this.supabase
      .from('empresas')
      .insert({
        ...companyData,
        admin_id: user.id,
      })
      .select()
      .single();

    if (empresaError) {

      throw empresaError;
    }


    // 2. Vincular o admin à empresa via usuarios_empresas
    const { error: linkError } = await this.supabase
      .from('usuarios_empresas')
      .insert({
        usuario_id: user.id,
        empresa_id: empresa.id,
      });

    if (linkError) {

      // Não bloqueia o fluxo — empresa foi criada, vínculo pode ser refeito
      // mas lança para o componente tratar se necessário
      throw linkError;
    }

    this.userCompany.set(empresa);
    this.router.navigate(['/dashboard']);
  }

  async assignInitialRole(roleName: string): Promise<void> {
    const user = this.currentUser();
    if (!user) throw new Error('Usuário não autenticado');

    try {
      // 1. Get role ID
      const { data: roleData, error: roleError } = await this.supabase
        .from('roles')
        .select('id')
        .eq('nome', roleName)
        .single();

      if (roleError) throw roleError;

      // 2. Clear any existing roles just in case (optional safety)
      // 3. Insert into usuarios_roles
      const { error: insertError } = await this.supabase
        .from('usuarios_roles')
        .insert({
          usuario_id: user.id,
          role_id: roleData.id
        });

      if (insertError) throw insertError;
      
      // 4. Update local state and redirect
      await this.fetchUserRoles(user.id);
      this.redirectBasedOnRole();
    } catch (err: any) {

      throw err;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('sb-token');
  }

  async login(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {

      throw error;
    }

    if (data.session && data.user) {
      localStorage.setItem('sb-token', data.session.access_token);
      this.currentUser.set(data.user);
      await this.fetchUserRoles(data.user.id);
      this.redirectBasedOnRole();
    }
  }

  async signUp(email: string, password: string, name?: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: name
        }
      }
    });

    if (error) throw error;

    if (data.session && data.user) {
      localStorage.setItem('sb-token', data.session.access_token);
      this.currentUser.set(data.user);
      await this.fetchUserRoles(data.user.id);
      this.redirectBasedOnRole();
    } else if (data.user) {
      // Handle cases where email confirmation is required
      alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
    }
  }

  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
    localStorage.removeItem('sb-token');
    this.currentUser.set(null);
    this.userRoles.set([]);
    this.userCompany.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: string): boolean {
    return this.userRoles().includes(role);
  }
}
