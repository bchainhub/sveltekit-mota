export class ApiError extends Error {
	public readonly status: string;
	public readonly code?: number;
	public readonly errorCode?: number;

	constructor(
		status: string,
		code: number = 500,
		message: string = 'Unexpected API Error',
		errorCode?: number
	) {
		super(message ?? 'Unexpected API Error');
		this.status = status;
		this.code = code;
		this.errorCode = errorCode;
		Object.setPrototypeOf(this, ApiError.prototype);
	}
}
