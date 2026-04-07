import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const icons = { success: '✓', error: '✗', info: 'ℹ' };
    const toast: Toast = { id: this.nextId++, message, type, icon: icons[type] };
    this.toasts.update(t => [...t, toast]);
    setTimeout(() => this.remove(toast.id), 3000);
  }

  remove(id: number): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
