import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Бережно обрабатываем текст, сохраняя HTML
function wrapWordsInNode(root: HTMLElement) {
	const walker = document.createTreeWalker(
		root,
		NodeFilter.SHOW_TEXT,
		null
	);

	const textNodes: Node[] = [];
	let node: Node | null;
	while ((node = walker.nextNode())) {
		textNodes.push(node);
	}

	textNodes.forEach(textNode => {
		const parent = textNode.parentNode as Element | null;

		// Важно: не трогаем текст внутри уже обёрнутых span'ов с классом motion-word
		if (parent && parent.closest && parent.closest('.motion-word')) return;

		const text = textNode.textContent || '';
		const words = text.split(/(\s+)/); // ← сохраняем пробелы как отдельные элементы!

		if (words.length === 1 && !words[0].trim()) {
			// Это чисто пробельный узел — оставляем как есть (это и есть переносы строк!)
			return;
		}

		const fragment = document.createDocumentFragment();

		words.forEach(part => {
			if (/^\s+$/.test(part)) {
				// Это пробелы/переносы — оставляем как текстовый узел
				fragment.appendChild(document.createTextNode(part));
			} else if (part.trim()) {
				// Это слово — оборачиваем в span
				const span = document.createElement('span');
				span.className = 'motion-word inline-block opacity-0';
				span.textContent = part;
				fragment.appendChild(span);
			}
		});

		(textNode as ChildNode).replaceWith(fragment);
	});
}

// Карта анимаций (можно добавлять свои)
const animations: Record<string, (words: NodeListOf<Element>) => gsap.core.Tween> = {
	"fadeup": (words) =>
		gsap.fromTo(
			words,
			{ y: 20, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				stagger: 0.09,
				duration: 0.9,
				ease: "power3.out"
			}
		),

	"zoom": (words) =>
		gsap.fromTo(
			words,
			{ scale: 0.8, opacity: 0 },
			{
				scale: 1,
				opacity: 1,
				stagger: 0.06,
				duration: 0.5,
				ease: "power2.out",
			}
		),
};

// Инициализация
export function initMotionText() {
	const elements = document.querySelectorAll<HTMLElement>("[class*='motion-text-']");

	elements.forEach((el) => {
		const cls = [...el.classList].find(c => c.startsWith("motion-text-"));
		if (!cls) return;
		const animationName = cls.replace("motion-text-", "");

		const animation = animations[animationName];
		if (!animation) return;

		// Не ломаем HTML — обрабатываем вложенные узлы
		wrapWordsInNode(el);

		const words = el.querySelectorAll<Element>(".motion-word");

		ScrollTrigger.create({
			trigger: el,
			start: "top 85%",
			onEnter: () => animation(words),
			once: true,
		});
	});
}