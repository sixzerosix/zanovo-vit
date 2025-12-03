/**
 * Конфигурация для Age Gate
 */
interface AgeGateConfig {
	storageKey: string;     // Ключ в localStorage
	redirectUrl: string;    // Куда отправлять, если нет 18
	animationDuration: number;
}

export class AgeVerificationManager {
	private config: AgeGateConfig;
	private container: HTMLElement | null = null;

	constructor(config?: Partial<AgeGateConfig>) {
		this.config = {
			storageKey: 'is_adult_verified',
			redirectUrl: 'https://www.google.com', // Редирект для тех, кому нет 18
			animationDuration: 500,
			...config,
		};
	}

	/**
	 * Инициализация. Если возраст не подтвержден — блокируем экран сразу.
	 */
	public init(): void {
		if (this.isVerified()) {
			return; // Уже подтверждено, ничего не делаем
		}

		// Если DOM готов, рендерим сразу, иначе ждем
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', () => this.render());
		} else {
			this.render();
		}
	}

	private isVerified(): boolean {
		try {
			return localStorage.getItem(this.config.storageKey) === 'true';
		} catch {
			return false;
		}
	}

	/**
	 * Рендер модального окна
	 */
	private render(): void {
		if (this.container) return; // Защита от двойного рендера

		this.container = document.createElement('div');
		// Атрибуты доступности для модального окна
		this.container.setAttribute('role', 'dialog');
		this.container.setAttribute('aria-modal', 'true');
		this.container.setAttribute('aria-labelledby', 'age-gate-title');

		// Базовые стили + начальное состояние анимации (opacity-0)
		// Добавил transition-opacity для плавного появления
		this.container.className = `
      fixed z-[9999] inset-0 w-full h-full 
      flex items-center justify-center 
      bg-zinc-950/95 backdrop-blur-xl
      transition-opacity duration-500 ease-out opacity-0
    `;

		// HTML шаблон (твой код + правки под button)
		this.container.innerHTML = `
      <div class="p-12 max-w-lg w-full relative transform transition-transform duration-500 scale-95" id="age-gate-content">
          <h2 id="age-gate-title" class="text-32-48 mb-[1em] font-mak text-center text-white">Вам уже есть 18?</h2>
          
          <div class="flex flex-col sm:flex-row justify-center gap-5 font-medium text-white">
              <!-- Button NO -->
              <button id="age-btn-no" data-sound="click7"
                  class="flex-1 flex items-center justify-center px-[2em] py-[1em] rounded-full cursor-pointer border border-zinc-800 hover:bg-zinc-800 duration-500 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-500">
                  Нет
              </button>
            
              <!-- Button YES -->
              <button id="age-btn-yes" data-sound="click7"
                  class="max-md:order-first flex-1 flex items-center justify-center px-[2em] py-[1em] rounded-full cursor-pointer text-zinc-950 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  style="background: radial-gradient(50% 175.52% at 50% 50%, rgba(255, 241, 213, 0.36) 0%, rgba(173, 114, 0, 0.324) 100%), #FFD176;">
                  Есть
              </button>
          </div>
      </div>
    `;

		document.body.appendChild(this.container);

		// Блокируем скролл на body, пока окно открыто
		document.body.style.overflow = 'hidden';

		// Запускаем анимацию появления (через requestAnimationFrame для надежности)
		requestAnimationFrame(() => {
			if (this.container) {
				this.container.classList.remove('opacity-0');
				this.container.querySelector('#age-gate-content')?.classList.remove('scale-95');
				this.container.querySelector('#age-gate-content')?.classList.add('scale-100');
			}
		});

		this.attachEvents();
	}

	private attachEvents(): void {
		const btnYes = this.container?.querySelector('#age-btn-yes');
		const btnNo = this.container?.querySelector('#age-btn-no');

		btnYes?.addEventListener('click', () => this.handleYes());
		btnNo?.addEventListener('click', () => this.handleNo());
	}

	/**
	 * Пользователь нажал "Есть"
	 */
	private handleYes(): void {
		localStorage.setItem(this.config.storageKey, 'true');

		// Анимация исчезновения
		if (this.container) {
			this.container.classList.add('opacity-0', 'pointer-events-none');
			// Возвращаем скролл
			document.body.style.overflow = '';

			// Удаляем из DOM после завершения анимации
			setTimeout(() => {
				this.container?.remove();
				this.container = null;
			}, this.config.animationDuration);
		}
	}

	/**
	 * Пользователь нажал "Нет"
	 */
	private handleNo(): void {
		// Вариант 1: Редирект
		window.location.href = this.config.redirectUrl;

		// Вариант 2: Можно показать сообщение "Извините, доступ запрещен"
		// Но обычно просто уводят с сайта
	}
}

// Пример использования:
// const ageGate = new AgeVerificationManager();
// ageGate.init();