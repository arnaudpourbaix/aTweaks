export const GLOBAL_CONFIG = {
  commonCreatureFile: "lib/pnp-monster/common.tpa",
  commonFunctionsFile: "lib/common/immune-trait.tpa",
  constitutionAffectHitPoint: true,
  bafConstants: {
    allowMelee: "JA#MELEE",
    combatStarted: "JA#COMBAT",
    disableSpellcasting: "JA#DISABLE_SPELLCASTING",
    initGlobal: "JA#INIT",
    restTimer: "JA#REST",
    roundTimer: "JA#ROUND",
    fullHealSpellResource: "JA#HEAL",
    monsterShoutId: 95,
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
    grabState: "{GrabState}",
    target: "{Target}",
  },
};
