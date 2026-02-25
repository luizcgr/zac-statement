export type Cardapio = {
  evento: String;
  itens: {
    terminal: string;
    produtos: {
      nome: string;
      valor: number;
    }[];
  }[];
};
