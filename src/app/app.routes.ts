import { Routes } from "@angular/router";
import { CardapioComponent } from "./screens/cardapio/cardapio.component";
import { ExtratoComponent } from "./screens/extrato/extrato.component";
import { HomeComponent } from "./screens/home/home.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "cartoes/:codigo",
    component: ExtratoComponent,
  },
  {
    path: "cardapios/:eventoId",
    component: CardapioComponent,
  },
];
