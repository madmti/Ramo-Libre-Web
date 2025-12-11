export interface Serializable<T> {
	toSerial(): T;
	fromSerial(json: T): void;
}
