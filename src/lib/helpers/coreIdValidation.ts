import { validateWalletAddress } from 'blockchain-wallet-validator';

export type CoreIdField = 'coreId' | 'userCoreId';

export interface CoreIdValidationResult {
	isValid: boolean;
	isEnterprise: boolean;
	description?: string;
	metadata?: any;
	error?: string;
	touched?: boolean;
	field: CoreIdField;
}

/**
 * Validates a Core ID and returns a result object with all error states and messages.
 * @param id The Core ID string to validate.
 * @param updateField Which field is being validated ('coreId' or 'userCoreId').
 */
export function validateCoreId(id: string, updateField: CoreIdField, messages?: Record<string, string>): CoreIdValidationResult {
	if (!id) {
		return {
			isValid: false,
			isEnterprise: false,
			error: messages?.requiredError || 'Core ID is required',
			field: updateField,
			touched: updateField === 'coreId'
		};
	}

	try {
		const results = validateWalletAddress(id.trim(), { network: ['xcb'] });
		const { isValid, description, metadata } = results;
		const isEnterprise = !!metadata?.isEnterprise;

		if (isEnterprise) {
			return {
				isValid: false,
				isEnterprise: true,
				description,
				metadata,
				error: messages?.enterpriseError || 'Enterprise network addresses cannot be used for payments',
				field: updateField,
				touched: true
			};
		}

		return {
			isValid,
			isEnterprise: false,
			description: !isValid && description ? description : undefined,
			metadata,
			error: !isValid && description ? description : undefined,
			field: updateField,
			touched: true
		};
	} catch (error) {
		console.error('Error validating Core ID:', error);
		return {
			isValid: false,
			isEnterprise: false,
			error: messages?.error || 'Please enter a valid Core ID',
			field: updateField,
			touched: true
		};
	}
}
