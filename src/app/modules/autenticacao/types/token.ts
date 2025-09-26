export class Token {
  constructor(public readonly value: string, public readonly dataExpiracao: Date) {}

  get expirado(): boolean {
    return new Date() > this.dataExpiracao;
  }
}
