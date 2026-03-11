import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-equipments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="padding:2rem;background:#0f1117;min-height:100vh;color:#fff;">
      <h2>🌡️ Equipamentos</h2>
      <p style="color:rgba(255,255,255,0.5)">Gerenciamento de equipamentos de ar-condicionado.</p>
      <a routerLink="/dashboard" style="color:#00c9a7">← Voltar ao Dashboard</a>
    </div>
  `,
})
export class EquipmentsComponent {}
