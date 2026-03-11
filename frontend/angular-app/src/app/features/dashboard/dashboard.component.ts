import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);

  get company()   { return this.auth.userCompany(); }
  get isAdmin()   { return this.auth.hasRole('admin'); }

  get userName(): string {
    const meta = (this.auth.currentUser()?.user_metadata as any);
    return meta?.nome ?? meta?.name ?? this.auth.currentUser()?.email ?? 'Usuário';
  }

  async ngOnInit() {
    if (!this.company) {
      await this.auth.fetchUserCompany();
    }
  }
}
