import chalk from "chalk";
import { program } from "commander";
import mainService from "./services/main.service";
import stateService from "./services/state.service";

const clear = require("clear");
const figlet = require("figlet");

// clear();
// console.log(
//   figlet.textSync("script BAF generator", { horizontalLayout: "full" })
// );

program
  .version("0.0.1")
  .description("Generate WEIDU code and BAF files for IE games")
  .parse(process.argv);

async function main() {
  return Promise.resolve()
    .then(() => stateService.init())
    .then(() => {
      mainService.checkPresets();
      mainService.generateCreatures();
      mainService.generateCommonCode();
      mainService.generateTranslations();
      console.log(chalk.green(`\nFinished!`));
    });
}

main().catch((e) => {
  console.error(chalk.red(`\nError: ${e instanceof Error ? e.message : e}`));
  process.exit(1);
});
