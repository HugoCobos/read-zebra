import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component'),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders-page/orders-page.component'),
    data: { label: 'ORDENES', icon: 'bi-send' },
  },
  {
    path: 'delivery',
    loadComponent: () =>
      import('./pages/delivery-page/delivery-page.component'),
    data: { label: 'ENTREGAS', icon: 'bi-truck' },
  },
  {
    path: 'files',
    loadComponent: () => import('./pages/files-page/files-page.component'),
    data: { label: 'ARCHIVOS', icon: 'bi-file-earmark' },
  },
  // {
  //   path: 'assorted',
  //   loadComponent: () =>
  //     import('./pages/assorted-page/assorted-page.component'),
  //   data: { label: 'SURTIDAS', icon: 'bi-calendar3' },
  // },
  {
    path: '**',
    redirectTo: '',
  },
];
