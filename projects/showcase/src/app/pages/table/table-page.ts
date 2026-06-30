import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
	WritableSignal,
} from '@angular/core';
import { Config, TableComponent, TableEvent } from '@ferhaps/easy-ui-lib';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { DemoCard } from '../../shared/components/demo-card/demo-card';
import { CodeBlock } from '../../shared/components/code-block/code-block';
import { EventLog } from '../../shared/components/event-log/event-log';

type Member = {
	id: number;
	name: string;
	role: string;
	status: 'active' | 'inactive';
	email: string;
};

const NAMES = [
	'Ada Lovelace',
	'Alan Turing',
	'Grace Hopper',
	'Linus Torvalds',
	'Margaret Hamilton',
	'Dennis Ritchie',
	'Barbara Liskov',
	'Ken Thompson',
	'Katherine Johnson',
	'Tim Berners-Lee',
	'Radia Perlman',
	'Donald Knuth',
	'Hedy Lamarr',
	'John Carmack',
	'Anita Borg',
	'Bjarne Stroustrup',
	'Carol Shaw',
	'James Gosling',
	'Adele Goldberg',
	'Guido van Rossum',
];

const ROLES = ['Admin', 'Engineer', 'Designer', 'Manager', 'Analyst'];

function makeMembers(): Member[] {
	return NAMES.map((name, i) => ({
		id: i + 1,
		name,
		role: ROLES[i % ROLES.length],
		status: i % 3 === 0 ? 'inactive' : 'active',
		email: name.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com',
	}));
}

@Component({
	selector: 'app-table-page',
	imports: [TableComponent, PageHeading, DemoCard, CodeBlock, EventLog],
	templateUrl: './table-page.html',
	styleUrl: './table-page.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePage {
	// ---- Table 1: sortable -------------------------------------------------
	private readonly baseMembers = makeMembers();
	protected readonly sortableMembers = signal<Member[]>(this.baseMembers);
	protected readonly sortableLog = signal<string[]>([]);

	protected readonly sortableConfig = computed<Config<Member>>(() => ({
		title: 'Team members',
		data: this.sortableMembers(),
		dataProps: ['name', 'role', 'status', 'email'],
		tableHeadings: ['Name', 'Role', 'Status', 'Email'],
		sortable: true,
		selectableRows: 'single',
		trackBy: (m) => m.id,
		options: (m) =>
			m.status === 'active'
				? ['Edit', 'Deactivate']
				: ['Edit', 'Activate', 'Delete'],
		classRules: [
			{
				className: 'cell-active',
				condition: (m, prop) => prop === 'status' && m.status === 'active',
			},
			{
				className: 'cell-inactive',
				condition: (m, prop) => prop === 'status' && m.status === 'inactive',
			},
		],
	}));

	protected onSortable(event: TableEvent<Member>): void {
		if (event.action === 'scroll') {
			return; // fires on every scroll frame — too noisy to log
		}
		if (event.action === 'sort' && event.prop) {
			this.applySort(event.prop, event.sortState ?? 'none');
		}
		this.log(this.sortableLog, this.describe(event));
	}

	private applySort(prop: keyof Member, state: 'none' | 'asc' | 'desc'): void {
		if (state === 'none') {
			this.sortableMembers.set([...this.baseMembers]);
			return;
		}
		const dir = state === 'asc' ? 1 : -1;
		const sorted = [...this.sortableMembers()].sort(
			(a, b) => String(a[prop]).localeCompare(String(b[prop])) * dir,
		);
		this.sortableMembers.set(sorted);
	}

	// ---- Table 2: draggable + multi-select --------------------------------
	// The computed only recomputes when `draggableMembers` changes. The library
	// reorders the array in place on drag (no signal write), so the cached
	// config — and thus the current selection — survives a reorder.
	protected readonly draggableMembers = signal<Member[]>(
		makeMembers().slice(0, 6),
	);
	protected readonly draggableLog = signal<string[]>([]);
	private addCounter = 0;

	protected readonly draggableConfig = computed<Config<Member>>(() => ({
		title: 'Drag to reorder',
		data: this.draggableMembers(),
		dataProps: ['name', 'role', 'status'],
		tableHeadings: ['Name', 'Role', 'Status'],
		draggable: true,
		withAdd: true,
		selectableRows: 'multiple',
		trackBy: (m) => m.id,
		options: ['Edit', 'Remove'],
	}));

	protected onDraggable(event: TableEvent<Member>): void {
		if (event.action === 'add') {
			this.addCounter += 1;
			this.draggableMembers.update((list) => [
				...list,
				{
					id: 1000 + this.addCounter,
					name: `New Member ${this.addCounter}`,
					role: 'Engineer',
					status: 'active',
					email: `new.member.${this.addCounter}@example.com`,
				},
			]);
		}
		if (event.action === 'remove' && event.obj) {
			const removed = event.obj;
			this.draggableMembers.update((list) =>
				list.filter((m) => m.id !== removed.id),
			);
		}
		this.log(this.draggableLog, this.describe(event));
	}

	// ---- helpers ----------------------------------------------------------
	private describe(e: TableEvent<Member>): string {
		switch (e.action) {
			case 'sort':
				return `sort → ${String(e.prop)} (${e.sortState})`;
			case 'rowClick':
				return `rowClick → ${e.obj?.name} (selected: ${e.selected})`;
			case 'rowSelect':
				return `rowSelect → rows [${(e.selectedRows ?? []).join(', ')}]`;
			case 'drag':
				return `drag → ${e.obj?.name} to position ${(e.index ?? 0) + 1}`;
			case 'scrolled':
				return 'scrolled → reached bottom (load more here)';
			case 'add':
				return 'add → add button clicked';
			default:
				return `${e.action} → ${e.obj?.name ?? ''}`.trim();
		}
	}

	private log(target: WritableSignal<string[]>, line: string): void {
		target.update((lines) => [...lines.slice(-30), line]);
	}

	protected readonly snippet = `config: Config<Member> = {
  title: 'Team members',
  data: members,
  dataProps: ['name', 'role', 'status', 'email'],
  tableHeadings: ['Name', 'Role', 'Status', 'Email'],
  sortable: true,
  selectableRows: 'single',
  trackBy: (m) => m.id,
  options: (m) =>
    m.status === 'active'
      ? ['Edit', 'Deactivate']
      : ['Edit', 'Activate', 'Delete'],
  classRules: [
    { className: 'cell-active',
      condition: (m, p) => p === 'status' && m.status === 'active' },
    { className: 'cell-inactive',
      condition: (m, p) => p === 'status' && m.status === 'inactive' },
  ],
};

// template
<lib-table [config]="config" (action)="onAction($event)" />`;
}
