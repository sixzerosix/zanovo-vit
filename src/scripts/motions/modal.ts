// modal.ts
import gsap from "gsap";
import { showOverlay, hideOverlay } from "./overlay";

let current: HTMLElement | null = null;

function close() {
	if (!current) return;

	const callback = current.dataset.callback;
	if (callback && typeof (window as any)[callback] === "function") {
		(window as any)[callback]();
	}

	gsap.to(current, {
		opacity: 0,
		scale: 0.9,
		y: 50,
		duration: 0.4,
		ease: "back.in(1.4)",
		onComplete: () => {
			current!.style.display = "none";
			// document.body.classList.remove("overflow-hidden");
			current = null;

		}
	});

	hideOverlay();
}

function open(modal: HTMLElement) {
	if (current === modal) return;
	if (current) close();

	current = modal;
	// document.body.classList.add("overflow-hidden");


	// Принудительно включаем
	modal.style.display = "flex";

	gsap.fromTo(modal,
		{ opacity: 0, scale: 0.9, y: 50 },
		{ opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }
	);

	const content = modal.querySelector("[data-modal-content]")?.children;
	if (content) {
		gsap.fromTo(content,
			{ opacity: 0, y: 30 },
			{ opacity: 1, y: 0, stagger: 0.05, duration: 0.4, delay: 0.2 }
		);
	}

	showOverlay(close);
}

// Делегирование
document.addEventListener("click", e => {
	const target = e.target as HTMLElement;
	const openBtn = target.closest("[data-modal]");
	const closeBtn = target.closest("[data-modal-close]");

	if (closeBtn) {
		e.preventDefault();
		close();
		return;
	}

	if (openBtn) {
		e.preventDefault();
		const selector = (openBtn as HTMLElement).dataset.modal!;
		const modal = document.querySelector(selector);
		if (modal instanceof HTMLElement) {
			open(modal);
		}
	}
});

// Escape
document.addEventListener("keydown", e => {
	if (e.key === "Escape") close();
});

// Глобальная функция для формы (если используешь data-callback)
window.sendForm = () => {
	console.log("Форма отправлена!");
	close();
};