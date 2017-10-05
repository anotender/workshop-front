export class StringUtils {

  static isEmpty(s: string): boolean {
    return !s;
  }

  static isBlank(s: string): boolean {
    return this.isEmpty(s) || s.trim().length === 0;
  }

  static isNotBlank(s: string): boolean {
    return !this.isBlank(s);
  }

  static contains(str: string, substr: string): boolean {
    return str.includes(substr);
  }

  static containsIgnoreCase(str: string, substr: string): boolean {
    return this.contains(str.toLowerCase(), substr.toLowerCase());
  }

}
