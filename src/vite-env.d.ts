/// <reference types="vite/client" />

// Define a Result type
type Result<T> = { success: true; data: T } | { success: false; error: string };

declare module "*.jpg";
declare module "*.png";
declare module "*.jpeg";
declare module "*.svg";
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
// declarations.d.ts

// Añade esta declaración para permitir que TypeScript reconozca LForms como una propiedad en window
interface Window {
  LForms: any; // O el tipo específico que debería tener LForms
}
