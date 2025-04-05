import chalk from "chalk";
import { program } from "commander";
import glob from "glob";
import { MainService } from "./services/main.service";
import { StateService } from "./services/state.service";
import * as fs from "fs";
import path from "path";
import { State } from "./state";

const clear = require("clear");
const figlet = require("figlet");

clear();
console.log(
  figlet.textSync("script BAF generator", { horizontalLayout: "full" })
);

program
  .version("0.0.1")
  .description("Generate script BAF files for IE games")
  .option("-m, --mod <folder>", "Mod folder (fullpath)")
  .parse(process.argv);

const options = program.opts();

if (!options.mod) {
  program.outputHelp();
  process.exit();
}

async function main() {
  const stateService = new StateService();
  return stateService
    .init()
    .then(() =>
      glob(
        path.join(State.config.creaturesFolder, "*.json").replace(/\\/g, "/")
      )
    )
    .then((files) => {
      const mainService = new MainService();
      let chain: Promise<any> = Promise.resolve();
      files.forEach((file) => {
        chain = chain.then(() => mainService.processFile(file));
      });
      return chain
        .then(() => mainService.generateCommonCode())
        .then(() => {
          console.log(chalk.green(`Finished!`));
        });
      //.catch(error => { console.trace(chalk.red(error)); });
    });
}

main();
