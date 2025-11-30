import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function parallaxUniversal() {
	gsap.utils.toArray(".parallax-wrapper").forEach((wrapper: HTMLElement) => {
		const targets = wrapper.querySelectorAll("[data-speed], .will-parallax");

		targets.forEach((el: HTMLElement) => {
			let speed = 1;

			// Читаем скорость
			if (el.dataset.speed !== undefined) {
				speed = parseFloat(el.dataset.speed);
			} else if (el.classList.contains("will-parallax")) {
				const depth = el.closest("[data-depth]")
					? parseFloat(el.closest("[data-depth]")!.dataset.depth || "1")
					: 1;
				speed = 1 + 0.3 * depth;
			}

			// Определяем, что внутри: img, video или просто блок
			const img = el.tagName === "IMG" ? el : el.querySelector("img");
			const video = el.tagName === "VIDEO" ? el : el.querySelector("video");

			const media = img || video;

			// Функция инициализации параллакса
			const init = () => {
				const wrapperH = wrapper.offsetHeight;
				let contentH = el.offsetHeight;

				// Если есть изображение или видео — считаем его реальные размеры
				if (media) {
					const naturalH = (media as HTMLImageElement | HTMLVideoElement).naturalHeight
						|| (media as HTMLVideoElement).videoHeight
						|| media.offsetHeight;

					const scale = media.offsetHeight / naturalH;
					const visibleH = wrapperH / scale;
					const maxShift = Math.max(0, naturalH - visibleH);

					const theoreticalShift = wrapperH * (speed - 1);
					const safeShift = Math.min(theoreticalShift, maxShift);
					const safeSpeed = 1 + safeShift / wrapperH;

					applyParallax(el, safeSpeed, wrapper);
				} else {
					// Если это просто блок — параллакс по высоте блока (без ограничений)
					applyParallax(el, speed, wrapper);
				}
			};

			// Универсальная анимация
			const applyParallax = (target: HTMLElement, finalSpeed: number, trigger: HTMLElement) => {
				gsap.to(target, {
					yPercent: -100 * (finalSpeed - 1),
					ease: "none",
					scrollTrigger: {
						trigger: trigger,
						start: "top bottom",
						end: "bottom top",
						scrub: true,
						invalidateOnRefresh: true,
					}
				});
			};

			// Ждём загрузки медиа
			if (media) {
				if (img && (img as HTMLImageElement).complete && (img as HTMLImageElement).naturalHeight) {
					init();
				} else if (video && (video as HTMLVideoElement).readyState >= 2) { // HAVE_CURRENT_DATA
					init();
				} else {
					// Ждём загрузки
					media.addEventListener("load", init, { once: true });
					media.addEventListener("loadeddata", init, { once: true });
					media.addEventListener("canplay", init, { once: true });
				}
			} else {
				// Просто блок — сразу запускаем
				init();
			}
		});
	});
}