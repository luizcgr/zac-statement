import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Cardapio } from "../types/cardapio";

@Injectable({ providedIn: "root" })
export class CardapioService {
  constructor(private readonly _http: HttpClient) {}

  consultar(eventoId: number): Observable<Cardapio> {
    return this._http.get<Cardapio>(`v1/cardapio/${eventoId}`);
  }
}
