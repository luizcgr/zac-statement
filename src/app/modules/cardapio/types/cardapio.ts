import { Patrocinador } from "../../extrato/types/patrocinador";

export type Cardapio = {
  evento: String;
  patrocinadores: Patrocinador[];
  itens: {
    terminal: string;
    produtos: {
      nome: string;
      valor: number;
    }[];
  }[];
};
