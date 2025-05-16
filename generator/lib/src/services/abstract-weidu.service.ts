import { EffectTypeEnum } from "../model/final/effect.type";
import { CodeLine, StringReference } from "../model/misc";
import { GrabService } from "./grab.service";
import { UtilsService } from "./utils.service";

export class AbstractWeiduService {
  protected utils = UtilsService.instance;
  protected grabService = GrabService.instance;

  protected initLines() {
    const lines: CodeLine[] = [];
    this.add(lines, "// Generated file (don't edit)");
    this.add(lines, "");
    return lines;
  }

  protected deleteEffect(
    lines: CodeLine[],
    tab: number,
    opcode: EffectTypeEnum
  ) {
    this.add(
      lines,
      `LPF DELETE_CRE_EFFECT INT_VAR opcode_to_delete=${opcode} END`,
      tab
    );
  }

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

  protected write(
    lines: CodeLine[],
    offset: number,
    size: number,
    value: number | string | undefined,
    tab?: number
  ) {
    if (!value) return;
    let code = `WRITE_BYTE 0x${offset.toString(16)} ${value}`;
    if (size === 2) code = `WRITE_SHORT 0x${offset.toString(16)} ${value}`;
    else if (size === 4) code = `WRITE_LONG 0x${offset.toString(16)} ${value}`;
    else if (size > 4)
      code = `WRITE_ASCII 0x${offset.toString(16)} ~${value}~ #${size}`;
    this.add(lines, code, tab);
  }

  protected writeAscii(
    lines: CodeLine[],
    offset: number,
    size: number,
    value: string | undefined,
    tab?: number
  ) {
    this.add(
      lines,
      `WRITE_ASCII 0x${offset.toString(16)} ~${value}~ #${size}`,
      tab
    );
  }

  protected writeStringRef(
    lines: CodeLine[],
    offset: number,
    stringRef: StringReference | undefined,
    tab?: number
  ) {
    const value = this.utils.resolveStringRef(stringRef);
    this.write(lines, offset, 4, value, tab);
  }

  protected writeFlag(
    lines: CodeLine[],
    offset: number,
    size: number,
    array: number[] | undefined,
    tab?: number
  ) {
    if (!array) return;
    const value = array.reduce((sum, save) => {
      sum += 2 ** save;
      return sum;
    }, 0);
    this.write(lines, offset, 4, value, tab);
  }

  protected getFlagValue(array: number[] | undefined): number | undefined {
    if (!array) return;
    return array.reduce((sum, save) => {
      sum += 2 ** save;
      return sum;
    }, 0);
  }

  protected getIntegerValue(value: number | string) {
    if (value === 0 || value === "" || value === "0") return;
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
