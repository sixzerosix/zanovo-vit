// motionBlocks.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// -----------------------------
// Карта анимаций для блоков
// -----------------------------
const animations: Record<string, (els: Element[]) => gsap.core.Tween> = {
	// Плавное появление снизу
	fadeup: (els: Element[]) =>
		gsap.fromTo(
			els,
			{ y: 80, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				duration: 1,
				ease: "power3.out",
				stagger: 0.15, // если несколько элементов — будут появляться по очереди
			}
		),

	// Слева направо
	fadeleft: (els: Element[]) =>
		gsap.fromTo(
			els,
			{ x: -100, opacity: 0 },
			{
				x: 0,
				opacity: 1,
				duration: 0.9,
				ease: "power3.out",
				stagger: 0.12,
			}
		),

	// Справа налево
	faderight: (els: Element[]) =>
		gsap.fromTo(
			els,
			{ x: 100, opacity: 0 },
			{
				x: 0,
				opacity: 1,
				duration: 0.9,
				ease: "power3.out",
				stagger: 0.12,
			}
		),

	// Масштаб
	zoom: (els: Element[]) =>
		gsap.fromTo(
			els,
			{ scale: 0.85, opacity: 0 },
			{
				scale: 1,
				opacity: 1,
				duration: 0.9,
				ease: "back.out(1.4)",
				stagger: 0.15,
			}
		),

	// Появление с поворотом
	rotate: (els: Element[]) =>
		gsap.fromTo(
			els,
			{ rotation: -15, opacity: 0, y: 40 },
			{
				rotation: 0,
				y: 0,
				opacity: 1,
				duration: 1,
				ease: "power3.out",
				stagger: 0.15,
			}
		),

	// Просто fade (без движения)
	fade: (els: Element[]) =>
		gsap.fromTo(
			els,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 1.2,
				ease: "power2.out",
				stagger: 0.1,
			}
		),
};

// -----------------------------
// Основная функция инициализации
// -----------------------------
export function initMotionBlocks() {
	// Ищем ВСЕ элементы, у которых есть любой motion-класс
	const triggers = document.querySelectorAll(`
    [class*="motion-"]:not([class*="motion-text-"]),
    [class*="motion-blocks-"]
  `);

	triggers.forEach((triggerEl) => {
		// 1. Определяем тип класса и название анимации
		let animationName: string | null = null;
		let isBlocksMode = false;

		for (const cls of triggerEl.classList) {
			if (cls.startsWith("motion-blocks-")) {
				animationName = cls.replace("motion-blocks-", "");
				isBlocksMode = true;
				break;
			}
			if (cls.startsWith("motion-block-") && !cls.startsWith("motion-blocks-") && !cls.startsWith("motion-text-")) {
				animationName = cls.replace("motion-block-", "");
				isBlocksMode = false;
				// оставляем первый найденный motion-*
			}
		}

		if (!animationName || !animations[animationName]) {
			console.warn(`Анимация motion(-blocks)-${animationName} не найдена`, triggerEl);
			return;
		}

		const animateFn = animations[animationName];

		// 2. Определяем, ЧТО именно анимировать
		let targets: Element[] = [];

		// Приоритет 1: data-children — явное указание
		if (triggerEl.hasAttribute("data-children")) {
			const selector = triggerEl.getAttribute("data-children")!;
			targets = Array.from(triggerEl.querySelectorAll(selector));
		}
		// Приоритет 2: режим motion-blocks-* → все прямые дети
		else if (isBlocksMode) {
			targets = Array.from(triggerEl.children);
		}
		// Приоритет 3: обычный motion-* → сам элемент
		else {
			targets = [triggerEl];
		}

		if (targets.length === 0) return;

		// Начальные стили
		gsap.set(targets, { opacity: 0 });

		// 3. Создаём ScrollTrigger
		ScrollTrigger.create({
			trigger: triggerEl,
			start: (triggerEl as HTMLElement).dataset.start || "top 85%",
			once: true,
			onEnter: () => animateFn(targets),
		});
	});
}