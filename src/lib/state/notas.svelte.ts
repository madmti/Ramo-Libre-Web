import type { Serializable } from '$lib/types/state';
import { SvelteMap } from 'svelte/reactivity';

interface Tag {
	name: string;
	color: string;
}
type TagKey = string;

interface Evaluacion {
	name: string;
	weight: number;
	tags: TagKey[];
}
type EvaluacionKey = string;
type RamoKey = string;

interface RamoData {
	evaluaciones: SvelteMap<EvaluacionKey, Evaluacion>;
	tags: SvelteMap<TagKey, Tag>;
}

type NotasSerial = {
	ramos: [RamoKey, {
		evaluaciones: [EvaluacionKey, Evaluacion][];
		tags: [TagKey, Tag][];
	}][];
};

export class NotasManager implements Serializable<NotasSerial> {
	private _ramos = $state<SvelteMap<RamoKey, RamoData>>(
		new SvelteMap<RamoKey, RamoData>()
	);

	fromSerial(serial: NotasSerial) {
		// console.log('NotasManager.fromSerial called with:', serial);
		const ramosMap = new SvelteMap<RamoKey, RamoData>();
		
		// Validar que serial y serial.ramos existan
		if (serial && serial.ramos && Array.isArray(serial.ramos)) {
			// console.log('Processing ramos:', serial.ramos.length);
			serial.ramos.forEach(([ramoId, ramoSerial]) => {
				ramosMap.set(ramoId, {
					evaluaciones: new SvelteMap<EvaluacionKey, Evaluacion>(ramoSerial.evaluaciones || []),
					tags: new SvelteMap<TagKey, Tag>(ramoSerial.tags || [])
				});
			});
		} else {
			// console.log('No valid ramos data found, using empty structure');
		}
		
		this._ramos = ramosMap;
	}

	toSerial(): NotasSerial {
		return {
			ramos: Array.from(this._ramos.entries()).map(([ramoId, ramoData]) => [
				ramoId,
				{
					evaluaciones: Array.from(ramoData.evaluaciones.entries()),
					tags: Array.from(ramoData.tags.entries())
				}
			])
		};
	}

	clear(): void {
		this._ramos.clear();
	}

	empty(): boolean {
		return this._ramos.size === 0;
	}

	// Asegurar que existe la estructura de datos para un ramo
	private ensureRamoData(ramoId: RamoKey): RamoData {
		if (!this._ramos.has(ramoId)) {
			this._ramos.set(ramoId, {
				evaluaciones: new SvelteMap<EvaluacionKey, Evaluacion>(),
				tags: new SvelteMap<TagKey, Tag>()
			});
		}
		return this._ramos.get(ramoId)!;
	}

	// Obtener datos de evaluaciones para un ramo específico (solo lectura para derivados)
	getEvaluacionesData(ramoId: RamoKey) {
		const ramoData = this._ramos.get(ramoId);
		if (!ramoData) {
			return {
				list: [],
				map: new SvelteMap<EvaluacionKey, Evaluacion>()
			};
		}
		return {
			list: Array.from(ramoData.evaluaciones.entries()),
			map: ramoData.evaluaciones
		};
	}

	// Obtener datos de tags para un ramo específico (solo lectura para derivados)
	getTagsData(ramoId: RamoKey) {
		const ramoData = this._ramos.get(ramoId);
		if (!ramoData) {
			return {
				list: [],
				map: new SvelteMap<TagKey, Tag>()
			};
		}
		return {
			list: Array.from(ramoData.tags.entries()),
			map: ramoData.tags
		};
	}

	// Obtener API de evaluaciones para un ramo específico
	getEvaluaciones(ramoId: RamoKey) {
		const ramoData = this.ensureRamoData(ramoId);
		return {
			list: Array.from(ramoData.evaluaciones.entries()),
			map: ramoData.evaluaciones,
			add: (evaluacion: Evaluacion) => {
				const id = crypto.randomUUID();
				ramoData.evaluaciones.set(id, evaluacion);
				return id;
			},
			remove: (id: EvaluacionKey) => {
				ramoData.evaluaciones.delete(id);
			},
			get: (id: EvaluacionKey) => {
				return ramoData.evaluaciones.get(id);
			},
			has: (id: EvaluacionKey) => {
				return ramoData.evaluaciones.has(id);
			},
			update: (id: EvaluacionKey, evaluacion: Evaluacion) => {
				ramoData.evaluaciones.set(id, evaluacion);
			}
		};
	}

