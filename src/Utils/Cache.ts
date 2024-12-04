/* eslint-disable @typescript-eslint/no-explicit-any */
export class CacheUtils {
  private static cacheDuration: number = 5 * 60 * 1000; // 5 minutes in milliseconds

  public static loadFromCache<T>(key: string): T | null {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      const now = Date.now();
      if (now - parsed.timestamp < this.cacheDuration) {
        return parsed.data;
      } else {
        localStorage.removeItem(key);
      }
    }
    return null;
  }

  public static saveToCache<T>(key: string, data: T): void {
    const now = Date.now();
    const cacheData = { data, timestamp: now };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

  public static clearCache(): void {
    localStorage.clear();
  }
}
