import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCaseParser',
})
export class SnakeCaseParserPipe implements PipeTransform {
  public transform(value: string | undefined): string {
    if (value) {
      if (typeof value === 'string') {
        let temp = value.split('_').map(word => {
          return word.toLowerCase();
        }).join(' ');
        return temp.charAt(0).toUpperCase() + temp.slice(1);
      }

      return String(value);
    }

    return '';
  }
}
