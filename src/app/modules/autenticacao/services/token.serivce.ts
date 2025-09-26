import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, defer, iif, Observable, of } from 'rxjs';
import { Token } from '../types/token';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private _token: Token | null = null;

  constructor(private readonly _http: HttpClient) {}

  get(): Observable<Token | null> {
    const novoToken$ = this._carregarTokenDoServidor();
    const tokenAtivo$ = of(this._token);
    return iif(() => !!this._token && !this._token.expirado, tokenAtivo$, novoToken$);
  }

  private _carregarTokenDoServidor(): Observable<Token | null> {
    return defer(() => {
      const email = environment.user;
      const senha = environment.pass;
      return this._http.post(
        'v1/login/credenciais',
        { email, senha },
        { headers: { 'x-app-origin': 'extrato' } }
      );
    }).pipe(
      concatMap((response) => {
        const accessToken = (response as any).accessToken;
        const expiration = new Date((response as any).expiration);
        const token = new Token(accessToken, expiration);
        return of(token);
      })
    );
  }
}
