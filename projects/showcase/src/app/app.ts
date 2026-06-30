import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
	ErrorHandlerComponent,
	GlobalLoaderComponent,
} from '@ferhaps/easy-ui-lib';
import { NAV_ITEMS } from './nav';
import { ThemeService } from './shared/services/theme.service';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		MatSidenavModule,
		MatToolbarModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		MatTooltipModule,
		ErrorHandlerComponent,
		GlobalLoaderComponent,
	],
	templateUrl: './app.html',
	styleUrl: './app.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
	protected readonly navItems = NAV_ITEMS;
	protected readonly theme = inject(ThemeService);

	private readonly breakpoints = inject(BreakpointObserver);
	protected readonly isHandset = toSignal(
		this.breakpoints.observe('(max-width: 880px)').pipe(map((r) => r.matches)),
		{ initialValue: false },
	);

	protected onNavigate(drawer: MatSidenav): void {
		if (this.isHandset()) {
			drawer.close();
		}
	}
}
