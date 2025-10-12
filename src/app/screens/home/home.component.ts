import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  computed,
  signal,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { Extrato } from '../../modules/extrato/types/extrato';
import { ExtratoService } from '../../modules/extrato/services/extrato.service';

const EXTRATO_KEY = makeStateKey<Extrato>('extrato');

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="p-4">
      <h1>{{ title() }}</h1>
      <p>{{ description() }}</p>

      @if (extrato) {
        <div class="mt-4 border-t pt-4">
          <h2>Extrato carregado:</h2>
          <pre>{{ extrato }}</pre>
        </div>
      } @else {
        <p class="mt-4 text-gray-500">Nenhum extrato disponível.</p>
      }
    </section>
  `,
})
export class HomeComponent {
  readonly title = signal('Welcome to Zac Statement');
  readonly description = signal(
    'This is the home screen of your scalable Angular application.',
  );

  extrato: Extrato | null = null;

  constructor() {}

  readonly welcomeMessage = computed(
    () => `${this.title()} - ${this.description()}`,
  );
}
