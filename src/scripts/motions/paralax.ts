import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function paralaxImage() {
	gsap.utils.toArray(".parallax-wrapper").forEach((wrapper: any) => {
		const elements = wrapper.querySelectorAll("[class*='will-parallax'], [data-speed]");

		elements.forEach((el: any) => {
			let speed = 1;

			if (el.dataset.speed !== undefined) {
				speed = parseFloat(el.dataset.speed);
			} else if (el.classList.contains("will-parallax")) {
				const depth = el.closest('[data-depth]')
					? parseFloat(el.closest('[data-depth]').dataset.depth)
					: 1;
				speed = 1 + (0.3 * depth);
			}

			// Ключевой момент: считаем реальные размеры
			const img = el.tagName === "IMG" ? el : el.querySelector("img");
			if (!img) return;

			// Ждём, пока изображение загрузится (важно для правильного naturalHeight)
			if (img.complete && img.naturalHeight !== 0) {
				initParallax();
			} else {
				img.onload = initParallax;
			}

			function initParallax() {
				const wrapperH = wrapper.offsetHeight;
				const imgH = img.naturalHeight || img.offsetHeight;
				const imgW = img.naturalWidth || img.offsetWidth;

				const currentScale = img.offsetHeight / imgH; // насколько увеличено изображение
				const visibleImgH = wrapperH / currentScale; // сколько реально видно по высоте

				// Максимально допустимый сдвиг вверх (чтобы не вылезло пустое место)
				const maxShift = Math.max(0, imgH - visibleImgH);

				// Сколько "должно" сместиться по формуле
				const theoreticalShift = wrapperH * (speed - 1);

				// Ограничиваем — не больше, чем позволяет изображение
				const safeShift = Math.min(theoreticalShift, maxShift);

				// Финальный коэффициент скорости (может быть меньше, чем запрошено)
				const safeSpeed = 1 + safeShift / wrapperH;

				gsap.to(el, {
					yPercent: -100 * (safeSpeed - 1),
					ease: "none",
					scrollTrigger: {
						trigger: wrapper,
						start: "top bottom",
						end: "bottom top",
						scrub: true,
						invalidateOnRefresh: true, // пересчитываем при ресайзе
					}
				});
			}
		});
	});
}