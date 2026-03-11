import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum ServiceOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateServiceOrderDto {
  @IsString()
  clientId: string;

  @IsString()
  equipmentId: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsEnum(ServiceOrderStatus)
  status?: ServiceOrderStatus;
}
