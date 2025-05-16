export const GLOBAL_CONFIG = {
  files: {
    coreMonsters: "lib/pnp-monster/common/core.tpa",
    spellResources: "lib/common/spell-resources.tpa",
    spellFunctions: "lib/common/spell-functions.tpa",
    immunities: "lib/common/immunities.tpa",
  },
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
