import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Config, TableComponent } from './table.component';

type Row = { id: number; label: string; value: unknown };

describe('TableComponent', () => {
	let fixture: ComponentFixture<TableComponent<Row>>;
	let host: HTMLElement;

	beforeEach(() => {
		fixture = TestBed.createComponent(TableComponent<Row>);
		host = fixture.nativeElement;
	});

	function configWith(overrides: Partial<Config<Row>>): Config<Row> {
		return {
			title: 'Test',
			data: [],
			dataProps: ['label', 'value'],
			tableHeadings: ['Label', 'Value'],
			...overrides,
		};
	}

	function render(overrides: Partial<Config<Row>>): void {
		fixture.componentRef.setInput('config', configWith(overrides));
		fixture.detectChanges();
	}

	function bodyRows(): HTMLTableRowElement[] {
		return Array.from(host.querySelectorAll('tbody tr'));
	}

	function optionsButton(row: Element): HTMLButtonElement | null {
		return row.querySelector('button[aria-label="Row options"]');
	}

	for (const draggable of [false, true]) {
		describe(draggable ? 'draggable' : 'non-draggable', () => {
			it("renders only null, undefined and '' as '-'", () => {
				render({
					draggable,
					data: [
						{ id: 1, label: 'zero', value: 0 },
						{ id: 2, label: 'false', value: false },
						{ id: 3, label: 'null', value: null },
						{ id: 4, label: 'undefined', value: undefined },
						{ id: 5, label: 'empty', value: '' },
						{ id: 6, label: 'text', value: 'hello' },
					],
				});

				const values = bodyRows().map(
					(row) => row.querySelectorAll('td')[1].textContent?.trim(),
				);
				expect(values).toEqual(['0', 'false', '-', '-', '-', 'hello']);
			});

			describe('options column', () => {
				const rows: Row[] = [
					{ id: 1, label: 'open', value: 'a' },
					{ id: 2, label: 'locked', value: 'b' },
					{ id: 3, label: 'open', value: 'c' },
				];

				it('is not rendered when options is not set', () => {
					render({ draggable, data: rows });

					expect(host.querySelectorAll('thead th').length).toBe(2);
					expect(bodyRows().map((r) => r.cells.length)).toEqual([2, 2, 2]);
				});

				it('is not rendered for an empty static options array', () => {
					render({ draggable, data: rows, options: [] });

					expect(host.querySelectorAll('thead th').length).toBe(2);
					expect(bodyRows().map((r) => r.cells.length)).toEqual([2, 2, 2]);
					expect(bodyRows().some(optionsButton)).toBeFalse();
					expect(host.querySelector('table')?.classList).not.toContain(
						'with-options',
					);
				});

				it('shows a button on every row for a non-empty static array', () => {
					render({ draggable, data: rows, options: ['Edit'] });

					expect(host.querySelectorAll('thead th').length).toBe(3);
					expect(bodyRows().every(optionsButton)).toBeTrue();
				});

				it('keeps the column but renders an empty cell for rows whose function returns []', () => {
					render({
						draggable,
						data: rows,
						options: (row) => (row.label === 'locked' ? [] : ['Edit']),
					});

					expect(host.querySelectorAll('thead th').length).toBe(3);
					expect(bodyRows().map((r) => r.cells.length)).toEqual([3, 3, 3]);
					expect(bodyRows().map((r) => !!optionsButton(r))).toEqual([
						true,
						false,
						true,
					]);
					expect(bodyRows()[1].cells[2].textContent?.trim()).toBe('');
				});
			});
		});
	}

	it("lists each row's own options in its menu", () => {
		render({
			data: [
				{ id: 1, label: 'first', value: 'a' },
				{ id: 2, label: 'second', value: 'b' },
			],
			options: (row) => [`Edit ${row.label}`],
		});

		optionsButton(bodyRows()[1])?.click();
		fixture.detectChanges();

		const items = Array.from(
			document.querySelectorAll('.mat-mdc-menu-item'),
		).map((item) => item.textContent?.trim());
		expect(items).toEqual(['Edit second']);
	});

	it('calls the options function once per row per render', () => {
		const data: Row[] = [
			{ id: 1, label: 'open', value: 'a' },
			{ id: 2, label: 'locked', value: 'b' },
			{ id: 3, label: 'open', value: 'c' },
		];
		const options = jasmine
			.createSpy('options')
			.and.callFake((row: Row) => (row.label === 'locked' ? [] : ['Edit']));
		render({ data, options });

		options.calls.reset();
		fixture.componentRef.setInput('config', configWith({ data, options }));
		// Skip the dev-mode checkNoChanges pass, which re-evaluates the template.
		fixture.detectChanges(false);

		expect(options.calls.count()).toBe(data.length);
	});
});
