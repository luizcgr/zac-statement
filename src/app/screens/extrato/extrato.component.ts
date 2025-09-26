import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Extrato } from '../../modules/extrato/types/extrato';

@Component({
  selector: 'extrato',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: `./extrato.component.html`,
})
export class ExtratoComponent {
  readonly extrato: Extrato;

  constructor(private readonly _activatedRoute: ActivatedRoute) {
    this.extrato = this._activatedRoute.snapshot.data['extrato'];
  }
}
