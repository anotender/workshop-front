export class StringUtils {

  static isEmpty(s: string): boolean {
    return !s;
  }

  static isNotEmpty(s: string): boolean {
    return !this.isEmpty(s);
  }

  static isBlank(s: string): boolean {
    return this.isEmpty(s) || s.trim().length === 0;
  }

  static isNotBlank(s: string): boolean {
    return !this.isBlank(s);
  }

  static containsIgnoreCase(str: string, substr: string): boolean {
    return this.isNotEmpty(str) && this.isNotEmpty(substr) && str.toLowerCase().includes(substr.toLowerCase());
  }

  static getStringOrNull(s: string): string {
    return this.isNotBlank(s) ? s : null;
  }

}
