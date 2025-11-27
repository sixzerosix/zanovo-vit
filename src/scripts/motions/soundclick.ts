// soundOnClick.ts
// Помести этот файл рядом с остальными (например: utils/soundOnClick.ts)

const soundsCache = new Map<string, HTMLAudioElement>();

function loadSound(name: string): HTMLAudioElement {
	if (soundsCache.has(name)) {
		return soundsCache.get(name)!;
	}

	// Автоматически ищем файлы в /sounds/click1.mp3, /sounds/pop.ogg и т.д.
	// Поддерживает mp3, ogg, wav
	const audio = new Audio();
	audio.src = `/sounds/${name}.mp3`; // можно поменять путь
	audio.preload = "auto";
	audio.volume = 0.4; // приятная громкость по умолчанию

	soundsCache.set(name, audio);
	return audio;
}

// Опционально: можно задать громкость глобально или для конкретного звука
document.addEventListener("click", (e) => {
	const target = (e.target as HTMLElement).closest("[data-sound]");
	if (!target) return;

	const soundName = (target as HTMLElement).dataset.sound!;
	if (!soundName) return;

	// Поддержка кастомной громкости: data-sound="click1" data-volume="0.8"
	const volume = target.dataset.volume ? parseFloat(target.dataset.volume) : 0.4;

	const audio = loadSound(soundName);
	audio.currentTime = 0;     // сбрасываем, чтобы можно было кликать быстро
	audio.volume = volume;
	audio.play().catch(() => {
		// Если браузер блокирует автоплей — ничего страшного, просто молчим
	});
});

// Готово! Просто подключаешь один раз:
export function initSounds() {
	// Ничего не нужно делать — всё работает через делегирование
	console.log("Звуки по клику инициализированы");
}