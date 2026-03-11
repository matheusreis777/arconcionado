import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './developer.component.html',
  styleUrl: './developer.component.scss'
})
export class DeveloperComponent {
  auth = inject(AuthService);
  router = inject(Router);

  logout() {
    this.auth.logout();
  }
}
