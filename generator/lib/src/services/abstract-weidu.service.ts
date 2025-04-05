import { CodeLine } from "../model/tp2";
import { UtilsService } from "./utils.service";

export class AbstractWeiduService {
    protected utils = new UtilsService();

    protected add(lines: CodeLine[], code: string, tab?: number) {
        if (tab === undefined) {
            tab = lines.length ? (lines.at(-1) as CodeLine).tab : 0;
        }
        lines.push({ tab, code })
    };

    protected getIntegerValue(value: number | string) {
        const val = `${value}`.trim();
        if (!val.startsWith("-")) return value;
        return `"${val}"`;
    }

    protected executeCodeWithExcludedFiles(lines: CodeLine[], tab: number, code: string, files: string[]) {
        if (!files.length) {
            return this.add(lines, code, tab);
        }
        const conditions = files.map(f => `NOT "%SOURCE_RES%" STRING_EQUAL_CASE ~${f}~`);
        this.add(lines, `PATCH_IF ${conditions.join(' AND ')} BEGIN`, tab);
        this.add(lines, code, tab + 1);
        this.add(lines, 'END', tab);
    }

}
