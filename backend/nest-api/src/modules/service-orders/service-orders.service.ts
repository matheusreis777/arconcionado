import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import { CreateServiceOrderDto } from './dto/create-service-order.dto';
import { UpdateServiceOrderDto } from './dto/update-service-order.dto';

@Injectable()
export class ServiceOrdersService {
  constructor(private supabase: SupabaseService) {}

  async create(dto: CreateServiceOrderDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('service_orders')
      .insert(dto)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('service_orders')
      .select('*, clients(*), equipments(*)');

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findOne(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('service_orders')
      .select('*, clients(*), equipments(*)')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException('Service order not found');
    return data;
  }

  async update(id: string, dto: UpdateServiceOrderDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('service_orders')
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
      .from('service_orders')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { message: 'Service order deleted successfully' };
  }
}
