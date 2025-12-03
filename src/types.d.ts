// Global type augmentations and lightweight module shims
declare module 'alpinejs' {
  const Alpine: any
  export default Alpine
}

// Some bundlers/imports point directly to the CJS bundle path — provide a shim
declare module 'alpinejs/dist/module.cjs.js' {
  const Alpine: any
  export default Alpine
}

declare module 'lenis' {
  const Lenis: any
  export default Lenis
}

declare module '*.svg' {
  const src: string
  export default src
}

declare global {
  interface Window {
    Alpine: any
    lenis: any
    sendForm: (() => void) | undefined
  }
}

export {}
