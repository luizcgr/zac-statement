import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ExtratoService } from '../services/extrato.service';

export const extratoResolver: ResolveFn<unknown> = (snapshot) => {
  console.log('resolving...');
  const extratoService = inject(ExtratoService);
  const cartao = snapshot.paramMap.get('cartao')!;
  return extratoService.consultar(cartao);
};
