import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger)


export function initHeaderAnimations() {
	const header = document.querySelector("#header_main");

	// Убедись что header изначально скрыт
	// gsap.set(header, { y: "-100%" });

	ScrollTrigger.create({
		trigger: "body",
		start: "top -720px",
		end: "max",
		onEnter: () => {
			gsap.fromTo(header, {
				y: "-100%",
			}, {
				y: "0%",
				position: "fixed",
				duration: 0.5,
				ease: "power2.out"
			});
		},
		onLeaveBack: () => {
			gsap.to(header, {
				y: "-100%",
				duration: 0.4,
				ease: "power2.out",
				onComplete: () => {
					gsap.set(header, {
						position: "absolute",
						y: "0%",

					});
				}
			});
		}
	});
}