import { animate, state, style, transition, trigger } from "@angular/animations";

export const fader = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('200ms', style({ opacity: 0 })),
  ]),
]);

export const textFader = trigger('textFader', [
  state('void', style({ opacity: 0 })),
  state('*', style({ opacity: 1 })),
  transition('void => *', [animate('0.3s 0.3s ease-in')]),
  transition('* => void', [animate('0.3s ease-in')])
]);
