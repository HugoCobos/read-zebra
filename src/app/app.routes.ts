import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component'),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders-page/orders-page.component'),
    data: { label: 'ESCANEAR PRODUCTOS', icon: 'bi-upc-scan' },
  },
  {
    path: 'delivery',
    loadComponent: () =>
      import('./pages/delivery-page/delivery-page.component'),
    data: { label: 'DESCARGAR RESULTADOS', icon: 'bi-file-earmark-arrow-down' },
  },
  {
    path: 'files',
    loadComponent: () => import('./pages/files-page/files-page.component'),
    //data: { label: 'CARGAR ARCHIVOS', icon: 'bi-file-earmark-arrow-up' },
    data: { label: 'CARGAR ARCHIVOS', icon: 'bi-file-earmark-arrow-up' },
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
