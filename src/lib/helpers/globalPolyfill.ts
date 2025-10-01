// Polyfill for global object in browser environment
declare const global: any;
if (typeof global === 'undefined') {
	(window as any).global = window;
}
