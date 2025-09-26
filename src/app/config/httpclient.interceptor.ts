import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, Observable } from 'rxjs';
import { TokenService } from '../modules/autenticacao/services/token.serivce';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
  constructor(private _tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestUrl = `${environment.apiUrl}/${req.url}`;
    if (req.url === 'v1/login/refresh-token' || req.url === 'v1/login/credenciais') {
      req = req.clone({
        url: requestUrl,
        setHeaders: {
          'x-app-origin': 'extrato',
        },
      });
      return next.handle(req);
    }
    return this._tokenService.get().pipe(
      concatMap((token) => {
        req = req.clone({
          url: requestUrl,
          setHeaders: {
            Authorization: token ? `Bearer ${token.value}` : '',
            'x-app-origin': 'extrato',
          },
        });
        return next.handle(req);
      })
    );
  }
}
