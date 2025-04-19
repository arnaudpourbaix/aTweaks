import { CodeLine } from "../model/misc";
import { UtilsService } from "./utils.service";

export class AbstractWeiduService {
  protected utils = UtilsService.instance;

  protected addConditionalSourceRes(
    lines: CodeLine[],
    code: string,
    tab: number,
    files: string[],
    exclude: boolean
  ) {
    if (!files.length) return this.add(lines, code, tab);
    this.startConditionalSourceRes(lines, tab, files, exclude);
    this.add(lines, code, tab + 1);
    this.add(lines, "END", tab);
  }

  protected startConditionalSourceRes(
    lines: CodeLine[],
    tab: number,
    files: string[],
    exclude: boolean
  ) {
    const fileEquals = files.map(
      (f) => `(${exclude ? "NOT " : ""}"%SOURCE_RES%" STRING_EQUAL_CASE ~${f}~)`
    );
    this.add(
      lines,
      `PATCH_IF ${fileEquals.join(exclude ? " AND " : " OR ")} BEGIN `,
      tab
    );
  }

  protected add(lines: CodeLine[], code: string, tab?: number) {
    if (tab === undefined) {
      tab = lines.length ? (lines.at(-1) as CodeLine).tab : 0;
    }
    lines.push({ tab, code });
  }

  protected getIntegerValue(value: number | string) {
    const val = `${value}`.trim();
    if (!val.startsWith("-")) return value;
    return `"${val}"`;
  }

  protected executeCodeWithExcludedFiles(
    lines: CodeLine[],
    tab: number,
    code: string,
    files: string[]
  ) {
    if (!files.length) {
      return this.add(lines, code, tab);
    }
    const conditions = files.map(
      (f) => `NOT "%SOURCE_RES%" STRING_EQUAL_CASE ~${f}~`
    );
    this.add(lines, `PATCH_IF ${conditions.join(" AND ")} BEGIN`, tab);
    this.add(lines, code, tab + 1);
    this.add(lines, "END", tab);
  }

  protected getWrite(size: number) {
    if (size === 1) return "WRITE_BYTE";
    else if (size === 2) return "WRITE_SHORT";
    else return "WRITE_LONG";
  }
}
