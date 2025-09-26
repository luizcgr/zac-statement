export type Evento = {
  id: number;
  nome: string;
  inicio: Date;
  fim: Date;
  ativo: boolean;
  modoDebito: boolean;
  pausado?: boolean;
  urlCardapio?: string;
};
