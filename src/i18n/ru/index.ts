import type { Translation } from '../i18n-types';
import type { DeepPartial } from '$lib/helpers/i18n';
import { deepMergeDict } from '$lib/helpers/i18n';
import en from '../en/index';

const ruPartial: DeepPartial<Translation> = {
	site: {
		description: 'Mota ₡ore',
		keywords: 'mota, ₡ore, blockchain, ican, payto, oric, corepass, txms'
	},

	common: {
		loading: 'Загрузка…',
		error: 'Ошибка',
		success: 'Успешно',
		cancel: 'Отмена',
		confirm: 'Подтвердить',
		close: 'Закрыть',
		back: 'Назад',
		next: 'Далее',
		submit: 'Отправить',
		save: 'Сохранить',
		edit: 'Редактировать',
		delete: 'Удалить',
		logout: 'Выйти',
		online: 'В сети',
		offline: 'Не в сети',
		theme: {
			light: 'Светлая',
			dark: 'Тёмная',
			system: 'Системная'
		},
		keys: {
			keyRegistry: 'Реестр ключей',
			welcome: 'Добро пожаловать в Реестр ключей. Здесь вы можете найти все виды ключей для наших сервисов.',
			keyTypes: 'Типы ключей',
			keyTypeRegistry: 'Реестр ключей {key}',
			welcomeTypeRegistry: 'Реестр для ключей {key}. Здесь вы можете найти все ключи, используемые в наших сервисах.',
			keyTypeInfo: 'Типы ключей',
			publicKeyFor: 'Публичный ключ для {keyName}',
			keyId: 'ID ключа: {keyId}',
			copyKey: 'Копировать ключ',
			downloadKey: 'Скачать {keyName}',
			viewOnKeyServer: 'Посмотреть на сервере ключей'
		}
	},

	helpers: {
		keys: {
			copiedToClipboard: 'Ключ скопирован в буфер обмена',
			failedToCopy: 'Не удалось скопировать ключ'
		},
		coreIdValidation: {
			error: 'Пожалуйста, введите корректный Core ID',
			enterpriseError: 'Адреса корпоративной сети не могут использоваться для платежей',
			requiredError: 'Core ID обязателен для заполнения'
		},
		wallet: {
			corePass: 'CorePass',
			corePassNotConfigured: 'Расширение CorePass не настроено.',
			corePassNotInstalled: 'Расширение CorePass не установлено или не включено.',
			corePassCannotConnect: 'Не удаётся подключить расширение CorePass.',
			corePassDisconnected: 'CorePass отключён.'
		}
	},

	navbar: {
		home: 'Главная',
		support: 'Поддержка',
		register: 'Регистрация',
		profile: 'Профиль',
		settings: 'Настройки'
	},

	footer: {
		home: 'Главная',
		ecosystem: 'Экосистема',
		applications: 'Приложения',
		developers: 'Разработчикам',
		contact: 'Контакты',
		termsOfService: 'Условия обслуживания',
		privacyPolicy: 'Политика конфиденциальности',
		keyRegistry: 'Реестр ключей',
		copyright: '© 2025–{year} Wall Money'
	},

	auth: {
		login: 'Войти',
		logout: 'Выйти',
		register: 'Регистрация',
		profile: 'Профиль',
		settings: 'Настройки',
		connect: 'Подключить'
	},

	support: {
		title: 'Поддержка',
		supportType: 'Тип поддержки',
		askAI: 'Спросить ИИ',
		createTicket: 'Создать тикет',
		subject: 'Тема',
		question: 'Вопрос',
		followUpQuestion: 'Дополнительный вопрос',
		askYourQuestion: 'Задайте свой вопрос…',
		send: 'Отправить',
		processing: 'Обработка…',
		sendTicketByEmail: 'Отправить тикет по электронной почте',
		aiResponse: 'Ответ ИИ',
		errors: {
			pleaseEnterYourQuestion: 'Пожалуйста, введите ваш вопрос',
			aiServiceNotAvailable: 'Сервис ИИ недоступен',
			supportEmailNotConfigured: 'Электронная почта поддержки не настроена',
			anErrorOccurredWhileAskingAI: 'Произошла ошибка при обращении к ИИ',
			failedToGetAIResponse: 'Не удалось получить ответ от ИИ',
			supportIsNotAvailable: 'Поддержка недоступна'
		},
		subjects: {
			general: 'Общие',
			payments: 'Платежи',
			refunds: 'Возвраты',
			other: 'Другое'
		}
	}

};

const ru: Translation = deepMergeDict(en as any, ruPartial as DeepPartial<Translation>);
export default ru;
