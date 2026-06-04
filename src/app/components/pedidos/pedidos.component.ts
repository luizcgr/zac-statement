import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { Pedido } from "../../modules/extrato/types/pedido";

@Component({
    selector: "pedidos",
    imports: [DatePipe],
    template: `
      @if (pedidosVisiveis().length > 0) {
        <div class="mx-4 mb-6 w-[calc(100%-2rem)] max-w-md">
        <div class="mb-3 flex items-center gap-3 text-[#09bbf7]">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-[#09bbf7]/15">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="h-5 w-5">
              <path
                d="M4 8H20V10C20 11.1046 19.1046 12 18 12H6C4.89543 12 4 11.1046 4 10V8Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linejoin="round"
              />
              <path
                d="M6 12V16C6 17.1046 6.89543 18 8 18H16C17.1046 18 18 17.1046 18 16V12"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path d="M9 6.5H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              <path d="M8 4.5H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </span>
          <div>
            <div class="text-[18px] font-bold text-white">Pedidos em preparo</div>
            <div class="text-[13px] text-[#cdefff]">Acompanhe os itens que já foram solicitados.</div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          @for (pedido of pedidosVisiveis(); track pedido.id) {
            <div class="rounded-2xl border border-[#09bbf7]/25 bg-white/5 p-4 shadow-[0_8px_24px_rgba(9,187,247,0.12)]">
              <div class="mb-3 flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="text-[18px] font-bold text-white">
                    Pedido #{{ pedido.numero }}
                  </div>
                  <div class="text-[13px] text-[#cdefff]">
                    {{ pedido.nome }}
                  </div>
                </div>
                <div
                  [class]="
                    rotuloStatus(pedido.status) === 'Pronto'
                      ? 'shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-[12px] font-semibold text-emerald-300'
                      : 'shrink-0 rounded-full border border-[#09bbf7]/30 bg-[#09bbf7]/15 px-3 py-1 text-[12px] font-semibold text-[#09bbf7]'
                  "
                >
                  {{ rotuloStatus(pedido.status) }}
                </div>
              </div>

              <div class="space-y-2">
                @for (produto of pedido.produtos; track produto.id) {
                  <div class="flex items-center justify-between gap-4 text-[14px] text-white">
                    <span class="min-w-0 break-words">
                      {{ produto.quantidade }}x {{ produto.nome }}
                    </span>
                  </div>
                }
              </div>

              @if (pedido.observacoes) {
                <div class="mt-3 rounded-xl bg-black/15 px-3 py-2 text-[13px] text-[#cdefff]">
                  {{ pedido.observacoes }}
                </div>
              }

              <div class="mt-3 text-[12px] text-[#9fdff7]">
                Solicitado às {{ pedido.data | date: "dd/MM/yyyy HH:mm" }}
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PedidosComponent {
    pedidos = input<Pedido[]>([]);

    private pedidoVisivel(status: Pedido["status"]): boolean {
        const statusNormalizado = String(status).toLowerCase().trim();

        return (
            statusNormalizado !== "cancelado" &&
            statusNormalizado !== "entregue"
        );
    }

    rotuloStatus(status: Pedido["status"]): string {
        const statusNormalizado = String(status).toLowerCase().trim();

        if (statusNormalizado === "aguardando") {
            return "Aguardando";
        }

        if (statusNormalizado === "preparando" || statusNormalizado === "em preparo") {
            return "Em preparo";
        }

        if (statusNormalizado === "pronto") {
            return "Pronto";
        }

        return "Em andamento";
    }

    pedidosVisiveis = computed(() =>
        this.pedidos().filter((pedido) => this.pedidoVisivel(pedido.status)),
    );
}