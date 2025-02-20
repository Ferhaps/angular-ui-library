import { CommonModule } from "@angular/common";
import { NgModule, Pipe, PipeTransform } from "@angular/core";

@Pipe({
  standalone: false,
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

@NgModule({
  declarations: [
    WhiteSpaceFillerPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    WhiteSpaceFillerPipe
  ]
})
export class WhiteSpaceFillerModule { }