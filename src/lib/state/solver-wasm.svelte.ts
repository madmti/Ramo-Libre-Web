import { browser } from '$app/environment';

interface SolverWASMState {
	isLoading: boolean;
	isReady: boolean;
	error: string | null;
}

class SolverWASMManager {
	private _state = $state<SolverWASMState>({
		isLoading: false,
		isReady: false,
		error: null
	});

	private solveProcessApi: ((input: string) => string) | null = null;
	private initializationPromise: Promise<void> | null = null;

	get isLoading() {
		return this._state.isLoading;
	}

	get isReady() {
		return this._state.isReady;
	}

	get error() {
		return this._state.error;
	}

	constructor() {
		// Auto-initialize when in browser
		if (browser) {
			this.initialize();
		}
	}

	async initialize(): Promise<void> {
		if (!browser) {
			return;
		}

		// Return existing promise if already initializing
		if (this.initializationPromise) {
			return this.initializationPromise;
		}

		// Don't reinitialize if already ready
		if (this._state.isReady) {
			return;
		}

		this.initializationPromise = this._doInitialize();
		return this.initializationPromise;
	}

	private async _doInitialize(): Promise<void> {
		this._state.isLoading = true;
		this._state.error = null;

		try {
			const wasmPath = '/wasm/solver.js';
			const modulePkg = await import(/* @vite-ignore */ wasmPath);
			const ModuleFactory = modulePkg.default || modulePkg;

			const wasmInstance = await ModuleFactory({
				locateFile: (path: string) => `/wasm/${path}`
			});

			this.solveProcessApi = wasmInstance.cwrap('solve_process', 'string', ['string']);

			this._state.isReady = true;
			this._state.isLoading = false;
		} catch (error) {
			console.error('Error crítico cargando WASM:', error);
			this._state.error = error instanceof Error ? error.message : 'Error desconocido';
			this._state.isLoading = false;
			this.initializationPromise = null; // Allow retry
		}
	}

	async solve(inputJson: string): Promise<{ success: boolean; result?: unknown; error?: string }> {
		// Ensure WASM is initialized before solving
		if (!this._state.isReady && !this._state.isLoading) {
			await this.initialize();
		}

		// Wait for initialization to complete
		if (this.initializationPromise) {
			await this.initializationPromise;
		}

		if (!this.solveProcessApi || !this._state.isReady) {
			return {
				success: false,
				error: 'El módulo WASM no está listo'
			};
		}

		try {
			const rawResult = this.solveProcessApi(inputJson);
			const parsed = JSON.parse(rawResult);

			return {
				success: true,
				result: parsed
			};
		} catch (error) {
			console.error('Error ejecutando solver:', error);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Error desconocido'
			};
		}
	}

	reset() {
		this._state.isLoading = false;
		this._state.isReady = false;
		this._state.error = null;
		this.solveProcessApi = null;
		this.initializationPromise = null;
	}

	// Utility method to wait for ready state
	async waitForReady(): Promise<boolean> {
		if (this._state.isReady) return true;

		if (!this._state.isLoading && !this.initializationPromise) {
			await this.initialize();
		}

		if (this.initializationPromise) {
			await this.initializationPromise;
		}

		return this._state.isReady;
	}
}

// Export singleton instance
export const solverWASM = new SolverWASMManager();
