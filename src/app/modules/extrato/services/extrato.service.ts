import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, pipe, tap, throwError } from 'rxjs';
import { Extrato } from '../types/extrato';

@Injectable({
  providedIn: 'root',
})
export class ExtratoService {
  constructor(private readonly _http: HttpClient) {}

  consultar(cartao: string): Observable<Extrato | null> {
    return this._http.get<Extrato>(`v1/cartoes/${cartao}/extrato-publico`).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(null);
        }
        return throwError(() => new Error('Erro ao consultar o extrato do cartão'));
      })
    );
  }
}
