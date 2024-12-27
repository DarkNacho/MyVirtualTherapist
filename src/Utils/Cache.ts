/* eslint-disable @typescript-eslint/no-explicit-any */
export class CacheUtils {
  private static cacheDuration: number = 5 * 60 * 1000; // 5 minutes in milliseconds
  private static storageKey: string = "cache";

  private static getCache(): Record<string, any> {
    const cache = localStorage.getItem(this.storageKey);
    return cache ? JSON.parse(cache) : {};
  }

  private static saveCache(cache: Record<string, any>): void {
    localStorage.setItem(this.storageKey, JSON.stringify(cache));
  }

  public static loadFromCache<T>(key: string): T | null {
    const cache = this.getCache();
    const cached = cache[key];
    if (cached) {
      const now = Date.now();
      if (now - cached.timestamp < this.cacheDuration) {
        return cached.data;
      } else {
        delete cache[key];
        this.saveCache(cache);
      }
    }
    return null;
  }

  public static saveToCache<T>(key: string, data: T): void {
    const cache = this.getCache();
    const now = Date.now();
    cache[key] = { data, timestamp: now };
    this.saveCache(cache);
  }

  public static clearCache(): void {
    localStorage.removeItem(this.storageKey);
  }

  public static clearCacheByKeySubstring(substring: string): void {
    const cache = this.getCache();
    const keysToDelete = Object.keys(cache).filter((key) =>
      key.includes(substring)
    );
    keysToDelete.forEach((key) => delete cache[key]);
    this.saveCache(cache);
  }
}
