import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { NAV_ITEMS } from '../../shared/nav';
import { CodeBlock } from '../../shared/components/code-block/code-block';

@Component({
	selector: 'app-home',
	imports: [RouterLink, MatCardModule, MatChipsModule, MatIconModule, CodeBlock],
	templateUrl: './home.html',
	styleUrl: './home.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
	protected readonly items = NAV_ITEMS;
	protected readonly angularMajor = 22;
	protected readonly installSnippet = `npm install @ferhaps/easy-ui-lib \\
  @angular/material @angular/cdk

# then import what you need, e.g.
import { TableComponent } from '@ferhaps/easy-ui-lib';`;
}
