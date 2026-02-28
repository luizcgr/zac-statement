import { Component, Input } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { Patrocinador } from "../../modules/extrato/types/patrocinador";

@Component({
  selector: "imagem-patrocinador",
  imports: [RouterModule],
  template: `
    <img
      [src]="patrocinador.imagem"
      (click)="abrirLink()"
      alt="Imagem do patrocinador"
      class="h-auto rounded-lg object-contain"
    />
  `,
})
export class ImagemPatrocinadorComponent {
  @Input({ required: true }) patrocinador!: Patrocinador;

  constructor(private readonly _router: Router) {}

  abrirLink() {
    if (this.patrocinador.link) {
      window.open(this.patrocinador.link);
    }
  }
}
