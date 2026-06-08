import {
  CommonModule,
  DatePipe,
  isPlatformBrowser,
  isPlatformServer,
} from "@angular/common";
import {
  Component,
  Inject,
  makeStateKey,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TransferState,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { finalize } from "rxjs";
import { PedidosComponent } from "../../components/pedidos/pedidos.component";
import { PatrocinadoresComponent } from "../../components/patrocinadores/patrocinadores.component";
import { ExtratoService } from "../../modules/extrato/services/extrato.service";
import { Extrato } from "../../modules/extrato/types/extrato";
import { MoneyPipe } from "../../pipes/money.pipe";

const EXTRATO_KEY = makeStateKey<Extrato>("extrato");

@Component({
  selector: "extrato",
  imports: [CommonModule, MoneyPipe, DatePipe, PedidosComponent, PatrocinadoresComponent],
  templateUrl: `./extrato.component.html`,
})
export class ExtratoComponent implements OnInit {
  extrato: Extrato | null = null;
  recarregandoExtrato = false;
  private readonly _intervaloAtualizacaoMs = 10000;
  private _timeoutAtualizacao: ReturnType<typeof setTimeout> | null = null;

  private pedidoPendente(status: string): boolean {
    const statusNormalizado = String(status).toLowerCase().trim();

    return statusNormalizado !== "cancelado" && statusNormalizado !== "entregue";
  }

  private temPedidosPendentes(extrato: Extrato | null): boolean {
    if (!extrato) {
      return false;
    }

    return extrato.pedidos.some((pedido) => this.pedidoPendente(pedido.status));
  }

  private pararAtualizacaoAutomatica(): void {
    if (this._timeoutAtualizacao !== null) {
      clearTimeout(this._timeoutAtualizacao);
      this._timeoutAtualizacao = null;
    }
  }

  private agendarProximaAtualizacao(): void {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    this.pararAtualizacaoAutomatica();

    if (!this.temPedidosPendentes(this.extrato)) {
      return;
    }

    this._timeoutAtualizacao = setTimeout(() => {
      this._timeoutAtualizacao = null;
      this.recarregarExtrato();
    }, this._intervaloAtualizacaoMs);
  }

  private obterCodigoCartao(): string | null {
    return this._activatedRoute.snapshot.paramMap.get("codigo");
  }

  recarregarExtrato(): void {
    if (this.recarregandoExtrato) {
      return;
    }

    const codigo = this.obterCodigoCartao();

    if (!codigo) {
      return;
    }

    this.pararAtualizacaoAutomatica();
    this.recarregandoExtrato = true;
    this._extratoService.consultar(codigo)
      .pipe(finalize(() => {
        this.recarregandoExtrato = false;
        this.agendarProximaAtualizacao();
      }))
      .subscribe((data) => {
        this.extrato = data;
        this._transferState.set(EXTRATO_KEY, data);
      });
  }

  constructor(
    private readonly _extratoService: ExtratoService,
    private readonly _transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
    private readonly _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) {
      this.recarregarExtrato();
    }
    if (isPlatformBrowser(this._platformId)) {
      this.extrato = this._transferState.get(EXTRATO_KEY, null);
      this.agendarProximaAtualizacao();
    }
  }

  ngOnDestroy(): void {
    this.pararAtualizacaoAutomatica();
  }
}
