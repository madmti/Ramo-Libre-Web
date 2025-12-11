import { browser } from '$app/environment';
import { SemestresManager } from './semestres.svelte';

const STORAGE_KEY = 'RAMOLIBRE_ROOT_STORE';

class RootStore {
	semestres = new SemestresManager();

	constructor() {
		if (browser) this.load();
		$effect.root(() => {
			$effect(() => {
				db.save();
			});
		});
	}

	private load() {
		const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
		// Cargar los datos en cada manager
		if (data.semestres) this.semestres.fromSerial(data.semestres);
	}

	save() {
		console.log('RootStore save triggered');
		if (!browser) return;
		// Recolectar los datos de cada manager
		const dump = {
			semestres: this.semestres.toSerial()
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(dump));
	}
}

export const db = new RootStore();
