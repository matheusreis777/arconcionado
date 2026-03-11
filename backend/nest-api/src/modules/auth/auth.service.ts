import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  async login(loginDto: LoginDto) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: loginDto.email,
        password: loginDto.password,
      });

    if (error || !data.session) {
      throw new UnauthorizedException(error?.message || 'Invalid credentials');
    }

    return {
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
      user: data.user,
    };
  }

  async logout(token: string) {
    await this.supabase.getClient().auth.signOut();
    return { message: 'Logged out successfully' };
  }

  async validateToken(token: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid token');
    }

    return data.user;
  }
}
