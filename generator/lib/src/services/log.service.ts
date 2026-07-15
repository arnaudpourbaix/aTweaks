import * as fs from "fs";
import * as path from "path";

class LogService {
  filePath = path.join(process.cwd(), "generator.log");
  enabled = false;
  private indent = "";

  init(): void {
    this.indent = "";
    this.enabled = true;
    fs.writeFileSync(this.filePath, "");
  }

  section(title: string): void {
    this.indent = "";
    this.write("");
    this.write(title);
    this.write("-".repeat(title.length));
  }

  header(title: string): void {
    this.write("");
    this.write(title);
    this.indent = "    ";
  }

  log(message: string): void {
    for (const line of message.split("\n")) {
      this.write(`${this.indent}${line}`);
    }
  }

  private write(line: string): void {
    if (!this.enabled) return;
    fs.appendFileSync(this.filePath, `${line}\n`);
  }
}

const logService = new LogService();
export default logService;
