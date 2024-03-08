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

export const popupFader = trigger('popupFader', [
  transition('closed => opened', [
    style({ opacity: 0, transform: 'translateY(100px)' }),
    animate('200ms', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition('opened => closed', [
    animate('200ms', style({ opacity: 0 })),
  ]),
]);

export const openDropdown = trigger('open-close-dropdown', [
  transition(':enter', [
    style({ height: 0, overflow: 'hidden' }),
    animate('200ms ease', style({ height: '*' }))
  ]),
  transition(':leave', [
    style({ height: '*', overflow: 'hidden' }),
    animate('200ms ease', style({ height: 0 }))
  ])
]);

export const textFader = trigger('textFader', [
  state('void', style({ opacity: 0 })),
  state('*', style({ opacity: 1 })),
  transition('void => *', [animate('0.3s 0.3s ease-in')]),
  transition('* => void', [animate('0.3s ease-in')])
]);
