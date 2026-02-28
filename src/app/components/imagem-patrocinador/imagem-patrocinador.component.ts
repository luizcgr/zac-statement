import { NgOptimizedImage } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Patrocinador } from "../../modules/extrato/types/patrocinador";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "imagem-patrocinador",
  imports: [RouterModule],
  template: `
    <img
      [src]="patrocinador.imagem"
      (click)="abrirLink()"
      alt="Imagem do patrocinador"
      class="h-auto max-w-sm rounded-lg object-contain"
    />
  `,
})
export class ImagemPatrocinadorComponent {
  @Input({ required: true }) patrocinador!: Patrocinador;

  constructor(private readonly _router: Router) {}

  abrirLink() {
    if (this.patrocinador.link) {
      window.open(this.patrocinador.link, "_blank");
    }
  }
}
