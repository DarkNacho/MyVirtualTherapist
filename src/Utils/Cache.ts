/* eslint-disable @typescript-eslint/no-explicit-any */
export class CacheUtils {
  private static cacheDuration: number = 5 * 60 * 1000; // 5 minutes in milliseconds
  private static storageKey: string = "cache";

  private static getCache(): Record<string, any> {
    // Retorna siempre un objeto vacío
    return {};
  }

  private static saveCache(cache: Record<string, any>): void {
    // No hacer nada
    console.log("Cache guardado desactivado");
  }

  public static loadFromCache<T>(key: string): T | null {
    // Siempre retorna null (caché no encontrado)
    return null;
  }

  public static saveToCache<T>(key: string, data: T): void {
    // No hacer nada
    console.log("Guardado en caché desactivado");
  }

  public static clearCache(): void {
    localStorage.removeItem(this.storageKey);
  }

  public static clearCacheByKeySubstring(substring: string): void {
    // No hacer nada
    console.log("Limpieza de caché desactivada");
  }
}
