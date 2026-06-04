import { Component, input } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { Patrocinador } from "../../modules/extrato/types/patrocinador";

@Component({
  selector: "imagem-patrocinador",
  imports: [NgTemplateOutlet],
  template: `
    @if (patrocinador().link) {
      <a
        [href]="patrocinador().link"
        target="_blank"
        rel="noopener noreferrer"
        class="block w-36 sm:w-40"
      >
        <ng-container *ngTemplateOutlet="imagemTemplate" />
      </a>
    } @else {
      <div class="w-36 sm:w-40">
        <ng-container *ngTemplateOutlet="imagemTemplate" />
      </div>
    }

    <ng-template #imagemTemplate>
      <div class="aspect-[3/2] w-full">
        <img
          [src]="patrocinador().imagem"
          alt="Imagem do patrocinador"
          class="h-full w-full object-contain"
        />
      </div>
    </ng-template>
  `,
})
export class ImagemPatrocinadorComponent {
  patrocinador = input.required<Patrocinador>();
}
