import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

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
	templateUrl: './loader-page.html',
	styleUrl: './loader-page.scss',
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
