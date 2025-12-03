import gsap from "gsap";

/**
 * Модный hover-эффект: буквы улетают вверх при наведении
 * Просто добавляешь класс .hover-text-lift к любому тексту
 */
export function initTextLiftHover() {
	document.querySelectorAll(".hover-text-lift").forEach(container => {
		// Защита от повторной обработки
		if (container.hasAttribute("data-lift-ready")) return;

		const text = container.textContent?.trim();
		if (!text) return;

		// Разбиваем на буквы
		container.innerHTML = text
			.split("")
			.map(char => (char === " " ? "&nbsp;" : `<span class="lift-char">${char}</span>`))
			.join("");

		const chars = container.querySelectorAll(".lift-char");

		// Создаём таймлайн (пауза по умолчанию)
		const tl = gsap.timeline({
			paused: true,
			defaults: {
				duration: 0.8,
				ease: "power3.out"
			}
		});

		tl.to(chars, {
			yPercent: -130,
			rotationX: -90,
			opacity: 0,
			stagger: { amount: 0.5, from: "start" },
			transformOrigin: "50% 50% -40px"
		});

		let hoverTimeout: number;

		const playForward = () => {
			clearTimeout(hoverTimeout);
			tl.play();
		};

		const playReverse = () => {
			hoverTimeout = window.setTimeout(() => {
				tl.reverse();
			}, 120); // ← задержка перед возвращением (убирает дёрганье)
		};

		container.addEventListener("mouseenter", playForward);
		container.addEventListener("mouseleave", playReverse);

		// Помечаем как готовый
		container.setAttribute("data-lift-ready", "true");
	});
}

/**
 * Эффект "выдавливание букв вверх" при hover
 * Просто добавь класс .text-press-up
 */
export function initTextPressUp() {
	document.querySelectorAll(".text-press-up").forEach(el => {
		if (el.hasAttribute("data-press-ready")) return;

		// Добавляем ::before через JS (чтобы текст был одинаковый)
		(el as HTMLElement).style.position = "relative";
		(el as HTMLElement).style.overflow = "hidden";
		(el as HTMLElement).style.display = "inline-block";

		// Создаём псевдоэлемент через стиль
		(el as HTMLElement).style.cssText += `
            &::before {
                content: "${el.textContent}";
                position: absolute;
                left: 0;
                top: 0;
                color: inherit;
                pointer-events: none;
            }
        `;

		const tl = gsap.timeline({ paused: true });

		tl.to(el, {
			yPercent: -100,
			duration: 0.7,
			ease: "power3.inOut"
		});

		let timeout: any;

		el.addEventListener("mouseenter", () => {
			clearTimeout(timeout);
			tl.play();
		});

		el.addEventListener("mouseleave", () => {
			timeout = setTimeout(() => {
				tl.reverse();
			}, 100); // анти-дёрганье
		});

		el.setAttribute("data-press-ready", "true");
	});
}