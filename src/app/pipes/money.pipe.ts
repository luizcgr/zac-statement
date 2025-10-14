import { Pipe, PipeTransform } from '@angular/core';
import { money } from '../utils/formatters';

@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  transform(value: number): string {
    return money(value);
  }
}
