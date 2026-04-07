import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'calculator',
    loadComponent: () =>
      import('./components/calculator/calculator.component').then(m => m.CalculatorComponent)
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./components/history/history.component').then(m => m.HistoryComponent)
  },
  {
    path: 'google-success',
    loadComponent: () =>
      import('./components/google-success/google-success.component')
        .then(m => m.GoogleSuccessComponent)
  },
  { path: '**', redirectTo: '' } // LAST ONLY
];