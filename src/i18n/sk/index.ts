import type { Translation } from '../i18n-types';
import type { DeepPartial } from '$lib/helpers/i18n';
import { deepMergeDict } from '$lib/helpers/i18n';
import en from '../en/index';

const skPartial: DeepPartial<Translation> = {
	site: {
		description: 'Mota ₡ore',
		keywords: 'mota, ₡ore, blockchain, ican, payto, oric, corepass, txms'
	},

	common: {
		loading: 'Načítavam…',
		error: 'Chyba',
		success: 'Hotovo',
		cancel: 'Zrušiť',
		confirm: 'Potvrdiť',
		close: 'Zatvoriť',
		back: 'Späť',
		next: 'Ďalej',
		submit: 'Odoslať',
		save: 'Uložiť',
		edit: 'Upraviť',
		delete: 'Zmazať',
		logout: 'Odhlásiť sa',
		online: 'Online',
		offline: 'Offline',
		theme: {
			light: 'Svetlá',
			dark: 'Tmavá',
			system: 'Systémová'
		},
		keys: {
			keyRegistry: 'Register kľúčov',
			welcome: 'Vitajte v Registri kľúčov. Tu nájdete všetky typy kľúčov pre naše služby.',
			keyTypes: 'Typy kľúčov',
			keyTypeRegistry: 'Register kľúčov {key}',
			welcomeTypeRegistry: 'Register pre kľúče {key}. Tu nájdete všetky kľúče používané v našich službách.',
			keyTypeInfo: 'Typy kľúčov',
			publicKeyFor: 'Verejný kľúč pre {keyName}',
			keyId: 'ID kľúča: {keyId}',
			copyKey: 'Kopírovať kľúč',
			downloadKey: 'Stiahnuť {keyName}',
			viewOnKeyServer: 'Zobraziť na serveri kľúčov'
		}
	},

	helpers: {
		keys: {
			copiedToClipboard: 'Kľúč bol skopírovaný do schránky',
			failedToCopy: 'Nepodarilo sa skopírovať kľúč'
		},
		coreIdValidation: {
			error: 'Zadajte platné Core ID',
			enterpriseError: 'Adresy podnikovej siete nie je možné použiť na platby',
			requiredError: 'Core ID je povinné'
		},
		wallet: {
			corePass: 'CorePass',
			corePassNotConfigured: 'Rozšírenie CorePass nie je nakonfigurované.',
			corePassNotInstalled: 'Rozšírenie CorePass nie je nainštalované alebo povolené.',
			corePassCannotConnect: 'Nedá sa pripojiť k rozšíreniu CorePass.',
			corePassDisconnected: 'CorePass bol odpojený.'
		}
	},

	navbar: {
		home: 'Domov',
		support: 'Podpora',
		register: 'Registrácia',
		profile: 'Profil',
		settings: 'Nastavenia'
	},

	footer: {
		home: 'Domov',
		ecosystem: 'Ekosystém',
		applications: 'Aplikácie',
		developers: 'Vývojári',
		contact: 'Kontakt',
		termsOfService: 'Podmienky používania',
		privacyPolicy: 'Zásady ochrany súkromia',
		keyRegistry: 'Register kľúčov',
		copyright: '© 2025–{year} Wall Money'
	},

	auth: {
		login: 'Prihlásiť sa',
		logout: 'Odhlásiť sa',
		register: 'Registrácia',
		profile: 'Profil',
		settings: 'Nastavenia',
		connect: 'Pripojiť'
	},

	support: {
		title: 'Podpora',
		supportType: 'Typ podpory',
		askAI: 'Opýtať sa AI',
		createTicket: 'Vytvoriť tiket',
		subject: 'Predmet',
		question: 'Otázka',
		followUpQuestion: 'Doplňujúca otázka',
		askYourQuestion: 'Zadajte svoju otázku…',
		send: 'Odoslať',
		processing: 'Spracováva sa…',
		sendTicketByEmail: 'Odoslať tiket e-mailom',
		aiResponse: 'Odpoveď AI',
		errors: {
			pleaseEnterYourQuestion: 'Prosím, zadajte svoju otázku',
			aiServiceNotAvailable: 'Služba AI nie je dostupná',
			supportEmailNotConfigured: 'Podporný e-mail nie je nakonfigurovaný',
			anErrorOccurredWhileAskingAI: 'Pri komunikácii s AI sa vyskytla chyba',
			failedToGetAIResponse: 'Nepodarilo sa získať odpoveď od AI',
			supportIsNotAvailable: 'Podpora nie je dostupná'
		},
		subjects: {
			general: 'Všeobecné',
			payments: 'Platby',
			refunds: 'Vrátenie peňazí',
			other: 'Iné'
		}
	}

};

const sk: Translation = deepMergeDict(en as any, skPartial as DeepPartial<Translation>);
export default sk;
