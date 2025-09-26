import { Routes } from '@angular/router';
import { extratoResolver } from './modules/extrato/resolvers/extrato.resolver';

export const routes: Routes = [
  {
    path: 'cartoes/:cartao',
    loadComponent: () =>
      import('./screens/extrato/extrato.component').then((m) => m.ExtratoComponent),
    resolve: {
      extrato: extratoResolver,
    },
  },
];
