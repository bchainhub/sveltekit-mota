// Polyfill for global object in browser environment
if (typeof global === 'undefined') {
	(window as any).global = window;
}
