import { StatusPedido } from './status-pedido';

export type Pedido = {
    id: number;
    numero: number;
    nome: string;
    data: Date;
    status: StatusPedido;
    observacoes?: string;
    produtos: { id: number; nome: string; quantidade: number }[];
};
