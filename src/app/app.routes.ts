import { Routes } from "@angular/router";
import { CardapioComponent } from "./screens/cardapio/cardapio.component";
import { ExtratoComponent } from "./screens/extrato/extrato.component";
import { HomeComponent } from "./screens/home/home.component";
import { uuidParamGuard } from "./guards/uuid-param.guard";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "cartoes/:codigo",
    component: ExtratoComponent,
    canMatch: [uuidParamGuard(1)],
  },
  {
    path: "cardapios/:chave",
    component: CardapioComponent,
    canMatch: [uuidParamGuard(1)],
  },
];
