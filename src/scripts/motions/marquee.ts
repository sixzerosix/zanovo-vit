import gsap from "gsap";

document.addEventListener("DOMContentLoaded", () => {
	initMarquee();
});

// Оборачиваем в функцию для возможности перезапуска (например, при ресайзе)
function initMarquee() {
	const marquees = document.querySelectorAll('.marquee-container');

	marquees.forEach(container => {
		// Очищаем контейнер от старых клонов перед инициализацией (на случай ресайза)
		const originalContent = container.querySelector('.marquee-content');
		// Если мы уже нагенерировали клонов ранее, удаляем их, оставляя только первый (оригинал)
		const allContents = container.querySelectorAll('.marquee-content');
		if (allContents.length > 1) {
			for (let i = 1; i < allContents.length; i++) {
				allContents[i].remove();
			}
		}

		// Убиваем старые анимации GSAP, связанные с этим контейнером
		gsap.killTweensOf(container.children);

		const content = container.querySelector('.marquee-content');

		// Параметры
		const speed = parseFloat(container.dataset.speed) || 20;
		const direction = container.dataset.direction === 'right' ? 1 : -1;

		// Клонирование
		// content.offsetWidth включает в себя padding-right (наш фикс)
		const itemWidth = content.offsetWidth;
		const cloneAmount = Math.ceil(window.innerWidth / itemWidth) + 1;

		for (let i = 0; i < cloneAmount; i++) {
			const clone = content.cloneNode(true);
			clone.setAttribute('aria-hidden', 'true');
			container.appendChild(clone);
		}

		// Анимация
		// Используем xPercent: -100, это означает сдвиг на 100% ширины САМОГО ЭЛЕМЕНТА.
		// Это гораздо надежнее пикселей.

		const tl = gsap.to(container.children, {
			xPercent: direction === -1 ? -100 : 0,
			// Если идем влево: от 0 до -100%. 
			// Если вправо: нужно стартовать с -100% и идти к 0.
			startAt: { xPercent: direction === -1 ? 0 : -100 },
			duration: speed,
			ease: "none",
			repeat: -1
		});

		// Опционально: Пауза
		if (container.dataset.pauseOnHover === 'true') {
			container.addEventListener('mouseenter', () => tl.pause());
			container.addEventListener('mouseleave', () => tl.play());
		}
	});
}

// Перезапуск при изменении размера окна с debounce (чтобы не грузить проц)
let resizeTimer;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(() => {
		initMarquee();
	}, 200);
});