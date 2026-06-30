import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading';
import { DemoCard } from '../../shared/components/demo-card';
import { CodeBlock } from '../../shared/components/code-block';

@Component({
	selector: 'app-loader-page',
	imports: [
		AsyncPipe,
		MatButtonModule,
		MatIconModule,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	template: `
		<app-page-heading
			title="Global Loader"
			kind="Service · LoaderService + GlobalLoaderComponent"
			lead="A single source of truth for an app-wide loading overlay. Mount
			<lib-global-loader /> once near the root (done in this showcase's shell)
			and flip LoaderService.setLoading() from anywhere — typically from an HTTP
			interceptor keyed off the X-Global-Loader header."
		/>

		<app-demo-card heading="Trigger the overlay">
			<div class="buttons">
				<button mat-flat-button (click)="simulate(2000)">
					<mat-icon>cloud_download</mat-icon> Simulate 2s request
				</button>
				<button mat-stroked-button (click)="simulate(4000)">
					Simulate 4s request
				</button>
			</div>
			<p class="state">
				Current state:
				<strong [class.on]="loaderService.loading$ | async">
					{{ (loaderService.loading$ | async) ? 'LOADING' : 'idle' }}
				</strong>
			</p>
			<p class="muted note">
				<mat-icon>info</mat-icon>
				The spinner overlay covers the whole viewport while active — it is
				rendered by the single loader mounted in the app shell.
			</p>
		</app-demo-card>

		<app-demo-card heading="Usage">
			<app-code-block [code]="snippet" />
		</app-demo-card>
	`,
	styles: [
		`
			.buttons {
				display: flex;
				flex-wrap: wrap;
				gap: 0.75rem;
				margin-bottom: 1rem;
			}
			.buttons mat-icon {
				margin-right: 0.35rem;
			}
			.state {
				margin: 0 0 0.75rem;
			}
			.state strong {
				color: var(--mat-sys-on-surface-variant, #6b6b6b);
			}
			.state strong.on {
				color: var(--mat-sys-primary, #6750a4);
			}
			.note {
				display: flex;
				align-items: center;
				gap: 0.4rem;
				margin: 0;
				font-size: 0.88rem;
			}
			.note mat-icon {
				font-size: 18px;
				width: 18px;
				height: 18px;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderPage {
	protected readonly loaderService = inject(LoaderService);
	private timer: ReturnType<typeof setTimeout> | null = null;

	protected simulate(ms: number): void {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.loaderService.setLoading(true);
		this.timer = setTimeout(() => {
			this.loaderService.setLoading(false);
			this.timer = null;
		}, ms);
	}

	protected readonly snippet = `// app root template — mount once
<lib-global-loader />

// flip it from anywhere
const loader = inject(LoaderService);
loader.setLoading(true);
// ...later
loader.setLoading(false);

// loader.loading$ is an observable; loader.isLoading() reads the latest value`;
}
