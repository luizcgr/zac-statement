import {
  CommonModule,
  DatePipe,
  isPlatformBrowser,
  isPlatformServer,
} from '@angular/common';
import {
  Component,
  Inject,
  makeStateKey,
  OnInit,
  PLATFORM_ID,
  TransferState,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExtratoService } from '../../modules/extrato/services/extrato.service';
import { Extrato } from '../../modules/extrato/types/extrato';
import { MoneyPipe } from '../../pipes/money.pipe';

const EXTRATO_KEY = makeStateKey<Extrato>('extrato');

@Component({
  selector: 'extrato',
  imports: [CommonModule, MoneyPipe, DatePipe],
  templateUrl: `./extrato.component.html`,
})
export class ExtratoComponent implements OnInit {
  extrato: Extrato | null = null;

  constructor(
    private readonly _extratoService: ExtratoService,
    private readonly _transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) {
      const codigo = this._activatedRoute.snapshot.paramMap.get('codigo');
      this._extratoService.consultar(codigo!).subscribe((data) => {
        this.extrato = data;
        this._transferState.set(EXTRATO_KEY, data);
      });
    }
    if (isPlatformBrowser(this._platformId)) {
      this.extrato = this._transferState.get(EXTRATO_KEY, null);
    }
  }
}
