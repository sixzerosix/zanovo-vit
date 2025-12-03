// 1. Константы

/**
 * CF7 Proxy Form - TypeScript Version
 * Синхронизирует видимую форму с скрытой CF7 формой
 */

// ============================================================================
// TYPES
// ============================================================================

type OverlayState = 'hidden' | 'loading' | 'success' | 'error';

interface FieldMapping {
	readonly [key: string]: string;
}

interface FormElements {
	form: HTMLFormElement;
	submitBtn: HTMLButtonElement;
	nameInput: HTMLInputElement;
	phoneInput: HTMLInputElement;
	noteInput: HTMLTextAreaElement;
	subjectInput: HTMLInputElement;
	privacyCheckbox: HTMLInputElement;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const HIDDEN_FORM_ID = document.querySelector("[data-form-target]")?.getAttribute("data-form-target") || '';
const FIELD_MAPPING: FieldMapping = {
	name: 'your-name',
	phone: 'your-phone',
	note: 'your-message',
	subject: 'your-subject'
} as const;

const PHONE_DIGITS_LENGTH = 10;

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
	const elements = getFormElements();

	if (!elements) {
		console.error('Form elements not found');
		return;
	}

	initContextButtons(elements.subjectInput);
	initPhoneMask(elements.phoneInput, () => validateForm(elements));
	initValidation(elements);
	initFormHandler(elements);
});

// ============================================================================
// DOM HELPERS
// ============================================================================

/**
 * Безопасное получение всех элементов формы с проверкой типов
 */
function getFormElements(): FormElements | null {
	const form = document.getElementById('visible-form') as HTMLFormElement | null;
	const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null;
	const nameInput = document.getElementById('name') as HTMLInputElement | null;
	const phoneInput = document.getElementById('phone') as HTMLInputElement | null;
	const noteInput = document.getElementById('note') as HTMLTextAreaElement | null;
	const subjectInput = document.getElementById('subject') as HTMLInputElement | null;
	const privacyCheckbox = document.getElementById('privacy') as HTMLInputElement | null;

	if (!form || !submitBtn || !nameInput || !phoneInput || !noteInput || !subjectInput || !privacyCheckbox) {
		return null;
	}

	return { form, submitBtn, nameInput, phoneInput, noteInput, subjectInput, privacyCheckbox };
}

// ============================================================================
// CONTEXT BUTTONS (Установка темы/контекста)
// ============================================================================

/**
 * Инициализация кнопок с атрибутом data-context
 * При клике устанавливает значение в скрытое поле subject
 */
function initContextButtons(subjectInput: HTMLInputElement): void {
	const buttons = document.querySelectorAll<HTMLButtonElement>('.trigger-context-btn');

	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			const context = btn.getAttribute('data-context');

			if (context) {
				subjectInput.value = context;
				console.log('Context set:', context);
			}
		});
	});
}

// ============================================================================
// PHONE MASK
// ============================================================================

/**
 * Форматирует телефон в формат (XXX) XXX-XX-XX
 */
function formatPhone(value: string): string {
	const digits = value.replace(/\D/g, '');

	let formatted = '';
	if (digits.length > 0) {
		formatted += '(' + digits.substring(0, 3);
	}
	if (digits.length >= 4) {
		formatted += ') ' + digits.substring(3, 6);
	}
	if (digits.length >= 7) {
		formatted += '-' + digits.substring(6, 8);
	}
	if (digits.length >= 9) {
		formatted += '-' + digits.substring(8, 10);
	}

	return formatted;
}

/**
 * Инициализация маски ввода телефона
 */
