import { HttpErrorResponse } from '@angular/common/http';

/**
 * A displayable error from any source: a failed HTTP request
 * (`HttpErrorResponse`), a plain message `string`, or `undefined` when there is
 * no error. `ErrorDisplayComponent` accepts this shape and renders a
 * human-readable message for each case.
 */
export type SystemError = HttpErrorResponse | string | undefined;
