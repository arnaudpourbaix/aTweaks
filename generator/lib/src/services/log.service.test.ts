import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import logService from "./log.service";

const CREATING_OGRE = "Creating Ogre...";

describe("LogService", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "atweaks-log-"));
    logService.filePath = path.join(tempDir, "generator.log");
    logService.enabled = false;
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  function readLog(): string {
    return fs.readFileSync(logService.filePath, "utf-8");
  }

  it("writes nothing before init() has been called", () => {
    logService.log("should not be written");
    logService.section("should not be written either");
    expect(fs.existsSync(logService.filePath)).toBe(false);
  });

  it("init creates an empty file and enables writes", () => {
    logService.init();
    expect(readLog()).toBe("");
  });

  it("init truncates a file left over from a previous run", () => {
    fs.writeFileSync(logService.filePath, "stale content from a previous run\n");
    logService.init();
    expect(readLog()).toBe("");
  });

  it("log writes a plain line with no indent right after init", () => {
    logService.init();
    logService.log("Checking cdogr, spell found: null");
    expect(readLog()).toBe("Checking cdogr, spell found: null\n");
  });

  it("section writes a blank line, the title, and a matching underline", () => {
    logService.init();
    const title = "Generating creatures";
    logService.section(title);
    expect(readLog()).toBe(`\n${title}\n${"-".repeat(title.length)}\n`);
  });

  it("header writes a blank line then the title, and indents subsequent log lines", () => {
    logService.init();
    logService.header(CREATING_OGRE);
    logService.log("dual wielding detected");
    expect(readLog()).toBe(`\n${CREATING_OGRE}\n    dual wielding detected\n`);
  });

  it("section resets the indent back to top-level after a header", () => {
    logService.init();
    logService.header(CREATING_OGRE);
    logService.log("dual wielding detected");
    const title = "Generating common code";
    logService.section(title);
    logService.log("writing core.tpa");
    expect(readLog()).toBe(
      `\n${CREATING_OGRE}\n    dual wielding detected\n\n${title}\n${"-".repeat(
        title.length,
      )}\nwriting core.tpa\n`,
    );
  });

  it("log indents every line of a multi-line message", () => {
    logService.init();
    logService.header(CREATING_OGRE);
    logService.log("line one\nline two");
    expect(readLog()).toBe(`\n${CREATING_OGRE}\n    line one\n    line two\n`);
  });
});
