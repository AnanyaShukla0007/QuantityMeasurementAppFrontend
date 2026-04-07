import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'qm_token';
  private readonly USER_KEY  = 'qm_user';

  isLoggedIn  = signal<boolean>(false);
  currentUser = signal<{ name: string } | null>(null);

  constructor(private http: HttpClient) {
    this.restoreSession();
  }

  private restoreSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user  = localStorage.getItem(this.USER_KEY);

    if (token && user) {
      try {
        this.currentUser.set(JSON.parse(user));
        this.isLoggedIn.set(true);
      } catch {
        this.clearSession();
      }
    }
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/v1/auth/register`, data, { responseType: 'text' })
      .pipe(catchError(err => throwError(() => err)));
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/v1/auth/login`, data)
      .pipe(
        tap(res => this.saveSession(res, data.username)),
        catchError(err => throwError(() => err))
      );
  }

  // 🔴 FIX: MADE PUBLIC
  saveSession(res: AuthResponse, username: string): void {
    localStorage.setItem(this.TOKEN_KEY, res.token);

    const user = { name: username };
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    this.currentUser.set(user);
    this.isLoggedIn.set(true);
  }

  logout(): void {
    this.clearSession();
  }

  private clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}