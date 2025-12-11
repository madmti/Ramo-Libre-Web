import { browser } from '$app/environment';
import { SemestresManager } from './semestres.svelte';
import { RamosManager } from './ramos.svelte';

const STORAGE_KEY = (sem: string) => `RAMOLIBRE_ROOT_STORE_V1_${sem}`;
const SEMESTER_KEY = 'RAMOLIBRE_SEMESTER';

class RootStore {
	private _semestres = new SemestresManager();
	private _ramos = new RamosManager();

	get semestres() {
		return this._semestres;
	}

	get ramos() {
		return this._ramos;
	}

	get empty(): boolean {
		return this._semestres.empty() && this._ramos.empty();
	}

	constructor() {
		if (browser) this.load();
		$effect.root(() => {
			$effect(() => {
				db.save();
			});
		});

		$effect.root(() => {
			$effect(() => {
				const activeSemester = this.semestres.activeName;
				if (browser && activeSemester !== undefined) {
					this.loadCurrentSemesterRamos();
				}
			});
		});
	}

	private load() {
		// Load semester data first
		const semesterData = JSON.parse(localStorage.getItem(SEMESTER_KEY) || '{}');
		if (semesterData) this.semestres.fromSerial(semesterData);

		// Load current semester's ramo data
		this.loadCurrentSemesterRamos();
	}

	private loadCurrentSemesterRamos() {
		console.log('Loading ramos for current semester');
		const semester = this.semestres.activeName ?? 'default';
		const data = JSON.parse(localStorage.getItem(STORAGE_KEY(semester)) || '{}');
		// Cargar datos
		this.ramos.fromSerial(data.ramos ?? []);
	}

	deleteSemesterData(semesterName: string) {
		if (!browser) return;

		const storageKey = STORAGE_KEY(semesterName);
		localStorage.removeItem(storageKey);

		// Find and remove the semester from the list
		const semesterIndex = this.semestres.list.findIndex((name) => name === semesterName);
		if (semesterIndex !== -1) {
			this.clear(semesterIndex);
		}
	}

	private clear(semester?: number) {
		if (semester !== undefined) {
			this.semestres.remove(semester);
		} else {
			this.semestres.clear();
		}
		this.ramos.clear();
	}

	private save() {
		console.log('RootStore save triggered');
		if (!browser) return;
		// Recolectar los datos de cada manager
		const semesterSnapshot = {
			ramos: this.ramos.toSerial()
		};
		const semester = this.semestres.activeName ?? 'default';
		const semesters = this.semestres.toSerial();

		localStorage.setItem(STORAGE_KEY(semester), JSON.stringify(semesterSnapshot));
		localStorage.setItem(SEMESTER_KEY, JSON.stringify(semesters));
	}
}

export const db = new RootStore();
