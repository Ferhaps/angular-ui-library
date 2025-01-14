import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'blankFiller',
})
export class WhiteSpaceFillerPipe implements PipeTransform {
  public transform(value: any, fillWith: string = '-'): string {
    if (value === 0) {
      return '0';
    }
    return value ? value : fillWith;
  }
}