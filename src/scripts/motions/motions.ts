import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger)



gsap.to("#wnatages", {
	y: "-100%",
	duration: 3,
	ease: "none",
	scrollTrigger: {
		trigger: "#wnatages_section",
		start: "top top",
		pin: true,
		scrub: true,
		end: "+=300%",
	},
});

const wnatagesCards = document.querySelectorAll(`#wnatages > div`);

wnatagesCards.forEach((triggerEl) => {


	// Начальные стили
	// gsap.set(triggerEl, { opacity: 0 });


	// gsap.fromTo(
	// 	triggerEl,
	// 	{ y: 80, opacity: 0 },
	// 	{
	// 		y: 0,
	// 		opacity: 1,
	// 		duration: 1,
	// 		ease: "power3.out",
	// 		scrollTrigger: {
	// 			trigger: triggerEl,
	// 			start: "50% top",
	// 			end: "20%",
	// 			scrub: true,
	// 		}
	// 	}
	// )



	// 3. Создаём ScrollTrigger
	// ScrollTrigger.create({
	// 	trigger: triggerEl,
	// 	start: "top 80%",
	// 	scrub: true,
	// 	onEnter: () => {
	// 		gsap.fromTo(
	// 			triggerEl,
	// 			{ y: 80, opacity: 0 },
	// 			{
	// 				y: 0,
	// 				opacity: 1,
	// 				duration: 1,
	// 				ease: "power3.out",
	// 			}
	// 		)
	// 	}
	// });
});



gsap.to('.box', {
	scrollTrigger: '.box', // start animation when ".box" enters the viewport
	x: 500,
	duration: 2,
	start: "+=500"

});

let tl = gsap.timeline({
	// yes, we can add it to an entire timeline!
	scrollTrigger: {
		trigger: '.section',
		pin: true, // pin the trigger element while active
		start: 'top top', // when the top of the trigger hits the top of the viewport
		end: '+=100%', // end after scrolling 500px beyond the start
		scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
		snap: {
			snapTo: 'labels', // snap to the closest label in the timeline
			duration: { min: 0.2, max: 3 }, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
			delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
			ease: 'power1.inOut' // the ease of the snap animation ("power3" by default)
		}
	}
});

// add animations and labels to the timeline
tl.addLabel('start')
	.from('.box', { scale: 0.3, rotation: 45, autoAlpha: 0 })
	.addLabel('color')
	.from('.box', { backgroundColor: '#28a92b' })
	.addLabel('spin')
	.to('.box', { rotation: 360 })
	.addLabel('end');


// Title motion ___
export function heroTitle(titleElement: HTMLDivElement) {
	try {

		// Main title test
		function splitWordsToSpans(el) {
			const text = el.textContent.trim();
			// Разбиваем по пробелам, но сохраняем последовательность пробелов/символов
			// Простая техника: split по " " и потом соединяем с &nbsp; при вставке.
			const words = text.split(/\s+/);
			el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
			// После вставки оставляем реальные пробелы между span'ами (браузер поставит обычный пробел)
		}


		;
		splitWordsToSpans(titleElement);

		const words = gsap.utils.toArray('.main-title .word');

		// Timeline: слова исчезают по очереди. scrub: true связывает прогресс анимации со скроллом.
		const tlTitle = gsap.timeline({
			scrollTrigger: {
				trigger: titleElement,
				start: "top 60%",   // когда верх заголовка достигнет 60% высоты вьюпорта — старт
				end: "bottom 10%",  // скролл-длина анимации (регулирует скорость исчезания)
				scrub: 0.6,         // плавное связывание прогресса со скроллом
				// markers: true,   // включите для отладки
			}
		});

		// Анимация: каждый спан уходит вверх, уменьшается и теряет opacity
		tlTitle.to(words, {
			y: "-=300",
			opacity: 0,
			scale: 0.9,
			transformOrigin: "center center",
			ease: "power1.out",
			stagger: {
				each: 0.04,   // интервал между словами в секундах (в timeline-прогрессе)
				from: "start"
			}
		}, 0);

	} catch (error) {
		console.error("Error in heroTitle motion:", error);
	}
}
// ___ Title motion