function initPhoneMask(phoneInput: HTMLInputElement, onValidate: () => void): void {
	// Форматирование при вводе
	phoneInput.addEventListener('input', (e) => {
		const input = e.target as HTMLInputElement;
		const start = input.selectionStart || 0;
		const oldLength = input.value.length;

		const newVal = formatPhone(input.value);
		input.value = newVal;

		// Умное восстановление позиции курсора
		const newLength = newVal.length;
		const diff = newLength - oldLength;
		const newPos = Math.max(0, Math.min(start + diff, newLength));

		input.setSelectionRange(newPos, newPos);

		onValidate();
	});

	// Запрет ввода не-цифр
	phoneInput.addEventListener('keydown', (e) => {
		const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete', 'Home', 'End'];

		if (allowedKeys.includes(e.key)) {
			return;
		}

		if (!/\d/.test(e.key)) {
			e.preventDefault();
		}
	});

	// Запрет вставки не-цифр
	phoneInput.addEventListener('paste', (e) => {
		e.preventDefault();
		const pastedText = e.clipboardData?.getData('text') || '';
		const digits = pastedText.replace(/\D/g, '');

		if (digits) {
			const formatted = formatPhone(digits);
			phoneInput.value = formatted;
			onValidate();
		}
	});
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Валидация формы и управление состоянием кнопки submit
 */
function validateForm(elements: FormElements): void {
	const { nameInput, phoneInput, privacyCheckbox, submitBtn } = elements;

	// 1. Имя: не пустое (минимум 2 символа для реалистичности)
	const isNameValid = nameInput.value.trim().length >= 2;

	// 2. Телефон: ровно 10 цифр
	const phoneDigits = phoneInput.value.replace(/\D/g, '');
	const isPhoneValid = phoneDigits.length === PHONE_DIGITS_LENGTH;

	// 3. Чекбокс согласия
	const isPrivacyValid = privacyCheckbox.checked;

	// Общий статус
	const isValid = isNameValid && isPhoneValid && isPrivacyValid;

	// Управление кнопкой
	submitBtn.disabled = !isValid;

	// Визуальная обратная связь (опционально)
	if (phoneInput.value.length > 0 && !isPhoneValid) {
		phoneInput.classList.add('border-red-500/50');
	} else {
		phoneInput.classList.remove('border-red-500/50');
	}
}

/**
 * Инициализация слушателей валидации
 */
function initValidation(elements: FormElements): void {
	const { nameInput, phoneInput, privacyCheckbox } = elements;

	const validate = () => validateForm(elements);

	// События для валидации
	nameInput.addEventListener('input', validate);
	phoneInput.addEventListener('input', validate); // Уже вызывается в initPhoneMask
	privacyCheckbox.addEventListener('change', validate);

	// Первичная проверка
	validate();
}

// ============================================================================
// FORM SUBMISSION
// ============================================================================

/**
 * Инициализация обработчика отправки формы
 */
function initFormHandler(elements: FormElements): void {
	const { form, submitBtn } = elements;

	form.addEventListener('submit', async (e: Event) => {
		e.preventDefault();

		// Защита от двойного клика
		if (submitBtn.disabled) return;

		// Блокируем кнопку
		const originalDisabled = submitBtn.disabled;
		submitBtn.disabled = true;

		setOverlayState('loading');

		try {
			await syncAndSendCF7(elements);
			setOverlayState('success');

			// Сброс формы после успеха
			form.reset();
			validateForm(elements);

			// Автозакрытие через 3 секунды (опционально)
			// setTimeout(() => setOverlayState('hidden'), 3000);

		} catch (error) {
			console.error('Form submission error:', error);
			const errorMessage = error instanceof Error ? error.message : 'Ошибка отправки';
			setOverlayState('error', errorMessage);

			// Автоматически скрываем ошибку через 3 секунды
			setTimeout(() => setOverlayState('hidden'), 3000);

			// Восстанавливаем состояние кнопки при ошибке
			submitBtn.disabled = originalDisabled;
		}
	});
}

/**
 * Синхронизация данных с CF7 формой и отправка
 */
async function syncAndSendCF7(elements: FormElements): Promise<void> {
	const { nameInput, phoneInput, noteInput, subjectInput } = elements;

	const hiddenForm = document.getElementById(HIDDEN_FORM_ID) as HTMLFormElement | null;

	if (!hiddenForm) {
		throw new Error('Hidden CF7 form not found');
	}

	// Получаем поля CF7 формы
	const cf7Fields = {
		name: hiddenForm.querySelector(`[name="${FIELD_MAPPING.name}"]`) as HTMLInputElement | null,
		phone: hiddenForm.querySelector(`[name="${FIELD_MAPPING.phone}"]`) as HTMLInputElement | null,
		note: hiddenForm.querySelector(`[name="${FIELD_MAPPING.note}"]`) as HTMLInputElement | null,
		subject: hiddenForm.querySelector(`[name="${FIELD_MAPPING.subject}"]`) as HTMLInputElement | null
	};

	// Проверка наличия всех полей
	if (!cf7Fields.name || !cf7Fields.phone || !cf7Fields.note || !cf7Fields.subject) {
		throw new Error('Some CF7 fields are missing');
	}

	// Копируем данные
	cf7Fields.name.value = nameInput.value.trim();
	cf7Fields.note.value = noteInput.value.trim();
	cf7Fields.subject.value = subjectInput.value;

	// Телефон: +7 + 10 цифр
	const phoneDigits = phoneInput.value.replace(/\D/g, '');
	cf7Fields.phone.value = `+7${phoneDigits}`;

	// Подготовка данных для отправки
	const formData = new FormData(hiddenForm);
	const actionUrl = hiddenForm.getAttribute('action');

	if (!actionUrl) {
		throw new Error('Form action URL not specified');
	}

	// УДАЛИ ЭТУ СТРОКУ В ПРОДАКШЕНЕ!
	await new Promise(resolve => setTimeout(resolve, 1500));

	// Отправка
	const response = await fetch(actionUrl, {
		method: 'POST',
		body: formData
	});

	if (!response.ok) {
		throw new Error(`Network error: ${response.status} ${response.statusText}`);
	}

	// Опционально: парсинг ответа CF7
	const result = await response.json();
	console.log('CF7 Response:', result);

	// CF7 обычно возвращает объект с полем status: 'mail_sent' | 'validation_failed'
	if (result.status !== 'mail_sent') {
		throw new Error(result.message || 'Form submission failed');
	}
}

// ============================================================================
// OVERLAY STATE MANAGEMENT
// ============================================================================

/**
 * Управление состоянием overlay (лоадер/успех/ошибка)
 */
function setOverlayState(state: OverlayState, message: string = ''): void {
	const overlay = document.getElementById('form-overlay');

	if (!overlay) {
		console.warn('Overlay element not found');
		return;
	}

	// Сброс классов и контента
	overlay.className = 'form-overlay z-50';
	overlay.innerHTML = '';
	overlay.setAttribute('aria-live', 'polite');

	if (state === 'hidden') {
		overlay.removeAttribute('aria-live');
		return;
	}

	overlay.classList.add('active');

	switch (state) {
		case 'loading':
			overlay.innerHTML = `
        <div class="loader mb-4" role="status" aria-label="Отправка формы"></div>
        <p class="text-white text-sm">Отправка...</p>
      `;
			break;

		case 'success':
			overlay.innerHTML = `
        <div class="success-checkmark">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" aria-hidden="true">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h4 class="text-white text-xl font-bold mb-2">Успешно!</h4>
        <p class="text-white/80 text-sm mb-4">Ваша заявка отправлена</p>
        <button 
          onclick="setOverlayState('hidden')" 
          class="mt-4 text-[#E6C275] hover:text-[#d4b066] underline text-sm transition-colors"
          aria-label="Закрыть уведомление"
        >
          Закрыть
        </button>
      `;
			break;

		case 'error':
			overlay.innerHTML = `
        <div class="text-red-500 text-5xl mb-4" aria-hidden="true">✕</div>
        <h4 class="text-white text-xl font-bold mb-2">Ошибка</h4>
        <p class="text-white/80 text-sm">${message || 'Не удалось отправить форму'}</p>
        <p class="text-white/60 text-xs mt-2">Попробуйте позже</p>
      `;
			break;
	}
}

// Экспортируем для использования в onclick (если нужно)
declare global {
	interface Window {
		setOverlayState: typeof setOverlayState;
	}
}
window.setOverlayState = setOverlayState;