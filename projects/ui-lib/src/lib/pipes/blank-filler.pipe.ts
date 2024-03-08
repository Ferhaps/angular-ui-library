import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'blankFiller', standalone: true })
export class WhiteSpaceFillerPipe implements PipeTransform {
  transform(value: any, fillWith: string = '-'): string {
    if (value === 0) {
      return '0';
    }
    return value ? value : fillWith;
  }
}