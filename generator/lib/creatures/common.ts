import responseFactory from "../src/factories/response.factory";
import { CustomCode } from "../src/model/script/script";

export const hunterCustomCode: CustomCode = {
  location: "init",
  type: "insertBefore",
  statements: [
    // FIXME: these statements don't work properly
    // {
    //   triggers: [
    //     { name: "Allegiance", params: ["Myself", "NEUTRAL"] },
    //     {
    //       name: "NearSavedLocation",
    //       params: ["Myself", "INITIAL", 8],
    //       negation: true,
    //     },
    //     {
    //       name: "Class",
    //       params: ["Myself", "HUNTER_CREATURE"],
    //       negation: true,
    //     },
    //     { name: "Range", params: ["FOOD_CREATURE", 30], negation: true },
    //   ],
    //   responses: responseFactory.response([
    //     { name: "MoveToSavedLocationn", params: ["INITIAL", "LOCALS"] },
    //   ]),
    // },
    // {
    //   triggers: [
    //     triggerFactory.globalTimerExpired("BD_Move"),
    //     { name: "Allegiance", params: ["Myself", "NEUTRAL"] },
    //     { name: "Detect", params: ["GOODCUTOFF"] },
    //     {
    //       name: "NearSavedLocation",
    //       params: ["Myself", "INITIAL", 8],
    //     },
    //     { name: "Range", params: ["FOOD_CREATURE", 30], negation: true },
    //   ],
    //   responses: [
    //     {
    //       weight: 40,
    //       actions: [
    //         actionFactory.setGlobalTimer("BD_Move", 6),
    //         { name: "RandomWalk" },
    //       ],
    //     },
    //     {
    //       weight: 40,
    //       actions: [
    //         actionFactory.setGlobalTimer("BD_Move", 6),
    //         { name: "RandomTurn" },
    //       ],
    //     },
    //     {
    //       weight: 20,
    //       actions: [
    //         actionFactory.setGlobalTimer("BD_Move", 6),
    //         { name: "NoAction" },
    //       ],
    //     },
    //   ],
    // },
    {
      triggers: [
        { name: "Allegiance", params: ["Myself", "NEUTRAL"] },
        { name: "Class", params: ["Myself", "HUNTER_CREATURE"] },
        { name: "Detect", params: ["PC"] },
        { name: "See", params: ["FOOD_CREATURE"] },
      ],
      responses: responseFactory.response([
        { name: "AttackOneRound", params: ["LastSeenBy"] },
      ]),
    },
  ],
  abilities: [],
};
