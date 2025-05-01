export const GLOBAL_CONFIG = {
  commonCreatureFile: "lib/pnp-monster/common.tpa",
  commonFunctionsFile: "lib/common/immune-trait.tpa",
  constitutionAffectHitPoint: true,
  bafConstants: {
    combatStarted: "JA#COMBAT",
    disableSpellcasting: "JA#DISABLE_SPELLCASTING",
    initGlobal: "JA#INIT",
    restTimer: "JA#REST",
    helpTimer: "JA#HELP",
    roundTimer: "JA#ROUND",
    monsterShoutId: 99,
    summonerShoutId: 98,
    trackingRange: 150,
  },
  tpaConstants: {
    genericScriptsToRemove: [
      "SHOUT",
      "WTASIGHT",
      "WDASIGHT",
      "wtrunsgt",
      "DW2MP0GE",
      "DW2RC2MO",
    ],
  },
  tokens: {
    target: "{Target}",
  },
};
