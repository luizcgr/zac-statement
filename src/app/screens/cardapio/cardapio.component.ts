import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  makeStateKey,
  PLATFORM_ID,
  signal,
  TransferState,
} from "@angular/core";
import { CardapioService } from "../../modules/cardapio/services/cardapio.service";
import { Cardapio } from "../../modules/cardapio/types/cardapio";
import { ActivatedRoute } from "@angular/router";
import { ExtratoService } from "../../modules/extrato/services/extrato.service";
import { concatMap, tap } from "rxjs";
import { MoneyPipe } from "../../pipes/money.pipe";

const CARDAPIO_KEY = makeStateKey<Cardapio>("cardapio");

@Component({
  selector: "pagina-cardapio",
  imports: [MoneyPipe],
  templateUrl: "./cardapio.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardapioComponent {
  cardapio = signal<Cardapio | null>(null);
  expandedTerminal = signal<string | null>(null);

  constructor(
    private readonly _extratoService: ExtratoService,
    private readonly _cardapioService: CardapioService,
    private readonly _transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) {
      const codigo = this._activatedRoute.snapshot.paramMap.get("codigo");
      console.log("Cardápio: " + codigo);
      this._extratoService
        .consultar(codigo!)
        .pipe(
          tap((extrato) => {
            console.log("Evento: " + extrato!.evento!.id);
          }),
          concatMap((extrato) =>
            this._cardapioService.consultar(extrato!.evento!.id!),
          ),
        )
        .subscribe((cardapio) => {
          console.log(cardapio);
          this.cardapio.set(cardapio);
          this._transferState.set(CARDAPIO_KEY, cardapio);
        });
    }
    if (isPlatformBrowser(this._platformId)) {
      const cardapioData = this._transferState.get(CARDAPIO_KEY, null);
      if (cardapioData) {
        this.cardapio.set(cardapioData);
      }
    }
  }

  toggleTerminal(terminal: string): void {
    this.expandedTerminal.update((current) =>
      current === terminal ? null : terminal,
    );
  }

  isExpanded(terminal: string): boolean {
    return this.expandedTerminal() === terminal;
  }
}
