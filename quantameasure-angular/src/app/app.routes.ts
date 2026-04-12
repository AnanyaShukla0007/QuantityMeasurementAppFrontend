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
  { path: '**', redirectTo: '' }
];
