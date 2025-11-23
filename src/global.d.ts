// src/global.d.ts
export {};

declare global {
  interface Window {
    google: any;
    href: any;
  }

  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_KEY: string;
    }
  }
}
