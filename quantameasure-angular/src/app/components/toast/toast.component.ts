import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type">
          <span class="toast-icon">{{ toast.icon }}</span>
          <span>{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.remove(toast.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px 18px;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      animation: slideUp 0.4s var(--transition);
      font-family: var(--font-body);
      color: var(--text);
      min-width: 220px;
      &.success { border-color: rgba(52,211,153,0.3); .toast-icon { color: var(--accent3); } }
      &.error   { border-color: rgba(248,113,113,0.3); .toast-icon { color: var(--danger); } }
      &.info    { border-color: rgba(56,189,248,0.3);  .toast-icon { color: var(--accent); } }
    }
    .toast-icon { font-size: 1rem; flex-shrink: 0; }
    .toast-close {
      margin-left: auto; background: none; border: none;
      color: var(--muted); cursor: pointer; font-size: 1.1rem; line-height: 1;
      &:hover { color: var(--text); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
