export default class StringUtils {
  public static capitalise (string: string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return "";
  }
}