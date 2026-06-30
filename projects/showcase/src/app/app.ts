import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {
	ErrorHandlerComponent,
	GlobalLoaderComponent,
} from '@ferhaps/easy-ui-lib';
import { NAV_ITEMS } from './nav';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		MatIconModule,
		ErrorHandlerComponent,
		GlobalLoaderComponent,
	],
	templateUrl: './app.html',
	styleUrl: './app.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	protected readonly navItems = NAV_ITEMS;
	protected readonly menuOpen = signal(false);

	protected toggleMenu(): void {
		this.menuOpen.update((open) => !open);
	}

	protected closeMenu(): void {
		this.menuOpen.set(false);
	}
}
