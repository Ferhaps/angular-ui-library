import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCaseParser',
})
export class SnakeCaseParserPipe implements PipeTransform {
  public transform(value: unknown): string {
    if (typeof value === 'string') {
      let temp = value.replaceAll('_', ' ');
      temp = temp.charAt(0).toUpperCase() + temp.slice(1).toLowerCase();
      return temp;
    }

    return String(value);
  }
}
