import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeCaseParser',
})
export class SnakeCaseParserPipe implements PipeTransform {
  public transform(str: string | undefined): string {
    if (str) {
      let temp = str.split('_').map(word => {
        return word.toLowerCase();
      }).join(' ');
      return temp.charAt(0).toUpperCase() + temp.slice(1);
    }

    return '';
  }
}
