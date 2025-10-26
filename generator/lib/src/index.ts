import chalk from "chalk";
import { program } from "commander";
import stateService from "./services/state.service";
import { ANKHEG } from "../creatures/ankheg/ankheg";

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
      // let chain: Promise<any> = Promise.resolve();
      [ANKHEG].forEach((creature) => {
        console.log(creature.behavior);
        //CREATURES.forEach((creature) => {
        // chain = chain.then(() => mainService.processCreature(creature));
      });
      //   return chain
      //     .then(() => mainService.generateCommonCode())
      //     .then(() => {
      //       console.log(chalk.green(`\nFinished!`));
      //     });
      //   //.catch(error => { console.trace(chalk.red(error)); });
    });
}

main();
