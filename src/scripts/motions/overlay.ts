// overlay.ts
import gsap from "gsap";

const OVERLAY_ID = "globalOverlay";
let overlay: HTMLElement;
let tl: gsap.core.Timeline;

function createOverlayIfNeeded() {
	if (document.getElementById(OVERLAY_ID)) {
		overlay = document.getElementById(OVERLAY_ID)!;
		return;
	}

	const html = `<div id="${OVERLAY_ID}" class="fixed inset-0 bg-zinc-950 opacity-0 pointer-events-none z-[9998]"></div>`;
	document.body.insertAdjacentHTML("beforeend", html);
	overlay = document.getElementById(OVERLAY_ID)!;

	tl = gsap.timeline({ paused: true })
		.to(overlay, {
			opacity: 0.9,
			pointerEvents: "auto",
			duration: 0.75,
			ease: "power2.out",
		});
}

export function showOverlay(onClick?: () => void) {
	createOverlayIfNeeded();
	if (window.lenis) {
		window.lenis.stop()
	}
	overlay.onclick = () => onClick?.();
	tl.play();
}

export function hideOverlay() {
	if (!overlay || !tl) return;
	if (window.lenis) {
		window.lenis.start()
	}
	tl.reverse().eventCallback("onReverseComplete", () => {
		overlay.style.pointerEvents = "none";
	});
}

// Авто-закрытие по Escape (глобально)
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") hideOverlay();
});