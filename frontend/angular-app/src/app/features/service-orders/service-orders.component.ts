import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-service-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './service-orders.component.html',
  styleUrl: './service-orders.component.scss'
})
export class ServiceOrdersComponent {}
