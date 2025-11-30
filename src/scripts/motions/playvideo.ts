import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger)



document.addEventListener("DOMContentLoaded", () => {
	// Выбираем все видео внутри наших карточек
	// Я использую универсальный селектор, но лучше дать им спец. класс, например .video-scroll
	const scrollVideos = gsap.utils.toArray('.video-card video');

	scrollVideos.forEach(video => {

		ScrollTrigger.create({
			trigger: video, // Элемент, за которым следим
			// start: "top center", // Начать, когда верх видео достигнет центра экрана
			// end: "bottom center", // Закончить, когда низ видео достигнет центра экрана
			start: "top 75%", // Чуть раньше, когда верх видео в нижней четверти экрана
			end: "bottom 25%", // Закончить, когда низ видео в верхней четверти

			// markers: true, // РАСКОММЕНТИРУЙ для отладки (покажет полосы старта/стопа)

			// События:
			onEnter: () => video.play(),      // Вошли в зону видимости снизу
			onEnterBack: () => video.play(),  // Вошли в зону видимости сверху (при скролле назад)
			onLeave: () => video.pause(),     // Ушли из зоны видимости вверх
			onLeaveBack: () => video.pause(), // Ушли из зоны видимости вниз
		});

		// Опционально: Скрываем оверлей, когда видео играет
		const overlay = video.parentElement.querySelector('.play-overlay');
		if (overlay) {
			video.addEventListener('play', () => overlay.style.opacity = '0');
			video.addEventListener('pause', () => overlay.style.opacity = '1');
		}

	});
});