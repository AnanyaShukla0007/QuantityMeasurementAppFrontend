import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { QuantityService } from '../../services/quantity.service';
import { ToastService } from '../../services/toast.service';
import { OperationHistory } from '../../models/models';

type AuthMode = 'signin' | 'signup';
type HistoryFilter = 'all' | 'length' | 'weight' | 'volume' | 'temperature';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, RouterLink],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  auth = inject(AuthService);
  private quantityService = inject(QuantityService);
  private toast = inject(ToastService);
  private router = inject(Router);

  // ───────────────── AUTH ─────────────────
  authMode: AuthMode = 'signin';
  authLoading = false;
  formUsername = '';
  formPassword = '';
  formError = '';

  // ───────────────── HISTORY ─────────────────
  historyLoading = false;
  allHistory: OperationHistory[] = [];
  filteredHistory: OperationHistory[] = [];
  activeFilter: HistoryFilter = 'all';
  totalCount = 0;
  showErrored = false;

  // ───────────────── ICONS ─────────────────
  catIcons: Record<string, string> = {
    length: '📏',
    weight: '⚖️',
    volume: '🧪',
    temperature: '🌡️'
  };

  opLabels: Record<string, string> = {
    CONVERT: 'Convert',
    ADD: 'Add',
    SUBTRACT: 'Subtract',
    DIVIDE: 'Divide',
    COMPARE: 'Equality'
  };

  filters: { key: HistoryFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'length', label: '📏 Length' },
    { key: 'weight', label: '⚖️ Weight' },
    { key: 'volume', label: '🧪 Volume' },
    { key: 'temperature', label: '🌡️ Temperature' }
  ];

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.loadHistory();
    }
  }

  // 🔴 GOOGLE LOGIN (ADDED — THIS WAS MISSING)
  loginWithGoogle() {
    window.location.href = 'https://localhost:5001/api/v1/auth/google-login';
  }

  // ───────────────── HELPERS ─────────────────
  getCategoryIcon(category?: string): string {
    if (!category) return '📐';
    return this.catIcons[category.toLowerCase()] ?? '📐';
  }

  switchMode(mode: AuthMode) {
    this.authMode = mode;
    this.formError = '';
  }

  // ───────────────── AUTH FLOW ─────────────────
  handleAuth() {
    this.formError = '';

    if (!this.formUsername || !this.formPassword) {
      this.formError = 'Please fill in all fields.';
      return;
    }

    if (this.formPassword.length < 6) {
      this.formError = 'Password must be at least 6 characters.';
      return;
    }

    this.authLoading = true;

    if (this.authMode === 'signup') {
      this.auth.register({
        username: this.formUsername,
        password: this.formPassword,
        role: 'Admin'
      }).subscribe({
        next: () => {
          this.auth.login({
            username: this.formUsername,
            password: this.formPassword
          }).subscribe({
            next: () => {
              this.authLoading = false;
              this.toast.show(`Welcome, ${this.formUsername}!`, 'success');
              this.loadHistory();
            },
            error: err => {
              this.authLoading = false;
              this.formError =
                err?.error?.message ||
                'Registered, but login failed.';
            }
          });
        },
        error: err => {
          this.authLoading = false;
          this.formError =
            (typeof err?.error === 'string' ? err.error : null) ||
            err?.error?.message ||
            'Registration failed.';
        }
      });
    } else {
      this.auth.login({
        username: this.formUsername,
        password: this.formPassword
      }).subscribe({
        next: () => {
          this.authLoading = false;
          this.toast.show('Welcome back!', 'success');
          this.loadHistory();
        },
        error: err => {
          this.authLoading = false;
          const body = err?.error;
          this.formError =
            (typeof body === 'string' ? body : null) ||
            body?.message ||
            'Invalid username or password.';
        }
      });
    }
  }

  // ───────────────── HISTORY ─────────────────
  loadHistory() {
    this.historyLoading = true;

    this.quantityService.getHistory().subscribe({
      next: data => {
        this.allHistory = Array.isArray(data) ? data : [];
        this.applyFilter(this.activeFilter);
        this.historyLoading = false;
      },
      error: err => {
        this.historyLoading = false;

        if (err?.status === 401 || err?.status === 403) {
          this.toast.show('Session expired.', 'error');
          this.auth.logout();
        } else {
          this.toast.show('Failed to load history', 'error');
        }
      }
    });

    this.quantityService.getCount().subscribe({
      next: count => this.totalCount = count ?? 0
    });
  }

  applyFilter(filter: HistoryFilter) {
    this.activeFilter = filter;
    this.showErrored = false;

    const valid = this.allHistory.filter(h => !h.errorMessage);

    if (filter === 'all') {
      this.filteredHistory = valid;
    } else {
      this.filteredHistory = valid.filter(
        h => h.measurementCategory?.toLowerCase() === filter
      );
    }
  }

  loadErrored() {
    this.showErrored = true;
    this.historyLoading = true;

    this.quantityService.getErroredHistory().subscribe({
      next: data => {
        this.filteredHistory = Array.isArray(data) ? data : [];
        this.historyLoading = false;
      },
      error: () => {
        this.historyLoading = false;
        this.toast.show('Failed to load errored ops', 'error');
      }
    });
  }

  logout() {
    this.auth.logout();
    this.toast.show('Logged out', 'info');

    this.allHistory = [];
    this.filteredHistory = [];

    this.formUsername = '';
    this.formPassword = '';
    this.authMode = 'signin';
  }

  // ───────────────── FORMATTERS ─────────────────
  formatResult(item: OperationHistory): string {
    if (item.errorMessage) return '✗ Error';

    if (item.resultValue !== null && item.resultValue !== undefined) {
      const val = parseFloat(item.resultValue.toFixed(6));
      return item.resultUnit ? `${val} ${item.resultUnit}` : `${val}`;
    }

    return '—';
  }

  formatEquation(item: OperationHistory): string {
    const u1 = item.operand1Unit || '';
    const v1 = item.operand1Value;

    const sym: Record<string, string> = {
      ADD: '+',
      SUBTRACT: '−',
      DIVIDE: '÷',
      COMPARE: '=?',
      CONVERT: '→'
    };

    if (
      item.operand2Value !== undefined &&
      item.operand2Value !== null &&
      item.operationType !== 'CONVERT'
    ) {
      const u2 = item.operand2Unit || '';
      const v2 = item.operand2Value;

      return `${v1} ${u1} ${sym[item.operationType] ?? item.operationType} ${v2} ${u2}`;
    }

    return `${v1} ${u1} → ${item.resultUnit || ''}`;
  }

  goCalc() {
    this.router.navigate(['/calculator']);
  }
}