	// Obtener API de tags para un ramo específico
	getTags(ramoId: RamoKey) {
		const ramoData = this.ensureRamoData(ramoId);
		return {
			list: Array.from(ramoData.tags.entries()),
			map: ramoData.tags,
			add: (tag: Tag) => {
				const id = crypto.randomUUID();
				ramoData.tags.set(id, tag);
				return id;
			},
			remove: (id: TagKey) => {
				ramoData.tags.delete(id);
			},
			get: (id: TagKey) => {
				return ramoData.tags.get(id);
			},
			has: (id: TagKey) => {
				return ramoData.tags.has(id);
			},
			update: (id: TagKey, tag: Tag) => {
				ramoData.tags.set(id, tag);
			}
		};
	}

	// Obtener tag específico para un ramo (solo lectura)
	getTag(ramoId: RamoKey, tagId: TagKey): Tag | undefined {
		const ramoData = this._ramos.get(ramoId);
		return ramoData?.tags.get(tagId);
	}

	// Pintar evaluación con tag (para un ramo específico)
	paint(ramoId: RamoKey, evaluacionId: EvaluacionKey, tagId: TagKey) {
		const ramoData = this.ensureRamoData(ramoId);
		const evaluacion = ramoData.evaluaciones.get(evaluacionId);
		if (!evaluacion || evaluacion.tags.includes(tagId)) return;

		const newEvaluacion = { ...evaluacion, tags: [...evaluacion.tags, tagId] };
		ramoData.evaluaciones.set(evaluacionId, newEvaluacion);
	}

	// Despintar evaluación (para un ramo específico)
	unpaint(ramoId: RamoKey, evaluacionId: EvaluacionKey, tagId: TagKey) {
		const ramoData = this.ensureRamoData(ramoId);
		const evaluacion = ramoData.evaluaciones.get(evaluacionId);
		if (!evaluacion || !evaluacion.tags.includes(tagId)) return;

		const newEvaluacion = {
			...evaluacion,
			tags: evaluacion.tags.filter((tid) => tid !== tagId)
		};
		ramoData.evaluaciones.set(evaluacionId, newEvaluacion);
	}

	// Toggle paint evaluación (para un ramo específico)
	togglePaint(ramoId: RamoKey, evaluacionId: EvaluacionKey, tagId: TagKey) {
		const ramoData = this.ensureRamoData(ramoId);
		const evaluacion = ramoData.evaluaciones.get(evaluacionId);

		if (!evaluacion) {
			return;
		}

		if (evaluacion.tags.includes(tagId)) {
			this.unpaint(ramoId, evaluacionId, tagId);
		} else {
			this.paint(ramoId, evaluacionId, tagId);
		}
	}

	// Obtener peso total de evaluaciones para un ramo específico
	getCurrentWeight(ramoId: RamoKey): number {
		const ramoData = this._ramos.get(ramoId);
		if (!ramoData) return 0;

		return Array.from(ramoData.evaluaciones.values()).reduce(
			(acc, evaluacion) => acc + evaluacion.weight,
			0
		);
	}

	// Remover tag de todas las evaluaciones de un ramo específico
	removeTagFromAllEvaluaciones(ramoId: RamoKey, tagId: TagKey) {
		const ramoData = this._ramos.get(ramoId);
		if (!ramoData) return;

		for (const [id, evaluacion] of ramoData.evaluaciones.entries()) {
			if (evaluacion.tags.includes(tagId)) {
				evaluacion.tags = evaluacion.tags.filter((tid) => tid !== tagId);
				ramoData.evaluaciones.set(id, evaluacion);
			}
		}
	}

	// Limpiar datos de un ramo específico
	clearRamo(ramoId: RamoKey): void {
		this._ramos.delete(ramoId);
	}

	// Verificar si un ramo tiene datos
	hasRamoData(ramoId: RamoKey): boolean {
		const ramoData = this._ramos.get(ramoId);
		if (!ramoData) return false;
		return ramoData.evaluaciones.size > 0 || ramoData.tags.size > 0;
	}

	// Obtener lista de ramos con datos
	getRamosWithData(): RamoKey[] {
		return Array.from(this._ramos.keys()).filter(ramoId => this.hasRamoData(ramoId));
	}
}