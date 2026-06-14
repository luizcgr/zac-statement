import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "app-erro",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flex w-full place-content-center">
      <img src="logo-zac.png" alt="Logo Zac" width="200" class="-mb-5" />
    </div>

    <div class="flex w-full flex-col items-center px-4 pt-16 text-center">
      <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-[#09bbf7]/40 bg-[#09bbf7]/10">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          class="h-10 w-10 text-[#09bbf7]"
        >
          <path
            d="M12 9v4M12 17h.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <div class="text-[26px] font-bold text-[#09bbf7]">Erro inesperado</div>
      <div class="mt-1 text-[15px] text-[#09bbf7]/80">
        {{ mensagem() }}
      </div>

      <p class="mt-6 max-w-sm text-[13px] leading-relaxed text-white/40">
        Utilize apenas as rotas disponíveis na aplicação para evitar erros. 
      </p>
    </div>
  `,
})
export class ErroComponent {
    readonly mensagem = input("Não foi possível encontrar a página solicitada.");
}
