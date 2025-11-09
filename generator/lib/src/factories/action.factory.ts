import { GLOBAL_CONFIG } from "../../config/generate";
import { Actions } from "../model/script/actions";

class ActionFactory {
  setGlobal = (
    name: string,
    value: number,
    area = "LOCALS"
  ): Actions.Action => ({
    name: "SetGlobal",
    params: [name, area, value],
  });

  setGlobalTimer = (name: string, value: number): Actions.Action => ({
    name: "SetGlobalTimer",
    params: [name, "LOCALS", value],
  });

  setGlobalRoundTimer = (): Actions.Action => ({
    name: "SetGlobalTimer",
    params: [GLOBAL_CONFIG.bafConstants.roundTimer, "LOCALS", 6],
  });

  enableInterrupt = (): Actions.Action => ({
    name: "SetInterrupt",
    params: ["TRUE"],
  });

  disableInterrupt = (): Actions.Action => ({
    name: "SetInterrupt",
    params: ["FALSE"],
  });
}

const actionFactory = new ActionFactory();
export default actionFactory;
