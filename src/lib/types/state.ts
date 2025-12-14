export interface Serializable<T> {
	toSerial(): T;
	fromSerial(json: T): void;
	clear(): void;
	empty(): boolean;
}
