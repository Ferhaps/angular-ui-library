import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NAV_ITEMS } from '../../nav';
import { CodeBlock } from '../../shared/code-block';

@Component({
	selector: 'app-home',
	imports: [RouterLink, MatIconModule, CodeBlock],
	template: `
		<section class="hero">
			<span class="eyebrow">Angular {{ angularMajor }} · Material</span>
			<h1>
				<code>&#64;ferhaps/easy-ui-lib</code>
			</h1>
			<p class="lead muted">
				A small, opinionated set of reusable Angular components, directives,
				pipes and services built on Angular Material &amp; CDK. This app
				demonstrates every public feature the library ships.
			</p>

			<app-code-block [code]="installSnippet" />
		</section>

		<h2 class="section-title">Explore the features</h2>
		<div class="grid">
			@for (item of items; track item.path) {
				<a class="feature" [routerLink]="item.path">
					<div class="feature-top">
						<mat-icon>{{ item.icon }}</mat-icon>
						<span class="kind">{{ item.kind }}</span>
					</div>
					<h3>{{ item.title }}</h3>
					<p class="muted">{{ item.blurb }}</p>
					<span class="go">
						Open <mat-icon>arrow_forward</mat-icon>
					</span>
				</a>
			}
		</div>
	`,
	styles: [
		`
			.hero {
				margin-bottom: 2.5rem;
			}
			.eyebrow {
				font-size: 0.8rem;
				font-weight: 500;
				letter-spacing: 0.04em;
				text-transform: uppercase;
				color: var(--mat-sys-primary, #6750a4);
			}
			.hero h1 {
				margin: 0.5rem 0 0.75rem;
				font-size: clamp(1.8rem, 4vw, 2.6rem);
			}
			.hero h1 code {
				font-family: inherit;
			}
			.lead {
				max-width: 70ch;
				font-size: 1.05rem;
				line-height: 1.55;
				margin: 0 0 1.5rem;
			}
			.section-title {
				margin: 0 0 1rem;
				font-size: 1.3rem;
			}
			.grid {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
				gap: 1rem;
			}
			.feature {
				display: flex;
				flex-direction: column;
				gap: 0.4rem;
				padding: 1.25rem;
				border-radius: 16px;
				background: var(--mat-sys-surface, #fff);
				border: 1px solid var(--mat-sys-outline-variant, #e3e1e6);
				transition:
					transform 0.15s ease,
					box-shadow 0.15s ease,
					border-color 0.15s ease;
			}
			.feature:hover {
				transform: translateY(-3px);
				border-color: var(--mat-sys-primary, #6750a4);
				box-shadow: 0 10px 30px rgba(103, 80, 164, 0.12);
			}
			.feature-top {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
			.feature-top mat-icon {
				color: var(--mat-sys-primary, #6750a4);
			}
			.kind {
				font-size: 0.65rem;
				text-transform: uppercase;
				letter-spacing: 0.05em;
				padding: 0.15rem 0.5rem;
				border-radius: 999px;
				background: var(--mat-sys-surface-container-high, #ece6f0);
				color: var(--mat-sys-on-surface-variant, #6b6b6b);
			}
			.feature h3 {
				margin: 0.25rem 0 0;
				font-size: 1.1rem;
			}
			.feature p {
				margin: 0;
				font-size: 0.9rem;
				line-height: 1.45;
				flex: 1;
			}
			.go {
				display: inline-flex;
				align-items: center;
				gap: 0.25rem;
				margin-top: 0.5rem;
				font-size: 0.85rem;
				font-weight: 500;
				color: var(--mat-sys-primary, #6750a4);
			}
			.go mat-icon {
				font-size: 18px;
				width: 18px;
				height: 18px;
			}
		`,
	],
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
