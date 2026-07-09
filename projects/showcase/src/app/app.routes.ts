import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		loadComponent: () => import('./pages/home/home').then((m) => m.Home),
		title: 'easy-ui-lib · Showcase',
	},
	{
		path: 'table',
		loadComponent: () =>
			import('./pages/table/table-page').then((m) => m.TablePage),
		title: 'Table · easy-ui-lib',
	},
	{
		path: 'search-bar',
		loadComponent: () =>
			import('./pages/search-bar/search-bar-page').then((m) => m.SearchBarPage),
		title: 'Search Bar · easy-ui-lib',
	},
	{
		path: 'dialog',
		loadComponent: () =>
			import('./pages/dialog/dialog-page').then((m) => m.DialogPage),
		title: 'Default Dialog · easy-ui-lib',
	},
	{
		path: 'confirm-dialog',
		loadComponent: () =>
			import('./pages/confirm-dialog/confirm-dialog-page').then(
				(m) => m.ConfirmDialogPage,
			),
		title: 'Confirm Dialog · easy-ui-lib',
	},
	{
		path: 'error-display',
		loadComponent: () =>
			import('./pages/error-display/error-display-page').then(
				(m) => m.ErrorDisplayPage,
			),
		title: 'Error Display · easy-ui-lib',
	},
	{
		path: 'error-handler',
		loadComponent: () =>
			import('./pages/error-handler/error-handler-page').then(
				(m) => m.ErrorHandlerPage,
			),
		title: 'Error Handler · easy-ui-lib',
	},
	{
		path: 'loader',
		loadComponent: () =>
			import('./pages/loader/loader-page').then((m) => m.LoaderPage),
		title: 'Global Loader · easy-ui-lib',
	},
	{
		path: 'pipe',
		loadComponent: () =>
			import('./pages/pipe/pipe-page').then((m) => m.PipePage),
		title: 'Snake Case Parser · easy-ui-lib',
	},
	{
		path: 'validators',
		loadComponent: () =>
			import('./pages/validators/validators-page').then(
				(m) => m.ValidatorsPage,
			),
		title: 'Form Directives · easy-ui-lib',
	},
	{
		path: 'password-strength',
		loadComponent: () =>
			import('./pages/password-strength/password-strength-page').then(
				(m) => m.PasswordStrengthPage,
			),
		title: 'Password Strength · easy-ui-lib',
	},
	{
		path: 'utils',
		loadComponent: () =>
			import('./pages/utils/utils-page').then((m) => m.UtilsPage),
		title: 'HTTP Utils · easy-ui-lib',
	},
	{ path: '**', redirectTo: '' },
];
