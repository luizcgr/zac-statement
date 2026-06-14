import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
    selector: "app-erro",
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flex min-h-screen w-full flex-col items-center justify-center gap-1 px-4 text-center">
      <img src="logo-zac.png" alt="Logo Zac" width="200" />

      

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
