import { Routes } from '@angular/router';
import { ExtratoComponent } from './screens/extrato/extrato.component';
import { HomeComponent } from './screens/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'cartoes/:codigo',
    component: ExtratoComponent,
  },
];
