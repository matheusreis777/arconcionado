import { Module } from '@nestjs/common';
import { EquipmentsController } from './equipments.controller';
import { EquipmentsService } from './equipments.service';
import { SupabaseService } from '../../database/supabase.service';

@Module({
  controllers: [EquipmentsController],
  providers: [EquipmentsService, SupabaseService],
})
export class EquipmentsModule {}
