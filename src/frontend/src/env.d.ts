/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ROOT_API: string;
  readonly VITE_API_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Google Analytics, loaded and configured in index.html. It leaves out undefined parameters.
declare function gtag(
  command: "event",
  eventName: string,
  params: Record<string, string | number | boolean | undefined>,
): void;
