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

	const html = `<div id="${OVERLAY_ID}" class="fixed inset-0 bg-black/0 pointer-events-none z-[9998]"></div>`;
	document.body.insertAdjacentHTML("beforeend", html);
	overlay = document.getElementById(OVERLAY_ID)!;

	tl = gsap.timeline({ paused: true })
		.to(overlay, {
			backgroundColor: "rgba(0,0,0,0.5)",
			pointerEvents: "auto",
			duration: 0.35,
			ease: "power2.out"
		});
}

export function showOverlay(onClick?: () => void) {
	createOverlayIfNeeded();
	overlay.onclick = () => onClick?.();
	tl.play();
}

export function hideOverlay() {
	if (!overlay || !tl) return;
	tl.reverse().eventCallback("onReverseComplete", () => {
		overlay.style.pointerEvents = "none";
	});
}

// Авто-закрытие по Escape (глобально)
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") hideOverlay();
});