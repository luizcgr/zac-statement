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
        class="block"
      >
        <ng-container *ngTemplateOutlet="imagemTemplate" />
      </a>
    } @else {
      <ng-container *ngTemplateOutlet="imagemTemplate" />
    }

    <ng-template #imagemTemplate>
      <img
        [src]="patrocinador().imagem"
        alt="Imagem do patrocinador"
        class="h-auto rounded-lg object-contain"
      />
    </ng-template>
  `,
})
export class ImagemPatrocinadorComponent {
  patrocinador = input.required<Patrocinador>();
}
