import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './scripts/counter.ts'
import Lenis from 'lenis'
import { heroTitle } from './scripts/motions/motions.ts'
import { mapMotion } from './scripts/motions/map.ts'
import { initMotionText } from './scripts/motions/text.ts'
import { parallaxUniversal } from './scripts/motions/paralax.ts'
import { curtainPanel } from './scripts/motions/curtain.ts'
import { initHeaderAnimations } from './scripts/motions/header.ts'
import Alpine from 'alpinejs'
import { initTextLiftHover, initTextPressUp } from './scripts/motions/texthover.ts'
import { initMotionBlocks } from './scripts/motions/block.ts'
import { initMenu } from './scripts/motions/menu.ts'
import "./scripts/motions/overlay.ts"
import "./scripts/motions/modal.ts"
import "./scripts/motions/marquee.ts"
import "./scripts/motions/playvideo.ts"
import { CookieConsentManager } from './scripts/motions/cookie.ts'
import { AgeVerificationManager } from './scripts/motions/ageverification.ts'
// import "./scripts/motions/preloader.ts"
import { initSounds } from './scripts/motions/soundclick.ts'
import { initAccordion } from './scripts/motions/accordion.ts'

// Alpine init ___
window.Alpine = Alpine
Alpine.start()
// ___ Alpine init

// Lenis ___
const lenis = new Lenis({
	autoRaf: true,
	// autoResize: true,
	// duration: 1,
	// easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
});

window.lenis = lenis; // for debug

// Listen for the scroll event and log the event data
lenis.on('scroll', (e) => {
	console.log(e);
});
// ___ Lenis

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
// 	<div class="bg-amber-200">
// 		<a href="https://vite.dev" target="_blank">
// 			<img src="${viteLogo}" class="logo" alt="Vite logo" />
// 		</a>
// 		<a href="https://www.typescriptlang.org/" target="_blank">
// 			<img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
// 		</a>
// 		<h1>Vite + TypeScript</h1>
// 		<div class="card">
// 			<button id="counter" type="button"></button>
// 		</div>
// 		<p class="read-the-docs">
// 			Click on the Vite and TypeScript logos to learn more
// 		</p>
// 	</div>
// `
// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)


document.addEventListener("DOMContentLoaded", () => {


	const title = document.querySelector('.main-title')
	heroTitle(title)
	const cookieManager = new CookieConsentManager();
	cookieManager.init();
	const ageGate = new AgeVerificationManager();
	ageGate.init();

	mapMotion()
	initMotionText()
	parallaxUniversal()
	curtainPanel()
	initHeaderAnimations()
	initTextLiftHover()
	initTextPressUp()
	initMotionBlocks()
	initMenu()
	initSounds()
	initAccordion()
})