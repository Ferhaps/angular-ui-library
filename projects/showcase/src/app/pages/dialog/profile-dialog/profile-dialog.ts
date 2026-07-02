import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DefaultDialogComponent } from '@ferhaps/easy-ui-lib';

@Component({
	selector: 'app-profile-dialog',
	imports: [
		DefaultDialogComponent,
		MatButtonModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule,
	],
	templateUrl: './profile-dialog.html',
	styleUrl: './profile-dialog.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDialog {
	protected readonly editing = signal(false);
}
