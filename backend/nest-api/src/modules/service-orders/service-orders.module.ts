import { Module } from '@nestjs/common';
import { ServiceOrdersController } from './service-orders.controller';
import { ServiceOrdersService } from './service-orders.service';
import { SupabaseService } from '../../database/supabase.service';

@Module({
  controllers: [ServiceOrdersController],
  providers: [ServiceOrdersService, SupabaseService],
})
export class ServiceOrdersModule {}
