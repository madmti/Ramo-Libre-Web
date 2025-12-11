import type { Serializable } from '$lib/types/state';

type SemestresSerial = {
	active: number | null;
	list: string[];
};

export class SemestresManager implements Serializable<SemestresSerial> {
	active = $state<number | null>(null);
	list = $state<string[]>([]);

	fromSerial(serial: SemestresSerial) {
		this.active = serial.active;
		this.list = serial.list || [];
	}

	toSerial(): SemestresSerial {
		return {
			active: this.active,
			list: [...this.list]
		};
	}

	add(name: string) {
		if (!name.trim()) return;
		this.list.push(name);
		if (this.list.length === 1) this.active = 0;
	}

	remove(index: number) {
		this.list.splice(index, 1);
		if (this.active === index) this.active = null;
		else if (this.active !== null && this.active > index) this.active--;
	}

	update(index: number, name: string) {
		this.list[index] = name;
	}

	setActive(index: number) {
		this.active = index;
	}
}
