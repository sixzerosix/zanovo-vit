/**
 * Интерфейс для конфигурации (чтобы было легко менять ключи и тайминги)
 */
interface CookieConsentConfig {
	storageKey: string;
	autoShowDelay: number;
	cookieVersion: string;
}

/**
 * Класс CookieConsentManager
 * Реализует паттерн Singleton (опционально) или просто модульный компонент.
 * Отвечает за жизненный цикл баннера.
 */
export class CookieConsentManager {
	private config: CookieConsentConfig;
	private container: HTMLElement | null = null;
	private closeButton: HTMLButtonElement | null = null;
	private acceptButton: HTMLButtonElement | null = null;

	constructor(config?: Partial<CookieConsentConfig>) {
		// Дефолтная конфигурация
		this.config = {
			storageKey: 'app_cookie_consent',
			autoShowDelay: 1000,
			cookieVersion: '1.0',
			...config,
		};
	}

	/**
	 * Точка входа. Проверяет наличие согласия и рендерит баннер при необходимости.
	 */
	public init(): void {
		if (this.hasConsented()) {
			console.log('CookieConsent: Согласие уже получено.');
			return;
		}

		// Ждем полной загрузки DOM, если скрипт подключен в <head>
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.scheduleShow());
		} else {
			this.scheduleShow();
		}
	}

	/**
	 * Проверка localStorage
	 */
	private hasConsented(): boolean {
		try {
			const stored = localStorage.getItem(this.config.storageKey);
			if (!stored) return false;
			const parsed = JSON.parse(stored);
			// Здесь можно добавить проверку версий, если политика обновилась
			return parsed.consented === true;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Планирует показ баннера с задержкой
	 */
	private scheduleShow(): void {
		setTimeout(() => {
			this.render();
			this.show();
		}, this.config.autoShowDelay);
	}

	/**
	 * Создает DOM-элементы и вешает слушатели событий
	 */
	private render(): void {
		// Удаляем старый инстанс, если вдруг он есть
		if (this.container) this.container.remove();

		// Создаем контейнер
		this.container = document.createElement('div');
		this.container.setAttribute('role', 'region');
		this.container.setAttribute('aria-label', 'Уведомление о файлах cookie');

		// Базовые классы для позиционирования и анимации
		// Обрати внимание: начинаем с opacity-0 и translate-y-8 для анимации входа
		this.container.className = `
      fixed bottom-0 max-md:left-0 right-0 md:bottom-[calc(1rem+1vh+1vw)] md:right-[calc(1rem+1vh+1vw)] z-[9990]
      flex items-center justify-center
      transition-all duration-500 ease-out transform
      opacity-0 translate-y-8 pointer-events-none
    `;

		// Вставляем HTML (Sanitized string)
		this.container.innerHTML = `
		<div class="border border-zinc-800">
			<div class="bg-zinc-950 p-32-56 md:max-w-xl w-full relative text-center">
				<button id="cookie-close-btn" class="absolute top-4 right-4 text-3xl opacity-30 hover:opacity-100 transition-all cursor-pointer">
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M0.5 0.5L8.98528 8.98528M8.98528 8.98528L17.4706 17.4706M8.98528 8.98528L0.5 17.4706M8.98528 8.98528L17.4706 0.5"
							stroke="#D4D4D8" stroke-linecap="round" />
					</svg>
				</button>
				<h2 class="text-32-40 mb-[0.5em] font-mak">Мы используем куки</h2>
				<p class="text-zinc-500 text-sm mb-8 leading-relaxed">
					Это помогает нам делать сайт лучше. Оставаясь здесь, вы соглашаетесь с нашей политикой.
				</p>
				<button id="cookie-accept-btn" data-sound="click7"
					class="inline-flex items-center justify-center px-[2em] py-[1em] rounded-full cursor-pointer border border-zinc-800 hover:bg-zinc-800 duration-500 transition-all">
					Окей
				</button>

			</div>
		</div>
		`;

		document.body.appendChild(this.container);

		// Привязываем элементы к свойствам класса
		this.closeButton = this.container.querySelector('#cookie-close-btn');
		this.acceptButton = this.container.querySelector('#cookie-accept-btn');

		// Навешиваем обработчики (bind(this) важен для сохранения контекста)
		this.closeButton?.addEventListener('click', this.handleClose.bind(this));
		this.acceptButton?.addEventListener('click', this.handleAccept.bind(this));
	}

	/**
	 * Активирует CSS-классы для показа
	 */
	private show(): void {
		if (!this.container) return;

		// Force reflow (браузер должен понять, что элементы добавлены, прежде чем анимировать)
		void this.container.offsetWidth;

		this.container.classList.remove('opacity-0', 'translate-y-8', 'pointer-events-none');
		this.container.classList.add('opacity-100', 'translate-y-0');
	}

	/**
	 * Скрывает элемент и удаляет из DOM после анимации
	 */
	private hide(): void {
		if (!this.container) return;

		this.container.classList.remove('opacity-100', 'translate-y-0');
		this.container.classList.add('opacity-0', 'translate-y-8', 'pointer-events-none');

		// Ждем окончания CSS-транзишна перед удалением из DOM
		this.container.addEventListener('transitionend', () => {
			this.container?.remove();
			this.container = null;
		}, { once: true });
	}

	/**
	 * Обработчик "Закрыть" (просто скрыть в этой сессии)
	 */
	private handleClose(): void {
		this.hide();
	}

	/**
	 * Обработчик "Окей" (сохранить и скрыть)
	 */
	private handleAccept(): void {
		const data = {
			consented: true,
			timestamp: new Date().toISOString(),
			version: this.config.cookieVersion
		};

		try {
			localStorage.setItem(this.config.storageKey, JSON.stringify(data));
			// Опционально: звук
			// new Audio('/sounds/click.mp3').play().catch(() => {});
		} catch (e) {
			console.error('CookieConsent: Ошибка записи в localStorage', e);
		}

		this.hide();
	}
}

// Автоматическая инициализация (если скрипт подключен как модуль)
// const cookieManager = new CookieConsentManager();
// cookieManager.init();