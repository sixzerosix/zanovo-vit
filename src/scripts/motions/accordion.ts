// accordion.ts
import gsap from "gsap";

export function initAccordion() {
	// Находим все аккордеоны на странице
	const accordions = document.querySelectorAll("[data-accordion]");

	accordions.forEach(accordion => {
		accordion.addEventListener("click", (e) => {
			const trigger = e.target.closest("[data-accordion-trigger]");
			if (!trigger) return;

			const item = trigger.closest(".accordion-item");
			const content = item.querySelector("[data-accordion-content]");
			// Проверяем, разрешено ли открытие нескольких секций
			const allowMultiple = accordion.dataset.accordion === "multiple";
			const isOpen = item.classList.contains("is-open");

			// Если нельзя открывать много, закрываем другие открытые
			if (!allowMultiple && !isOpen) {
				const openItem = accordion.querySelector(".accordion-item.is-open");
				if (openItem && openItem !== item) {
					const openContent = openItem.querySelector("[data-accordion-content]");
					animateAccordion(openContent, openItem, false);
				}
			}

			// Тогглим текущий элемент
			// Если он открыт -> закрываем (false), если закрыт -> открываем (true)
			animateAccordion(content, item, !isOpen);
		});
	});
}

function animateAccordion(content, item, expanding) {
	// Иконка
	const icon = item.querySelector(".accordion-icon");

	// Если мы открываем (expanding = true)
	if (expanding) {
		item.classList.add("is-open");

		// Вращение иконки
		if (icon) gsap.to(icon, { rotation: 45, duration: 0.3, ease: "power2.out" });

		// Анимация открытия
		gsap.to(content, {
			height: "auto",     // GSAP сам вычислит высоту!
			duration: 0.4,      // Чуть быстрее, 0.7 может ощущаться вязким
			ease: "power2.out", // Более естественная кривая для интерфейса
			overwrite: true     // Важно: прерывает любую текущую анимацию на этом элементе (фикс от быстрых кликов)
		});

	} else {
		// Если закрываем
		item.classList.remove("is-open");

		if (icon) gsap.to(icon, { rotation: 0, duration: 0.3, ease: "power2.out" });

		// Анимация закрытия
		gsap.to(content, {
			height: 0,
			duration: 0.3,
			ease: "power2.out", // in - разгон в начале
			overwrite: true
		});
	}
}