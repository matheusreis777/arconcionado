import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class ClientsService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from('clients')
      .insert(dto)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('clients')
      .select('*');
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from('clients')
      .update(dto)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('clients')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return { message: 'Client deleted' };
  }
}
