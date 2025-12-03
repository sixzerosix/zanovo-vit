import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger)


export function mapMotion() {
	const flags = gsap.utils.toArray('#map-flags > g');

	const tl = gsap.timeline({
		scrollTrigger: {
			trigger: "#map-flags",
			start: "top 65%",
			end: "bottom 20%",
			scrub: false, // можно сделать true для синхронизации
		},
		defaults: {
			opacity: 0,
			scale: 0.6,
			y: 40,
			transformOrigin: "center center",
			ease: "power2.out",
			duration: 0.6
		}
	});

	flags.forEach((flag, i) => {
		tl.from(flag as gsap.TweenTarget, {}, i * 0.15);
	});
}