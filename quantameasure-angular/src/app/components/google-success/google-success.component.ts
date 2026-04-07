import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-google-success',
  template: `<p>Signing in...</p>`
})
export class GoogleSuccessComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        this.auth.saveSession({ token }, 'GoogleUser');
        this.router.navigate(['/history']); // 🔴 CRITICAL FIX
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}