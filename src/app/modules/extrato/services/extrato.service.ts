import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Extrato } from '../types/extrato';

@Injectable({
  providedIn: 'root',
})
export class ExtratoService {
  constructor(
    private readonly _http: HttpClient,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
  ) { }

  consultar(cartao: string): Observable<Extrato | null> {
    const url =
      `/data/cartoes/${cartao}/extrato`
      ;

    return this._http.get<Extrato>(url).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return of(null);
        }
        return throwError(() => new Error('Erro ao consultar o extrato do cartão'));
      }),
    );
  }
}
