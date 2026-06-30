import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ErrorService } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

type Trigger = { label: string; response: HttpErrorResponse };

@Component({
	selector: 'app-error-handler-page',
	imports: [MatButtonModule, MatIconModule, PageHeading, DemoCard, CodeBlock],
	templateUrl: './error-handler-page.html',
	styleUrl: './error-handler-page.scss',
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
