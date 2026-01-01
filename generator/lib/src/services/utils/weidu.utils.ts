class WeiduUtils {
  getIntegerValue(value: number | string | undefined): string | undefined {
    if (value === undefined || value === "") return;
    const val = `${value}`.trim();
    if (!val.startsWith("-")) return val;
    return `"${val}"`;
  }

  getBooleanValue(value: boolean | undefined): string | undefined {
    if (value === undefined) return;
    return value ? "1" : "0";
  }

  getIdsValue(file: string, value: string | undefined): string | undefined {
    if (value === undefined) return undefined;
    return `IDS_OF_SYMBOL (~${file}~ ~${value}~)`;
  }
}

const weiduUtils = new WeiduUtils();
export default weiduUtils;
