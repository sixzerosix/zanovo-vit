import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function curtainPanel() {
	document.querySelectorAll(".curtain-panel").forEach(element => {
		const panel = element as HTMLElement;
		const wrapper = panel.parentElement!;
		wrapper.style.overflow = "hidden";
		if (getComputedStyle(wrapper).position === "static") {
			wrapper.style.position = "relative";
		}

		// Растягиваем шторку
		panel.style.width = "100%";
		panel.style.left = "0";

		// Скорость анимации: чем больше число — тем медленнее
		const rawSpeed = panel.dataset.curtainSpeed
			? parseFloat(panel.dataset.curtainSpeed)
			: 120; // по умолчанию как было

		// Превращаем в длительность: 100 → 1 сек, 300 → 3 сек и т.д.
		const duration = rawSpeed / 100;

		gsap.to(panel, {
			y: -panel.offsetHeight,
			duration: duration,        // вот тут вся магия скорости!
			ease: "power2.out",        // красивое замедление в конце
			scrollTrigger: {
				trigger: wrapper,
				start: "top 80%",      // когда верх блока на 80% экрана
				once: true,            // ВАЖНО: анимация только один раз!
				// toggleActions: "play none none reverse", // если захочешь обратно при скролле вверх
			}
		});
	});
}