import { effect, Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'showcase-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
	readonly dark = signal<boolean>(this.initialValue());

	constructor() {
		// Reflect the signal onto <html>: the `dark` class flips `color-scheme`,
		// which drives Material's light-dark() theme values. Persist the choice.
		effect(() => {
			const dark = this.dark();
			document.documentElement.classList.toggle('dark', dark);
			localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
		});
	}

	toggle(): void {
		this.dark.update((d) => !d);
	}

	private initialValue(): boolean {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored === 'dark' || stored === 'light') {
			return stored === 'dark';
		}
		return (
			window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
		);
	}
}
