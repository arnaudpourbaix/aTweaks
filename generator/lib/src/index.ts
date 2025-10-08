import chalk from "chalk";
import { program } from "commander";
import { CREATURES, CREATURES_TEST } from "../creatures";
import { MainService } from "./services/main.service";
import { StateService } from "./services/state.service";

const clear = require("clear");
const figlet = require("figlet");

clear();
console.log(
  figlet.textSync("script BAF generator", { horizontalLayout: "full" })
);

program
  .version("0.0.1")
  .description("Generate script BAF files for IE games")
  .parse(process.argv);

async function main() {
  const stateService = new StateService();
  return stateService.init().then(() => {
    const mainService = new MainService();
    let chain: Promise<any> = Promise.resolve();
    CREATURES.forEach((creature) => {
      chain = chain.then(() => mainService.processCreature(creature));
    });
    return chain
      .then(() => mainService.generateCommonCode())
      .then(() => {
        console.log(chalk.green(`\nFinished!`));
      });
    //.catch(error => { console.trace(chalk.red(error)); });
  });
}

main();
