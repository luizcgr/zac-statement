import { Evento } from './evento';
import { ItemExtrato } from './item-extrato';
import { Pedido } from './pedido';

export type Extrato = {
  codigo: string;
  saldo: number;
  emUso: boolean;
  evento: Evento;
  historico: ItemExtrato[];
  pedidos: Pedido[];
};
