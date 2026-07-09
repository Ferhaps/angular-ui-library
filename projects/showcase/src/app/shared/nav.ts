export type NavItem = {
	path: string;
	title: string;
	icon: string;
	blurb: string;
	kind: 'Component' | 'Directive' | 'Pipe' | 'Service' | 'Utility';
};

export const NAV_ITEMS: NavItem[] = [
	{
		path: 'table',
		title: 'Table',
		icon: 'table_chart',
		kind: 'Component',
		blurb:
			'Config-driven generic table: sorting, drag-drop, selection, row options, class rules and infinite scroll.',
	},
	{
		path: 'search-bar',
		title: 'Search Bar',
		icon: 'search',
		kind: 'Component',
		blurb:
			'Debounced search input implemented as a ControlValueAccessor — works with reactive forms or its output.',
	},
	{
		path: 'dialog',
		title: 'Default Dialog',
		icon: 'web_asset',
		kind: 'Component',
		blurb:
			'Reusable MatDialog shell with title, optional back arrow, custom height and projected/template content.',
	},
	{
		path: 'confirm-dialog',
		title: 'Confirm Dialog',
		icon: 'help',
		kind: 'Service',
		blurb:
			'Promise-based confirm() that opens a Material dialog and resolves true/false — with danger styling for destructive actions.',
	},
	{
		path: 'error-display',
		title: 'Error Display',
		icon: 'report',
		kind: 'Component',
		blurb:
			'Renders a SystemError (string | HttpErrorResponse | undefined) into a friendly message.',
	},
	{
		path: 'error-handler',
		title: 'Error Handler',
		icon: 'error',
		kind: 'Service',
		blurb:
			'ErrorService broadcasts HttpErrorResponses; ErrorHandler opens a popup with the parsed status.',
	},
	{
		path: 'loader',
		title: 'Global Loader',
		icon: 'hourglass_top',
		kind: 'Service',
		blurb:
			'LoaderService + GlobalLoader render an app-wide spinner overlay from a single signal of truth.',
	},
	{
		path: 'pipe',
		title: 'Snake Case Parser',
		icon: 'text_fields',
		kind: 'Pipe',
		blurb:
			'Turns snake_case / SCREAMING_CASE tokens into a readable, capitalised label.',
	},
	{
		path: 'validators',
		title: 'Form Directives',
		icon: 'rule',
		kind: 'Directive',
		blurb:
			'Password strength, fields-match and phone-formatting directives plugged into reactive forms.',
	},
	{
		path: 'password-strength',
		title: 'Password Strength',
		icon: 'password',
		kind: 'Component',
		blurb:
			'Live strength meter and per-rule checklist sharing the exact rules of the password validator directive.',
	},
	{
		path: 'utils',
		title: 'HTTP Utils',
		icon: 'data_object',
		kind: 'Utility',
		blurb:
			'HTTP status map, ready-made request option objects and the withAcceptLanguage helper.',
	},
];
