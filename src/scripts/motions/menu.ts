// menuGsap.ts
import gsap from "gsap";
import { showOverlay, hideOverlay } from "./overlay";

let isOpen = false;
const menu = document.getElementById("mobileMenu")!;
const toggleBtn = document.getElementById("menuToggle")!;
const menuCloseBtn = document.getElementById("menu_close_btn")!;

// Убираем overlay из timeline — он теперь отдельно!
const menuTl = gsap.timeline({ paused: true });

menuTl
	.set(menu, { display: "block" })
	.fromTo(menu, { x: "100%" }, { x: "0%", duration: 0.5, ease: "power3.out" }, 0)
	.fromTo(menu.querySelectorAll("a"),
		{ opacity: 0, x: 50 },
		{ opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" },
		0.15
	);

export function initMenu() {
	toggleBtn.addEventListener("click", toggleMenu);
	menuCloseBtn.addEventListener("click", closeMenu);

	document.addEventListener("keydown", e => {
		if (e.key === "Escape") closeMenu();
	});

	// Закрытие по клику на overlay (автоматически через showOverlay)
	// Больше не нужно вручную вешать overlay.addEventListener("click", closeMenu);
}

function toggleMenu() {
	isOpen ? closeMenu() : openMenu();
}

function openMenu() {
	isOpen = true;
	// body.classList.add("overflow-hidden");

	document.documentElement.classList.add("menu-open");
	showOverlay(closeMenu);  // ← вот и вся магия!
	menuTl.play();
}

function closeMenu() {
	if (!isOpen) return;
	isOpen = false;

	menuTl.reverse();
	hideOverlay();

	// Скрываем меню и убираем классы только после завершения анимации
	menuTl.eventCallback("onReverseComplete", () => {
		gsap.set(menu, { display: "none" });
		// body.classList.remove("overflow-hidden");

		document.documentElement.classList.remove("menu-open");
		menuTl.eventCallback("onReverseComplete", null); // очищаем
	});
}