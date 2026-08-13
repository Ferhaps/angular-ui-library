import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subject, map, mergeMap, scan, timer } from 'rxjs';
import { LoadingService } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

@Component({
	selector: 'app-loader-page',
	imports: [MatButtonModule, MatIconModule, PageHeading, DemoCard, CodeBlock],
	templateUrl: './loader-page.html',
	styleUrl: './loader-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderPage {
	protected readonly loadingService = inject(LoadingService);

	private readonly requests = new Subject<number>();

	/**
	 * Every request runs through `withLoading()`, so the overlay is claimed on
	 * subscribe and released on completion — no manual toggling anywhere. `mergeMap`
	 * lets requests overlap, which is what proves the counting works.
	 */
	protected readonly log = toSignal(
		this.requests.pipe(
			mergeMap((ms) =>
				timer(ms).pipe(
					map(() => ms),
					this.loadingService.withLoading(),
				),
			),
			scan(
				(entries: string[], ms) =>
					[`${ms / 1000}s request settled`, ...entries].slice(0, 5),
				[],
			),
		),
		{ initialValue: [] as string[] },
	);

	protected simulate(ms: number): void {
		this.requests.next(ms);
	}

	protected simulateOverlapping(): void {
		this.requests.next(1000);
		this.requests.next(3000);
	}

	protected readonly snippet = `// app root template — mount once
<eui-global-loader />

// bind the overlay to an observable's lifetime — no manual toggling
private readonly loading = inject(LoadingService);
private readonly http = inject(HttpClient);

readonly users = toSignal(
  this.http.get<User[]>('/api/users').pipe(
    this.loading.withLoading(),
    map(toViewModel),
  ),
);

// the claim is released on complete, error AND unsubscribe, so a
// superseded switchMap inner or a destroyed component releases it too
readonly results = toSignal(
  this.query$.pipe(
    switchMap(q => this.http.get<Hit[]>(\`/api/search?q=\${q}\`).pipe(
      this.loading.withLoading(),
    )),
  ),
);

// overlapping work keeps the overlay up until the last claim is released

loading.loading();       // signal — read it anywhere

// httpResource hands you no observable, so tag the request instead —
// easyUiLibInterceptor drives the overlay off the X-Global-Loader header
readonly user = httpResource<User>(() => ({
  url: \`/api/users/\${this.id()}\`,
  headers: { 'X-Global-Loader': 'true' },
}));

// manual control, when no observable is involved
loading.showLoading();
loading.hideLoading();`;
}
