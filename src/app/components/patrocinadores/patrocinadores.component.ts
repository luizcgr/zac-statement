import { Component, Input } from "@angular/core";
import { Patrocinador } from "../../modules/extrato/types/patrocinador";
import { ImagemPatrocinadorComponent } from "../imagem-patrocinador/imagem-patrocinador.component";

@Component({
  selector: "patrocinadores",
  imports: [ImagemPatrocinadorComponent],
  template: `
    @if (patrocinadores.length > 0) {
      <div class="cursor-pointer text-center">
        <div class="text-xl">Patrocinadores:</div>
        <div class="mt-5 flex max-w-2xl flex-wrap justify-center gap-3">
          @for (patrocinador of patrocinadores; track $index) {
            <imagem-patrocinador [patrocinador]="patrocinador" />
          }
        </div>
      </div>
    }
  `,
})
export class PatrocinadoresComponent {
  @Input({ required: true })
  patrocinadores: Patrocinador[] = [];
}
