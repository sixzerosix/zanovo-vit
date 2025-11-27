import gsap from "gsap";

window.addEventListener('load', () => {
	const tl = gsap.timeline({
		onComplete: () => {
			// Разблокируем скролл после всей анимации
			document.body.classList.remove('no-scroll');
		}
	});

	// 1. Анимация появления логотипа (части всплывают и проявляются)
	tl.from(".logo-part", {
		y: 30,
		opacity: 0,
		duration: 1.2,
		stagger: 0.2, // Задержка между частями
		ease: "power3.out"
	})
		// 2. Одновременно с логотипом показываем текст процентов
		.to("#loader-text", { opacity: 1, duration: 0.5 }, "-=0.8")
		// 3. Анимация полоски загрузки (имитация загрузки)
		.to("#loader-bar", {
			x: "0%",
			duration: 1.5,
			ease: "power2.inOut"
		}, "-=1") // Начинаем чуть раньше конца появления лого
		// 4. Счетчик процентов (текст)
		.to({ val: 0 }, {
			val: 100,
			duration: 1.5,
			ease: "power2.inOut",
			onUpdate: function () {
				document.getElementById("loader-text").innerText = Math.round(this.targets()[0].val) + "%";
			}
		}, "<") // Синхронно с полоской
		// 5. Убираем логотип и элементы (чуть поднимаем вверх)
		.to(".logo-part, #loader-bar, #loader-text", {
			y: -20,
			opacity: 0,
			duration: 0.6,
			stagger: 0.1,
			ease: "power2.in"
		})
		// 6. Шторка уезжает вверх (Открытие сайта)
		.to("#preloader", {
			yPercent: -100,
			duration: 1.2,
			ease: "power4.inOut" // Эффект тяжелой шторы
		})
		// 7. Появление контента сайта (параллакс эффект на встречу шторке)
		.to("#main-content", {
			opacity: 1,
			y: 0,
			duration: 1,
			ease: "power3.out"
		}, "-=0.8"); // Начинаем, когда шторка еще едет
});