import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErrorService } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/page-heading';
import { DemoCard } from '../../shared/demo-card';
import { CodeBlock } from '../../shared/code-block';

type Trigger = { label: string; response: HttpErrorResponse };

@Component({
	selector: 'app-error-handler-page',
	imports: [
		MatButtonModule,
		MatIconModule,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	template: `
		<app-page-heading
			title="Error Handler"
			kind="Service · ErrorService + ErrorHandlerComponent"
			lead="ErrorService is a root broadcast channel for HttpErrorResponses.
			Drop <lib-error-handler /> once near the app root (this showcase does, in
			its shell) and it listens, then opens a popup with the parsed status and
			a friendly message — typically wired into an HTTP interceptor."
		/>

		<app-demo-card
			heading="Broadcast an error"
			hint="opens the popup mounted at the app root"
		>
			<div class="buttons">
				@for (t of triggers; track t.label) {
					<button mat-stroked-button (click)="send(t.response)">
						{{ t.label }}
					</button>
				}
			</div>
			<p class="muted note">
				<mat-icon>info</mat-icon>
				The popup is rendered by the single <code>&lt;lib-error-handler /&gt;</code>
				in the app shell — not by this page.
			</p>
		</app-demo-card>

		<app-demo-card heading="Typical wiring (HTTP interceptor)">
			<app-code-block [code]="snippet" />
		</app-demo-card>
	`,
	styles: [
		`
			.buttons {
				display: flex;
				flex-wrap: wrap;
				gap: 0.75rem;
			}
			.note {
				display: flex;
				align-items: center;
				gap: 0.4rem;
				margin: 1rem 0 0;
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
export class ErrorHandlerPage {
	private readonly errorService = inject(ErrorService);

	protected readonly triggers: Trigger[] = [
		{
			label: '401 Unauthorized',
			response: new HttpErrorResponse({
				status: 401,
				statusText: 'Unauthorized',
				error: 'invalid_token',
			}),
		},
		{
			label: '404 Not Found',
			response: new HttpErrorResponse({
				status: 404,
				statusText: 'Not Found',
				error: { message: 'The requested resource does not exist.' },
			}),
		},
		{
			label: '422 Unprocessable',
			response: new HttpErrorResponse({
				status: 422,
				statusText: 'Unprocessable Entity',
				error: { message: 'Email already taken' },
			}),
		},
		{
			label: '500 Server Error',
			response: new HttpErrorResponse({
				status: 500,
				statusText: 'Internal Server Error',
				error: 'something_went_wrong',
			}),
		},
	];

	protected send(response: HttpErrorResponse): void {
		this.errorService.sendError(response);
	}

	protected readonly snippet = `// app root template — mount once
<lib-error-handler />

// an HTTP interceptor forwards failures to the service
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errors = inject(ErrorService);
  return next(req).pipe(
    tap({
      error: (err) => {
        if (err instanceof HttpErrorResponse) errors.sendError(err);
      },
    }),
  );
};`;
}
