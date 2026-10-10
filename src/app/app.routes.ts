import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  { path: 'home', loadComponent: () => import('./home/home.page').then((m) => m.HomePage) },
  { path: 'map', loadComponent: () => import('./map/map.page').then((m) => m.MapPage) },
  { path: 'historique', loadComponent: () => import('./historique/historique.page').then((m) => m.HistoriquePage) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];


