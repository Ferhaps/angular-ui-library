import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Renderer2,
	computed,
	effect,
	forwardRef,
	inject,
	input,
	model,
	output,
	signal,
	viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import type { FormValueControl } from '@angular/forms/signals';
import { MatIconModule } from '@angular/material/icon';
import { Subject, debounce, distinctUntilChanged, map, timer } from 'rxjs';

/**
 * A debounced search input that works with all three Angular forms styles:
 *  - Reactive / template-driven forms via `ControlValueAccessor`
 *    (`[formControl]`, `formControlName`, `[(ngModel)]`).
 *  - Signal Forms via `FormValueControl` (`[formField]`).
 *
 * The committed value (debounced + trimmed) is exposed as the `value` model, so
 * Signal Forms binds to it directly; the same value flows through the CVA
 * callbacks and the `search` output.
 */
@Component({
	selector: 'eui-search-bar',
	templateUrl: './search-bar.component.html',
	styleUrl: './search-bar.component.scss',
	imports: [MatIconModule],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => SearchBarComponent),
			multi: true,
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent implements ControlValueAccessor, FormValueControl<string> {
	public for = input.required<string>();
	public debounceMs = input(300);

	// --- Signal Forms (FormValueControl) contract -------------------------
	/** The committed (debounced, trimmed) value. Bind with `[formField]`. */
	public readonly value = model<string>('');
	/** Bound automatically by the `[formField]` directive. */
	public readonly disabled = input<boolean>(false);
	public readonly readonly = input<boolean>(false);
	/** Emitted on blur so Signal Forms can mark the field as touched. */
	public readonly touch = output<void>();

	public readonly search = output<string>();

	private readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');
	private readonly renderer = inject(Renderer2);

	// Disabled can come from Signal Forms (the `disabled` input) or a CVA host
	// (`setDisabledState`); the input reflects either source.
	private readonly cvaDisabled = signal(false);
	protected readonly isDisabled = computed(
		() => this.disabled() || this.cvaDisabled(),
	);

	private readonly rawInput$ = new Subject<string>();
	private onChange: (value: string) => void = () => {};
	private onTouched: () => void = () => {};

	constructor() {
		this.rawInput$
			.pipe(
				// `debounce` re-reads the signal each emission, so `[debounceMs]`
				// can change at runtime.
				debounce(() => timer(this.debounceMs())),
				map((raw) => raw.trim()),
				distinctUntilChanged(),
				takeUntilDestroyed(),
			)
			.subscribe((trimmed) => this.commit(trimmed));

		// Reflect external value changes (writeValue / Signal Forms) into the
		// input, without clobbering the user's in-progress (untrimmed) text: if
		// the field already trims to the incoming value, it is our own commit.
		effect(() => {
			const next = this.value() ?? '';
			const el = this.inputRef()?.nativeElement;
			if (!el || el.value.trim() === next) {
				return;
			}
			this.renderer.setProperty(el, 'value', next);
		});
	}

	protected onInput(event: Event): void {
		this.rawInput$.next((event.target as HTMLInputElement).value);
	}

	protected onBlur(): void {
		this.onTouched();
		this.touch.emit();
	}

	private commit(value: string): void {
		this.value.set(value);
		this.onChange(value); // notifies a reactive/template-driven form control
		this.search.emit(value);
	}

	// --- ControlValueAccessor (reactive + template-driven forms) ----------
	public writeValue(value: string): void {
		this.value.set(value ?? '');
	}

	public registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	public registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean): void {
		this.cvaDisabled.set(isDisabled);
	}
}
