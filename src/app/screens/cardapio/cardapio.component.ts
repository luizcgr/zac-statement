import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
import { PatrocinadoresComponent } from "../../components/patrocinadores/patrocinadores.component";

const CARDAPIO_KEY = makeStateKey<Cardapio>("cardapio");

@Component({
  selector: "pagina-cardapio",
  imports: [MoneyPipe, PatrocinadoresComponent],
  templateUrl: "./cardapio.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100%);
          opacity: 0;
        }
      }

      .animate-slide-up {
        animation: slideUp 0.3s ease-out;
      }

      .animate-slide-down {
        animation: slideDown 0.2s ease-in forwards;
      }

      button {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
    `,
  ],
})
export class CardapioComponent {
  cardapio = signal<Cardapio | null>(null);
  filtro = signal<string>("");
  quantidades = signal<Map<string, number>>(new Map());
  mostrarTotal = signal<boolean>(false);
  animandoSaida = signal<boolean>(false);

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

  valorTotal = computed(() => {
    const cardapioData = this.cardapio();
    const qtds = this.quantidades();

    if (!cardapioData) return 0;

    let total = 0;
    cardapioData.itens.forEach((item) => {
      item.produtos.forEach((produto) => {
        const quantidade = qtds.get(produto.nome) || 0;
        total += produto.valor * quantidade;
      });
    });

    return total;
  });

  adicionarProduto(nomeProduto: string): void {
    const qtds = new Map(this.quantidades());
    qtds.set(nomeProduto, (qtds.get(nomeProduto) || 0) + 1);
    this.quantidades.set(qtds);
  }

  removerProduto(nomeProduto: string): void {
    const qtds = new Map(this.quantidades());
    const quantidadeAtual = qtds.get(nomeProduto) || 0;

    if (quantidadeAtual > 0) {
      qtds.set(nomeProduto, quantidadeAtual - 1);
      this.quantidades.set(qtds);
    }
  }

  obterQuantidade(nomeProduto: string): number {
    return this.quantidades().get(nomeProduto) || 0;
  }

  terminalTemProdutosSelecionados(
    produtos: { nome: string; valor: number }[],
  ): boolean {
    const qtds = this.quantidades();
    return produtos.some((produto) => (qtds.get(produto.nome) || 0) > 0);
  }

  constructor(
    private readonly _cardapioService: CardapioService,
    private readonly _transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly _platformId: object,
    private readonly _activatedRoute: ActivatedRoute,
  ) {
    effect(() => {
      const total = this.valorTotal();

      if (isPlatformBrowser(this._platformId)) {
        if (total > 0) {
          this.mostrarTotal.set(true);
          this.animandoSaida.set(false);
        } else if (this.mostrarTotal()) {
          this.animandoSaida.set(true);
          setTimeout(() => {
            this.mostrarTotal.set(false);
            this.animandoSaida.set(false);
          }, 200);
        }
      }
    });
  }

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
        console.log(cardapioData);
      }
    }
  }
}
