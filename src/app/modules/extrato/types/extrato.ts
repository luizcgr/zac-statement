import { Evento } from './evento';
import { ItemExtrato } from './item-extrato';

export type Extrato = {
  cartaoId: number;
  codigo: string;
  saldo: number;
  dataLiberacao: Date;
  inativacao: Date;
  usuarioInativacao?: string;
  ativo: boolean;
  emUso: boolean;
  usuario: string;
  data: Date;
  evento: Evento;
  historico: ItemExtrato[];
  tag?: string;
  recargaUnica: boolean;
};
