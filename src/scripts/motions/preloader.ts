import gsap from "gsap";

window.addEventListener('load', () => {
	const tl = gsap.timeline({
		onComplete: () => {
			document.body.classList.remove('no-scroll');
		}
	});

	tl
		.to("#preloader_logo_outline, #preloader_loader_text", {
			opacity: 1,
			duration: 0.8,
			ease: "power2.out"
		})
		.to("#preloader_logo_fill_rectangle", {
			attr: { y: 0, height: 82 },
			duration: 2.5,
			ease: "power2.inOut"
		}, "start-loading")

		.to({ val: 0 }, {
			val: 100,
			duration: 2.5,
			ease: "power2.inOut",
			onUpdate: function () {
				const el = document.getElementById("preloader_loader_text");
				if (el) el.innerText = Math.round((this.targets()[0] as any).val) + "%";
			}
		}, "start-loading")

		.to("#preloader_loader_bar", {
			x: "0%",
			duration: 2.5,
			ease: "power2.inOut"
		}, "start-loading")
		// КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: вместо "svg" используем "#preloader_logo_svg"
		.to("#preloader_logo_svg, #preloader_loader_text, #preloader_loader_bar", {
			y: -30,
			opacity: 0,
			duration: 0.6,
			ease: "power2.in",
			delay: 0.2
		})

		.to("#preloader", {
			yPercent: -100,
			duration: 1.0,
			ease: "power4.inOut"
		})

		.to("#main-content", {
			opacity: 1,
			y: 0,
			duration: 1,
			ease: "power3.out"
		}, "-=0.8");
});