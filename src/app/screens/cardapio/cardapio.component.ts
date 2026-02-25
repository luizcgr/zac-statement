import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Inject,
  makeStateKey,
  PLATFORM_ID,
  signal,
  TransferState,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CardapioService } from "../../modules/cardapio/services/cardapio.service";
import { Cardapio } from "../../modules/cardapio/types/cardapio";
import { MoneyPipe } from "../../pipes/money.pipe";

const CARDAPIO_KEY = makeStateKey<Cardapio>("cardapio");

@Component({
  selector: "pagina-cardapio",
  imports: [MoneyPipe],
  templateUrl: "./cardapio.component.html",
})
export class CardapioComponent {
  cardapio = signal<Cardapio | null>(null);
  filtro = signal<string>("");

  itensFiltrados = computed(() => {
    const cardapioData = this.cardapio();
    const filtroTexto = this.filtro().toLowerCase().trim();

    if (!cardapioData || !filtroTexto) {
      return cardapioData?.itens || [];
    }

    return cardapioData.itens
      .map((item) => ({
        ...item,
        produtos: item.produtos.filter((produto) =>
          produto.nome.toLowerCase().includes(filtroTexto),
        ),
      }))
      .filter((item) => item.produtos.length > 0);
  });

  constructor(
    private readonly _cardapioService: CardapioService,
    private readonly _transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
    private readonly _activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this._platformId)) {
      const chave = this._activatedRoute.snapshot.paramMap.get("chave");
      if (chave) {
        this._cardapioService.consultar(chave).subscribe((cardapio) => {
          this.cardapio.set(cardapio);
          this._transferState.set(CARDAPIO_KEY, cardapio);
        });
      }
    }
    if (isPlatformBrowser(this._platformId)) {
      const cardapioData = this._transferState.get(CARDAPIO_KEY, null);
      if (cardapioData) {
        this.cardapio.set(cardapioData);
      }
    }
  }
}
