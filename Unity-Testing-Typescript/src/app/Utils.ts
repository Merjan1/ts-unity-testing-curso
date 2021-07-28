import { UrlWithParsedQuery, parse } from "url";

/*istanbul ignore next */
export class Utils {
  public static parseUrl(url: string): UrlWithParsedQuery {
    if (!url) {
      throw new Error("Empty url!");
    }

    return parse(url, true);
  }

  /*istanbul ignore next */
  public static toUpperCase(arg: string) {
    return arg.toUpperCase();
  }
}
