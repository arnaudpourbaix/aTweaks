import { CodeLine } from "../model/misc";

export class AbstractCodeService {
  protected initLines() {
    const lines: CodeLine[] = [];
    this.add(lines, "// Generated file (don't edit)");
    this.add(lines, "");
    return lines;
  }

  protected add(lines: CodeLine[], code: string, tab?: number) {
    if (tab === undefined) {
      tab = lines.length ? (lines.at(-1) as CodeLine).tab : 0;
    }
    lines.push({ tab, code });
  }
}
