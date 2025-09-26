import { FormaPagamento } from './forma-pagamento';
import { TipoItemExtrato } from './tipo-item-extrato';

export type ItemExtrato = {
  id: number;
  data: Date;
  usuario: string;
  tipo: TipoItemExtrato;
  descricao: string;
  dataCancelamento?: Date;
  usuarioCancelamento?: string;
  valor: number;
  formaPagamento?: FormaPagamento;
  valorRecebido?: number;
  troco?: number;
  codigoCancelamento?: string;
};
