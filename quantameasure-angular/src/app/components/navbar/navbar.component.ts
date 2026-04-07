import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav [class.scrolled]="scrolled">
      <a class="nav-logo" routerLink="/">
        <div class="nav-logo-icon">⚡</div>
        QuantaMeasure
      </a>

      <div class="nav-links">
        <a class="nav-link" routerLink="/history" routerLinkActive="active">History</a>
      </div>

      <div class="nav-actions">
        @if (auth.isLoggedIn()) {
          <span class="nav-user">
            <span class="nav-avatar">{{ auth.currentUser()?.name?.[0]?.toUpperCase() }}</span>
            {{ auth.currentUser()?.name }}
          </span>
          <button class="btn-ghost" (click)="logout()">Log out</button>
        } @else {
          <a class="btn-ghost" routerLink="/history">Sign In</a>
          <a class="btn-primary" routerLink="/calculator">Get Started</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 40px; height: 68px;
      background: rgba(7,9,15,0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
      transition: background 0.3s var(--transition);
      &.scrolled { background: rgba(7,9,15,0.97); }
    }
    .nav-logo {
      display: flex; align-items: center; gap: 10px;
      font-family: var(--font-display); font-weight: 700; font-size: 1.2rem;
      cursor: pointer; color: var(--text); text-decoration: none;
    }
    .nav-logo-icon {
      width: 36px; height: 36px;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px;
    }
    .nav-links { display: flex; align-items: center; gap: 8px; }
    .nav-link {
      padding: 8px 18px; border-radius: 8px;
      font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
      color: var(--muted); cursor: pointer; transition: all 0.2s;
      text-decoration: none;
      &:hover { color: var(--text); background: rgba(255,255,255,0.05); }
      &.active { color: var(--accent); }
    }
    .nav-actions { display: flex; gap: 10px; align-items: center; }
    .btn-ghost {
      padding: 9px 20px; border-radius: 10px; font-size: 0.875rem; font-weight: 500;
      background: none; border: 1px solid var(--border); color: var(--text);
      cursor: pointer; transition: all 0.2s; text-decoration: none;
      &:hover { border-color: var(--accent); color: var(--accent); }
    }
    .btn-primary {
      padding: 9px 22px; border-radius: 10px; font-size: 0.875rem; font-weight: 600;
      background: var(--accent); border: none; color: #000; cursor: pointer;
      transition: all 0.2s; text-decoration: none;
      &:hover { background: #7dd3fc; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(56,189,248,0.3); }
    }
    .nav-user {
      display: flex; align-items: center; gap: 8px;
      font-size: 0.875rem; color: var(--text);
    }
    .nav-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      display: flex; align-items: center; justify-content: center;
      font-size: 0.78rem; font-weight: 700; color: #000;
    }
    @media (max-width: 768px) {
      nav { padding: 0 20px; }
      .nav-user span:last-child { display: none; }
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  scrolled = false;

  @HostListener('window:scroll')
  onScroll() { this.scrolled = window.scrollY > 10; }

  logout() {
    this.auth.logout();
    this.toast.show('Logged out successfully', 'info');
    this.router.navigate(['/']);
  }
}
