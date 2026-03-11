import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private supabase: SupabaseService) {}

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*');

    if (error) throw new Error(error.message);
    return data || [];
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .getClient()
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }
}
