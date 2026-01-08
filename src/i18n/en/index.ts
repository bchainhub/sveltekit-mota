import type { BaseTranslation } from '../i18n-types'

const en: BaseTranslation = {
	site: {
		description: 'Mota ₡ore',
		keywords: 'mota, ₡ore, blockchain, ican, payto, oric, corepass, txms'
	},

	common: {
		loading: 'Loading…',
		error: 'Error',
		success: 'Success',
		cancel: 'Cancel',
		confirm: 'Confirm',
		close: 'Close',
		back: 'Back',
		next: 'Next',
		submit: 'Submit',
		save: 'Save',
		edit: 'Edit',
		delete: 'Delete',
		logout: 'Logout',
		online: 'Online',
		offline: 'Offline',
		theme: {
			light: 'Light',
			dark: 'Dark',
			system: 'System'
		},
		keys: {
			keyRegistry: 'Keys Registry',
			welcome: 'Welcome to the Keys Registry. Here you can find all types of keys for our services.',
			keyTypes: 'Key Types',
			keyTypeRegistry: '{key} Keys Registry',
			welcomeTypeRegistry: 'Registry for {key} keys. Here you can find all keys used in our services.',
			keyTypeInfo: 'Key Types',
			publicKeyFor: 'Public Key for {keyName}',
			keyId: 'Key ID: {keyId}',
			copyKey: 'Copy Key',
			downloadKey: 'Download {keyName}',
			viewOnKeyServer: 'View on Key Server'
		}
	},


	helpers: {
		keys: {
			copiedToClipboard: 'Key copied to clipboard',
			failedToCopy: 'Failed to copy key'
		},
		coreIdValidation: {
			error: 'Please enter a valid Core ID',
			enterpriseError: 'Enterprise network addresses cannot be used for payments',
			requiredError: 'Core ID is required'
		},
		wallet: {
			corePass: 'CorePass',
			corePassNotConfigured: 'CorePass extension is not configured.',
			corePassNotInstalled: 'CorePass extension is not installed or enabled.',
			corePassCannotConnect: 'Cannot connect to CorePass extension.',
			corePassDisconnected: 'CorePass disconnected.'
		}
	},

	navbar: {
		home: 'Home',
		support: 'Support',
		register: 'Register',
		profile: 'Profile',
		settings: 'Settings'
	},

	footer: {
		home: 'Home',
		ecosystem: 'Ecosystem',
		applications: 'Applications',
		developers: 'Developers',
		contact: 'Contact',
		termsOfService: 'Terms of Service',
		privacyPolicy: 'Privacy Policy',
		keyRegistry: 'Key Registry',
		copyright: '© Copyright 2025-{year} Mota'
	},

	auth: {
		login: 'Login',
		logout: 'Logout',
		register: 'Register',
		profile: 'Profile',
		settings: 'Settings',
		connect: 'Connect'
	},

	support: {
		title: 'Support',
		supportType: 'Support Type',
		askAI: 'Ask AI',
		createTicket: 'Create Ticket',
		subject: 'Subject',
		question: 'Question',
		followUpQuestion: 'Follow-up Question',
		askYourQuestion: 'Ask your question…',
		send: 'Send',
		processing: 'Processing…',
		sendTicketByEmail: 'Send Ticket by Email',
		aiResponse: 'AI Response',
		errors: {
			pleaseEnterYourQuestion: 'Please enter your question',
			aiServiceNotAvailable: 'AI service is not available',
			supportEmailNotConfigured: 'Support email is not configured',
			anErrorOccurredWhileAskingAI: 'An error occurred while asking AI',
			failedToGetAIResponse: 'Failed to get AI response',
			supportIsNotAvailable: 'Support is not available'
		},
		subjects: {
			general: 'General',
			payments: 'Payments',
			refunds: 'Refunds',
			other: 'Other'
		}
	}

};

export default en;
