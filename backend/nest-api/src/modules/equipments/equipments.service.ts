import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';

@Injectable()
export class EquipmentsService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from('equipments')
      .insert(dto)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('equipments')
      .select('*');
    if (error) throw new Error(error.message);
    return data || [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('equipments')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  }

  async update(id: string, dto: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from('equipments')
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
      .from('equipments')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    return { message: 'Equipment deleted' };
  }
}
