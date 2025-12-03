import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
	initMarquee();
});

// Оборачиваем в функцию для возможности перезапуска (например, при ресайзе)
function initMarquee() {
	const marquees = document.querySelectorAll('.marquee-container');

	marquees.forEach(container => {
		const containerEl = container as HTMLElement;
		// Очищаем контейнер от старых клонов перед инициализацией (на случай ресайза)
		// Если мы уже нагенерировали клонов ранее, удаляем их, оставляя только первый (оригинал)
		const allContents = container.querySelectorAll('.marquee-content');
		if (allContents.length > 1) {
			for (let i = 1; i < allContents.length; i++) {
				allContents[i].remove();
			}
		}

		// Убиваем старые анимации GSAP, связанные с этим контейнером
		gsap.killTweensOf(containerEl.children as any);

		const content = containerEl.querySelector('.marquee-content') as HTMLElement | null;
		if (!content) return;

		// Параметры
		const speed = parseFloat(containerEl.dataset.speed || '') || 20;
		const direction = containerEl.dataset.direction === 'right' ? 1 : -1;

		// Клонирование
		// content.offsetWidth включает в себя padding-right (наш фикс)
		const itemWidth = content.offsetWidth;
		const cloneAmount = Math.ceil(window.innerWidth / itemWidth) + 1;

		for (let i = 0; i < cloneAmount; i++) {
			const clone = content.cloneNode(true) as HTMLElement;
			clone.setAttribute('aria-hidden', 'true');
			containerEl.appendChild(clone);
		}

		// Анимация
		// Используем xPercent: -100, это означает сдвиг на 100% ширины САМОГО ЭЛЕМЕНТА.
		// Это гораздо надежнее пикселей.

		const tl = gsap.to(containerEl.children as any, {
			xPercent: direction === -1 ? -100 : 0,
			// Если идем влево: от 0 до -100%. 
			// Если вправо: нужно стартовать с -100% и идти к 0.
			startAt: { xPercent: direction === -1 ? 0 : -100 },
			duration: speed,
			ease: "none",
			repeat: -1
		});

		// Опционально: Пауза
		if (containerEl.dataset.pauseOnHover === 'true') {
			containerEl.addEventListener('mouseenter', () => tl.pause());
			containerEl.addEventListener('mouseleave', () => tl.play());
		}
	});
}

// Перезапуск при изменении размера окна с debounce (чтобы не грузить проц)
let resizeTimer: number | undefined;
window.addEventListener('resize', () => {
	if (resizeTimer) window.clearTimeout(resizeTimer);
	resizeTimer = window.setTimeout(() => {
		initMarquee();
	}, 200);
});