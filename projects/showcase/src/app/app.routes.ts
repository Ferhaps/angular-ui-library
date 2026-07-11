import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { TablePage } from './pages/table/table-page';
import { SearchBarPage } from './pages/search-bar/search-bar-page';
import { DialogPage } from './pages/dialog/dialog-page';
import { UtilsPage } from './pages/utils/utils-page';
import { PasswordStrengthPage } from './pages/password-strength/password-strength-page';
import { ValidatorsPage } from './pages/validators/validators-page';
import { PipePage } from './pages/pipe/pipe-page';
import { LoaderPage } from './pages/loader/loader-page';
import { ErrorHandlerPage } from './pages/error-handler/error-handler-page';
import { ErrorDisplayPage } from './pages/error-display/error-display-page';
import { ConfirmDialogPage } from './pages/confirm-dialog/confirm-dialog-page';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: Home,
		title: 'easy-ui-lib · Showcase',
	},
	{
		path: 'table',
		component: TablePage,
		title: 'Table · easy-ui-lib',
	},
	{
		path: 'search-bar',
		component: SearchBarPage,
		title: 'Search Bar · easy-ui-lib',
	},
	{
		path: 'dialog',
		component: DialogPage,
		title: 'Default Dialog · easy-ui-lib',
	},
	{
		path: 'confirm-dialog',
		component: ConfirmDialogPage,
		title: 'Confirm Dialog · easy-ui-lib',
	},
	{
		path: 'error-display',
		component: ErrorDisplayPage,
		title: 'Error Display · easy-ui-lib',
	},
	{
		path: 'error-handler',
		component: ErrorHandlerPage,
		title: 'Error Handler · easy-ui-lib',
	},
	{
		path: 'loader',
		component: LoaderPage,
		title: 'Global Loader · easy-ui-lib',
	},
	{
		path: 'pipe',
		component: PipePage,
		title: 'Snake Case Parser · easy-ui-lib',
	},
	{
		path: 'validators',
		component: ValidatorsPage,
		title: 'Form Directives · easy-ui-lib',
	},
	{
		path: 'password-strength',
		component: PasswordStrengthPage,
		title: 'Password Strength · easy-ui-lib',
	},
	{
		path: 'utils',
		component: UtilsPage,
		title: 'HTTP Utils · easy-ui-lib',
	},
	{ path: '**', redirectTo: '' },
];
