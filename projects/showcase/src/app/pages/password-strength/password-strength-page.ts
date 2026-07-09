import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PasswordStrengthComponent } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';

@Component({
	selector: 'app-password-strength-page',
	imports: [
		FormsModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		PasswordStrengthComponent,
		PageHeading,
		DemoCard,
		CodeBlock,
	],
	templateUrl: './password-strength-page.html',
	styleUrl: './password-strength-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrengthPage {
	protected password = signal('');
	protected customPassword = signal('');

	protected readonly snippet = `<!-- bind the current value; rules default to the validator's defaults -->
<input type="password" [(ngModel)]="password" euiPasswordValidator />
<eui-password-strength [value]="password" />

<!-- custom rules — mirror them on the directive and the meter -->
<input
	type="password"
	[(ngModel)]="password"
	euiPasswordValidator
	[minLength]="12"
	[requireSpecial]="false"
/>
<eui-password-strength
	[value]="password"
	[minLength]="12"
	[requireSpecial]="false"
/>`;
}
