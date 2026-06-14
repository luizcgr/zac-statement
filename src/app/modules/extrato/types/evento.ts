import { Patrocinador } from "./patrocinador";

export type Evento = {
  id: number;
  nome: string;
  chave: string;
  patrocinadores: Patrocinador[];
};
