/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_ROOT_API: string
    readonly VITE_API_TIMEOUT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
