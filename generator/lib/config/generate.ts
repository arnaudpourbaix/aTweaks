export const GLOBAL_CONFIG = {
  commonCreatureFile: "lib/pnp-monster/common.tpa",
  commonSpellResourcesFile: "lib/common/spell-resources.tpa",
  commonFunctionsFile: "lib/common/immune-trait.tpa",
  constitutionAffectHitPoint: true,
  bafConstants: {
    combatStarted: "JA#COMBAT",
    disableSpellcasting: "JA#DISABLE_SPELLCASTING",
    initGlobal: "JA#INIT",
    restTimer: "JA#REST",
    helpTimer: "JA#HELP",
    roundTimer: "JA#ROUND",
    noOpenDoor: "RR#NOPND",
    dialog: "JA#DIALOG",
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
