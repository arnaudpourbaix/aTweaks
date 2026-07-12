import { beforeAll, describe, expect, it, vi } from "vitest";
import { GLOBAL_CONFIG } from "../../../config/generate";
import { POTIONS } from "../../../config/potion";
import { CreatureAbility } from "../../model/creature/ability";
import { CreatureAttack } from "../../model/creature/attack";
import { BEHAVIOR_DEFAULT, CreatureBehavior } from "../../model/creature/behavior";
import { Creature } from "../../model/creature/creature";
import { BuilderOptions } from "../../model/misc";
import { Statements } from "../../model/script/script";
import stateService from "../state.service";
import utils from "../utils/utils.service";
import targetService from "./target.service";
import statementService from "./statement-builder.service";

// hasImmunity/State.immunities backed lookups (e.g. handlePanic's fear check for
// grouped immunities) need the real immunity config loaded first.
beforeAll(async () => {
  await stateService.init();
});

const service = statementService as any;

function fakeCreature(
  overrides: {
    data?: Record<string, any>;
    behavior?: Partial<CreatureBehavior>;
    attack?: Partial<CreatureAttack>;
  } = {},
): Creature {
  return {
    data: { immunities: [], race: "HUMAN", ...overrides.data },
    behavior: { ...BEHAVIOR_DEFAULT, ...overrides.behavior },
    attack: {
      melee: true,
      ranged: false,
      dualWielding: false,
      targetPriorities: [],
      targetStatusWeaponSlot: [],
      selectWeapons: [],
      actions: [{ responseWeight: 100, disableInterrupt: false }],
      ...overrides.attack,
    },
    seeInvisible() {
      return utils.hasImmunity((this as any).data.immunities ?? [], "seeInvisible");
    },
  } as unknown as Creature;
}

function options(summon = false): BuilderOptions {
  return { summon };
}

function fakeAbility(overrides: Partial<CreatureAbility> = {}): CreatureAbility {
  return {
    name: "ability.unknown",
    targets: [],
    triggers: [],
    disableInterrupt: false,
    requireVocal: false,
    canUseWhenPolymorphed: false,
    isSpell: false,
    infiniteUse: false,
    actions: [{ name: "Shout", params: [1] }],
    ...overrides,
  };
}

describe("dialog (private)", () => {
  it("adds no statement when behavior.dialog is empty", () => {
    const statements: Statements = [];
    service.dialog(statements, fakeCreature(), options());
    expect(statements).toEqual([]);
  });

  it("uses a single Name trigger (no Or) for one dialog name", () => {
    const statements: Statements = [];
    service.dialog(
      statements,
      fakeCreature({ behavior: { dialog: ["ja#drow"] } }),
      options(),
    );
    expect(statements).toHaveLength(1);
    expect(statements[0].comment).toBe("Initiate dialog");
    expect(statements[0].triggers).toEqual([
      {
        name: "Global",
        params: [GLOBAL_CONFIG.bafConstants.dialog, "LOCALS", 0],
      },
      { name: "Name", params: ["ja#drow", "Myself"] },
      { name: "NumTimesTalkedTo", params: [0] },
      { name: "See", params: ["PC"] },
    ]);
  });

  it("wraps multiple dialog names in an Or trigger", () => {
    const statements: Statements = [];
    service.dialog(
      statements,
      fakeCreature({ behavior: { dialog: ["ja#drow", "ja#drow2"] } }),
      options(),
    );
    expect(statements[0].triggers[1]).toEqual({
      name: "Or",
      triggers: [
        { name: "Name", params: ["ja#drow", "Myself"] },
        { name: "Name", params: ["ja#drow2", "Myself"] },
      ],
    });
  });
});

describe("handlePanic (private)", () => {
  it("adds no statements when the creature is immune to fear", () => {
    const statements: Statements = [];
    service.handlePanic(
      statements,
      fakeCreature({ data: { immunities: ["fear"] } }),
      options(),
    );
    expect(statements).toEqual([]);
  });

  it("adds a run-away statement and a fallback random-walk statement otherwise", () => {
    const statements: Statements = [];
    service.handlePanic(statements, fakeCreature(), options());
    expect(statements).toHaveLength(2);
    expect(statements[0].comment).toBe("Handle Panic state");
    expect(statements[0].responses[0].actions).toEqual([
      { name: "RunAwayFromNoLeaveArea", params: ["NearestEnemyOf", 15] },
    ]);
    expect(statements[1].responses[0].actions).toEqual([
      { name: "RandomWalkContinuous" },
    ]);
  });
});

describe("destroyUponDeath (private)", () => {
  it("adds nothing when the creature isn't a summon", () => {
    const statements: Statements = [];
    service.destroyUponDeath(statements, fakeCreature(), options(false));
    expect(statements).toEqual([]);
  });

  it("destroys the summon on death", () => {
    const statements: Statements = [];
    service.destroyUponDeath(statements, fakeCreature(), options(true));
    expect(statements).toEqual([
      {
        comment: "Summons are destroyed on death",
        triggers: [{ name: "Die" }],
        responses: [{ weight: 100, actions: [{ name: "DestroySelf" }] }],
      },
    ]);
  });
});

describe("init (private)", () => {
  it("adds nothing for a summon", () => {
    const statements: Statements = [];
    service.init(statements, fakeCreature(), options(true));
    expect(statements).toEqual([]);
  });

  it("sets up the init/precast/rest-timer globals and marks initGlobal set for a non-summon", () => {
    const statements: Statements = [];
    service.init(statements, fakeCreature(), options(false));
    expect(statements).toHaveLength(1);
    expect(statements[0].responses[0].actions).toEqual([
      {
        name: "SetGlobal",
        params: [GLOBAL_CONFIG.bafConstants.combatStarted, "LOCALS", 0],
      },
      {
        name: "SetGlobal",
        params: [
          GLOBAL_CONFIG.bafConstants.precastLongDurationSpells,
          "LOCALS",
          0,
        ],
      },
      {
        name: "SetGlobal",
        params: [
          GLOBAL_CONFIG.bafConstants.precastMidDurationSpells,
          "LOCALS",
          0,
        ],
      },
      {
        name: "SetGlobalTimer",
        params: [GLOBAL_CONFIG.bafConstants.restTimer, "LOCALS", 2400],
      },
      {
        name: "SetGlobal",
        params: [GLOBAL_CONFIG.bafConstants.initGlobal, "LOCALS", 1],
      },
    ]);
  });
});

describe("rest (private)", () => {
  it("adds nothing for a summon", () => {
    const statements: Statements = [];
    service.rest(statements, fakeCreature(), options(true));
    expect(statements).toEqual([]);
  });

  it("resets init and rests, without healing by default", () => {
    const statements: Statements = [];
    service.rest(statements, fakeCreature(), options(false));
    expect(statements).toHaveLength(1);
    expect(statements[0].responses[0].actions).toEqual([
      {
        name: "SetGlobal",
        params: [GLOBAL_CONFIG.bafConstants.initGlobal, "LOCALS", 0],
      },
      { name: "Rest" },
    ]);
  });

  it("adds a full-heal action when behavior.restHeal is set", () => {
    const statements: Statements = [];
    service.rest(
      statements,
      fakeCreature({ behavior: { restHeal: true } }),
      options(false),
    );
    expect(statements[0].responses[0].actions).toContainEqual({
      name: "ApplySpell",
      params: ["Myself", "RESTORE_FULL_HEALTH"],
    });
  });
});

describe("turnHostile (private)", () => {
  it("adds nothing for a summon", () => {
    const statements: Statements = [];
    service.turnHostile(statements, fakeCreature(), options(true));
    expect(statements).toEqual([]);
  });

  it("turns hostile when attacked while neutral, hearing shouts from its own race", () => {
    const statements: Statements = [];
    service.turnHostile(
      statements,
      fakeCreature({ data: { race: "GNOLL" } }),
      options(false),
    );
    expect(statements).toHaveLength(1);
    expect(statements[0].responses[0].actions).toEqual([{ name: "Enemy" }]);
    expect(statements[0].triggers[1]).toEqual({
      name: "Or",
      triggers: [
        { name: "AttackedBy", params: ["GOODCUTOFF", "DEFAULT"] },
        { name: "SpellCastOnMe", params: ["GOODCUTOFF", 0] },
        { name: "TookDamage" },
        {
          name: "Heard",
          params: [
            "EVILCUTOFF.0.GNOLL",
            GLOBAL_CONFIG.bafConstants.monsterShoutId,
          ],
        },
      ],
    });
  });
});

describe("detectCombat (private)", () => {
  it("adds a combat-detection statement for each allegiance pairing", () => {
    const statements: Statements = [];
    service.detectCombat(statements, fakeCreature(), options());
    expect(statements).toHaveLength(2);
    expect(statements[0].triggers).toContainEqual({
      name: "Allegiance",
      params: ["Myself", "EVILCUTOFF"],
    });
    expect(statements[1].triggers).toContainEqual({
      name: "Allegiance",
      params: ["Myself", "GOODCUTOFF"],
    });
  });
});

describe("shouts (private)", () => {
  it("adds nothing when behavior.help is false", () => {
    const statements: Statements = [];
    service.shouts(
      statements,
      fakeCreature({ behavior: { help: false } }),
      options(),
    );
    expect(statements).toEqual([]);
  });

  it("shouts with the monster shout id and reacts to the fixed EVILCUTOFF.0.<race> source for a non-summon", () => {
    const statements: Statements = [];
    service.shouts(
      statements,
      fakeCreature({ data: { race: "GNOLL" } }),
      options(false),
    );
    expect(statements).toHaveLength(3);
    expect(statements[0].responses[0].actions[0]).toEqual({
      name: "Shout",
      params: [GLOBAL_CONFIG.bafConstants.monsterShoutId],
    });
    expect(statements[1].triggers).toContainEqual({
      name: "Heard",
      params: ["EVILCUTOFF.0.GNOLL", GLOBAL_CONFIG.bafConstants.monsterShoutId],
    });
  });

  it("uses the summoner shout id and LastSummonerOf as the heard source for a summon", () => {
    const statements: Statements = [];
    service.shouts(statements, fakeCreature(), options(true));
    expect(statements[0].responses[0].actions[0]).toEqual({
      name: "Shout",
      params: [GLOBAL_CONFIG.bafConstants.summonerShoutId],
    });
    expect(statements[1].triggers).toContainEqual({
      name: "Heard",
      params: ["LastSummonerOf", GLOBAL_CONFIG.bafConstants.summonerShoutId],
    });
  });
});

describe("noActionOutsideOfCombat (private)", () => {
  it("always adds exactly two NoAction guard statements", () => {
    const statements: Statements = [];
    service.noActionOutsideOfCombat(statements, fakeCreature(), options());
    expect(statements).toHaveLength(2);
    expect(statements[0].responses[0].actions).toEqual([
      { name: "NoAction" },
    ]);
    expect(statements[1].responses[0].actions).toEqual([
      { name: "NoAction" },
    ]);
  });

  it("prefixes both statements with an ActionListEmpty check for summons", () => {
    const statements: Statements = [];
    service.noActionOutsideOfCombat(statements, fakeCreature(), options(true));
    expect(statements[0].triggers[0]).toEqual({ name: "ActionListEmpty" });
    expect(statements[1].triggers[0]).toEqual({ name: "ActionListEmpty" });
  });
});

describe("followSummoner (private)", () => {
  it("adds nothing for a non-summon", () => {
    const statements: Statements = [];
    service.followSummoner(statements, fakeCreature(), options(false));
    expect(statements).toEqual([]);
  });

  it("adds a move-to-summoner statement for a summon", () => {
    const statements: Statements = [];
    service.followSummoner(statements, fakeCreature(), options(true));
    expect(statements).toHaveLength(1);
    expect(statements[0].triggers).toContainEqual({ name: "ActionListEmpty" });
    expect(statements[0].responses[0].actions).toEqual([
      { name: "MoveToObject", params: ["LastSummonerOf"] },
    ]);
  });

  it("does not duplicate the ActionListEmpty trigger (it's already unconditionally present since this function only ever runs for summons)", () => {
    const statements: Statements = [];
    service.followSummoner(statements, fakeCreature(), options(true));
    const actionListEmptyCount = statements[0].triggers.filter(
      (t: any) => t.name === "ActionListEmpty",
    ).length;
    expect(actionListEmptyCount).toBe(1);
  });
});

describe("trackTargets (private)", () => {
  it("adds nothing when behavior.tracking is false", () => {
    const statements: Statements = [];
    service.trackTargets(
      statements,
      fakeCreature({ behavior: { tracking: false } }),
      options(),
    );
    expect(statements).toEqual([]);
  });

  it("emits one tracking statement per player plus one for the last-seen enemy", () => {
    const statements: Statements = [];
    service.trackTargets(statements, fakeCreature(), options());
    expect(statements).toHaveLength(7); // 6 players + 1 last-seen-enemy fallback
    expect(statements[0].comment).toBe(
      "Track players if allegiance is not GOODCUTOFF",
    );
    expect(statements[5].comment).toBe("");
    expect(statements[6].comment).toBe(
      "Track last seen enemy if allegiance is GOODCUTOFF",
    );
  });

  it("adds a door-opening statement for intelligent creatures", () => {
    const statements: Statements = [];
    service.trackTargets(
      statements,
      fakeCreature({ data: { intelligence: 11 } }),
      options(),
    );
    expect(statements).toHaveLength(8);
    expect(statements[7].comment).toBe("Open door");
  });

  it("does not add a door-opening statement for creatures at or below intelligence 10", () => {
    const statements: Statements = [];
    service.trackTargets(
      statements,
      fakeCreature({ data: { intelligence: 10 } }),
      options(),
    );
    expect(statements).toHaveLength(7);
  });
});

describe("randomWalkCombat / randomWalkNoCombat (private)", () => {
  it("randomWalkCombat adds nothing when combatWalk is false or the creature is a summon", () => {
    const statements: Statements = [];
    service.randomWalkCombat(
      statements,
      fakeCreature({ behavior: { combatWalk: false } }),
      options(),
    );
    service.randomWalkCombat(statements, fakeCreature(), options(true));
    expect(statements).toEqual([]);
  });

  it("randomWalkCombat adds a combat-flavored random walk plus an avoid-melee-combat statement when unarmed", () => {
    const statements: Statements = [];
    service.randomWalkCombat(
      statements,
      fakeCreature({ attack: { melee: false, ranged: false } }),
      options(false),
    );
    expect(statements).toHaveLength(2);
    expect(statements[0].comment).toBe("Random walking (in combat) ");
    expect(statements[1].comment).toBe("Random facing");
  });

  it("randomWalkNoCombat adds nothing when behavior.walk is false (the default)", () => {
    const statements: Statements = [];
    service.randomWalkNoCombat(statements, fakeCreature(), options(false));
    expect(statements).toEqual([]);
  });

  it("randomWalkNoCombat adds a non-combat-flavored random walk when behavior.walk is true", () => {
    const statements: Statements = [];
    service.randomWalkNoCombat(
      statements,
      fakeCreature({ behavior: { walk: true } }),
      options(false),
    );
    expect(statements).toHaveLength(1);
    expect(statements[0].comment).toBe("Random walking (not in combat) ");
  });
});

describe("thievesAbilities (private)", () => {
  it("adds nothing when the creature has no hideShadow value", () => {
    const statements: Statements = [];
    service.thievesAbilities(statements, fakeCreature(), options());
    expect(statements).toEqual([]);
  });

  it("adds a hide-in-shadows statement wrapped with disable/enable interrupt", () => {
    const statements: Statements = [];
    service.thievesAbilities(
      statements,
      fakeCreature({ data: { hideShadow: 1 } }),
      options(),
    );
    expect(statements).toHaveLength(1);
    const actions = statements[0].responses[0].actions;
    expect(actions[0]).toEqual({ name: "SetInterrupt", params: ["FALSE"] });
    expect(actions[actions.length - 1]).toEqual({
      name: "SetInterrupt",
      params: ["TRUE"],
    });
    expect(actions).toContainEqual({ name: "Hide" });
  });
});

describe("avoidMeleeCombat (private)", () => {
  it("adds nothing when the creature has a melee or ranged attack", () => {
    const statements: Statements = [];
    service.avoidMeleeCombat(statements, fakeCreature(), options());
    expect(statements).toEqual([]);
  });

  it("adds a random-facing statement for a creature with neither melee nor ranged attacks", () => {
    const statements: Statements = [];
    service.avoidMeleeCombat(
      statements,
      fakeCreature({ attack: { melee: false, ranged: false } }),
      options(),
    );
    expect(statements).toEqual([
      {
        comment: "Random facing",
        triggers: [{ name: "Range", params: ["NearestEnemyOf", 30], negation: true }],
        responses: [{ weight: 100, actions: [{ name: "RandomTurn" }] }],
      },
    ]);
  });
});

describe("attack (private)", () => {
  it("falls back to running away when the creature has neither melee nor ranged attacks", () => {
    const statements: Statements = [];
    service.attack(
      statements,
      fakeCreature({ attack: { melee: false, ranged: false } }),
      options(),
    );
    expect(statements).toHaveLength(1);
    expect(statements[0].comment).toBe("Run away from enemies");
  });

  it("adds a reposition statement before attacking when the creature has a ranged attack", () => {
    const statements: Statements = [];
    service.attack(
      statements,
      fakeCreature({
        attack: {
          ranged: true,
          targetPriorities: [{ targets: ["NearestEnemies"], status: ["Able"] }],
        },
      }),
      options(),
    );
    expect(statements[0].comment).toBe("Try to reposition to use ranged attack");
  });

  it("attacks each configured target priority", () => {
    const statements: Statements = [];
    service.attack(
      statements,
      fakeCreature({
        attack: {
          targetPriorities: [{ targets: ["NearestEnemies"], status: ["Able"] }],
        },
      }),
      options(),
    );
    expect(statements.some((s: any) => s.comment === "Attack Able enemy")).toBe(
      true,
    );
  });
});

describe("attackTargetWithStatuses (private)", () => {
  it("throws for a status name that isn't in TARGET_STATUS", () => {
    const statements: Statements = [];
    expect(() =>
      service.attackTargetWithStatuses(
        statements,
        fakeCreature(),
        options(),
        "NearestEnemies",
        ["NotAStatus"],
      ),
    ).toThrow(/Target status details NotAStatus not found/);
  });

  it("throws for a status whose targetTriggers contain an unhandled Or trigger", () => {
    const statements: Statements = [];
    expect(() =>
      service.attackTargetWithStatuses(
        statements,
        fakeCreature(),
        options(),
        "NearestEnemies",
        ["PanicConfused"],
      ),
    ).toThrow(/OR triggers not handled currently: PanicConfused/);
  });

  it("throws when a player-only status is targeted at a non-Players list", () => {
    const statements: Statements = [];
    expect(() =>
      service.attackTargetWithStatuses(
        statements,
        fakeCreature(),
        options(),
        "NearestEnemies",
        ["Sleep"],
      ),
    ).toThrow(/Status Sleep must target party/);
  });

  it("emits an attack block (guard statement + final attack statement) for a normal status", () => {
    const statements: Statements = [];
    service.attackTargetWithStatuses(
      statements,
      fakeCreature(),
      options(),
      "NearestEnemies",
      ["Able"],
    );
    expect(statements).toHaveLength(2);
    expect(statements[0].comment).toBe("Attack Able enemy");
  });

  it("inserts weapon-selection statements between the guard and attack blocks when melee+ranged are both available and no explicit selectWeapons is configured", () => {
    const statements: Statements = [];
    service.attackTargetWithStatuses(
      statements,
      fakeCreature({ attack: { melee: true, ranged: true, selectWeapons: [] } }),
      options(),
      "NearestEnemies",
      ["Able"],
    );
    expect(statements).toHaveLength(4); // guard, 2 weapon-select, final attack
  });

  it("prefers explicit selectWeapons config over the melee+ranged auto-select fallback", () => {
    const statements: Statements = [];
    service.attackTargetWithStatuses(
      statements,
      fakeCreature({
        attack: {
          melee: true,
          ranged: true,
          selectWeapons: [{ slot: "WEAPON2", triggers: [] }],
        },
      }),
      options(),
      "NearestEnemies",
      ["Able"],
    );
    expect(statements).toHaveLength(3); // guard, 1 weapon-select, final attack
  });
});

describe("selectWeaponMeleeRangeStatements (private)", () => {
  it("builds an equip-ranged-then-continue and an equip-melee-then-continue statement, when reached directly", () => {
    const result = service.selectWeaponMeleeRangeStatements(
      fakeCreature(),
      options(),
    );
    expect(result).toHaveLength(2);
    expect(result[0].responses[0].actions).toEqual([
      { name: "EquipRanged" },
      { name: "Continue" },
    ]);
    expect(result[1].responses[0].actions).toEqual([
      { name: "EquipMostDamagingMelee" },
      { name: "Continue" },
    ]);
  });
});

describe("selectWeaponStatements (private)", () => {
  it("returns no statements when no weapon selection is configured", () => {
    const result = service.selectWeaponStatements(fakeCreature(), [], options());
    expect(result).toEqual([]);
  });

  it("builds a statement selecting the configured slot's ability", () => {
    const creature = fakeCreature({
      attack: { selectWeapons: [{ slot: "WEAPON2", triggers: [] }] },
    });
    const result = service.selectWeaponStatements(creature, [], options());
    expect(result).toHaveLength(1);
    expect(result[0].responses[0].actions[0]).toEqual({
      name: "SelectWeaponAbility",
      params: ["SLOT_WEAPON1", 0],
    });
  });

  it("prepends an ActionListEmpty trigger for a summon", () => {
    const creature = fakeCreature({
      attack: { selectWeapons: [{ slot: "WEAPON2", triggers: [] }] },
    });
    const result = service.selectWeaponStatements(creature, [], options(true));
    expect(result[0].triggers[0]).toEqual({ name: "ActionListEmpty" });
  });
});

describe("potions (private)", () => {
  it("adds nothing when behavior.usePotions is false", () => {
    const statements: Statements = [];
    service.potions(statements, fakeCreature(), options());
    expect(statements).toEqual([]);
  });

  it("adds a statement per potion file when behavior.usePotions is true", () => {
    const statements: Statements = [];
    service.potions(
      statements,
      fakeCreature({ behavior: { usePotions: true } }),
      options(),
    );
    expect(statements.length).toBeGreaterThan(0);
    expect(statements[0].responses[0].actions).toContainEqual({
      name: "UseItem",
      params: [expect.any(String), "Myself"],
    });
  });

  it("defaults triggers to an empty array for a potion config that doesn't set any (every real potion currently does)", () => {
    POTIONS.push({ name: "Test potion", files: ["JA#TESTPOTION"] });
    try {
      const statements: Statements = [];
      service.potions(
        statements,
        fakeCreature({ behavior: { usePotions: true } }),
        options(),
      );
      const testStatement = statements.find(
        (s) => s.comment === "Test potion",
      );
      expect(testStatement).toBeDefined();
      expect(testStatement!.triggers.map((t: any) => t.name)).toEqual([
        "HasItem",
        "GlobalTimerNotExpired",
      ]);
    } finally {
      POTIONS.pop();
    }
  });
});

describe("precastLongDurationSpells / precastMidDurationSpells (private)", () => {
  it("precasts every configured long-duration spell plus a trailing reset statement", () => {
    const statements: Statements = [];
    service.precastLongDurationSpells(statements, fakeCreature(), options());
    // Currently only Stoneskin (SPWI) and Ironskin (SPPR) are "long" duration.
    expect(statements).toHaveLength(3);
    expect(statements[0].comment).toBe("Precast Stoneskin");
    expect(statements[1].comment).toBe("Precast Ironskin");
    expect(statements[2].comment).toBeUndefined();
  });

  it("is a no-op while GLOBAL_CONFIG.spellcasterPrecastMidDurationSpells is disabled", () => {
    expect(GLOBAL_CONFIG.spellcasterPrecastMidDurationSpells).toBe(false);
    const statements: Statements = [];
    service.precastMidDurationSpells(statements, fakeCreature(), options());
    expect(statements).toEqual([]);
  });

  it("precasts mid-duration spells once GLOBAL_CONFIG.spellcasterPrecastMidDurationSpells is enabled", () => {
    GLOBAL_CONFIG.spellcasterPrecastMidDurationSpells = true;
    try {
      const statements: Statements = [];
      service.precastMidDurationSpells(statements, fakeCreature(), options());
      expect(statements.length).toBeGreaterThan(0);
    } finally {
      GLOBAL_CONFIG.spellcasterPrecastMidDurationSpells = false;
    }
  });
});

describe("creatureSelfAbility (private)", () => {
  it("wraps a self-targeted ability with the shared round timer by default", () => {
    const statements: Statements = [];
    service.creatureSelfAbility(
      statements,
      fakeCreature(),
      fakeAbility(),
      options(),
    );
    expect(statements).toHaveLength(1);
    expect(statements[0].triggers).toContainEqual({
      name: "GlobalTimerNotExpired",
      params: [GLOBAL_CONFIG.bafConstants.roundTimer, "LOCALS"],
      negation: true,
    });
  });

  it("skips the shared round timer trigger when noRoundTimer is set", () => {
    const statements: Statements = [];
    service.creatureSelfAbility(
      statements,
      fakeCreature(),
      fakeAbility({ noRoundTimer: true }),
      options(),
    );
    expect(statements[0].triggers).not.toContainEqual(
      expect.objectContaining({ name: "GlobalTimerNotExpired" }),
    );
  });

  it("adds a private timer trigger/action when ability.timer is set", () => {
    const statements: Statements = [];
    service.creatureSelfAbility(
      statements,
      fakeCreature(),
      fakeAbility({
        timer: { name: "JA#TIMER", value: 30 },
        noRoundTimer: true,
      }),
      options(),
    );
    expect(statements[0].triggers).toContainEqual({
      name: "GlobalTimerNotExpired",
      params: ["JA#TIMER", "LOCALS"],
      negation: true,
    });
    expect(statements[0].responses[0].actions).toContainEqual({
      name: "SetGlobalTimer",
      params: ["JA#TIMER", "LOCALS", 30],
    });
  });

  it("adds a silence check when requireVocal is set", () => {
    const statements: Statements = [];
    service.creatureSelfAbility(
      statements,
      fakeCreature(),
      fakeAbility({ requireVocal: true }),
      options(),
    );
    expect(statements[0].triggers).toContainEqual({
      name: "StateCheck",
      params: ["Myself", "STATE_SILENCED"],
      negation: true,
    });
  });

  it("adds a polymorph check when the creature can polymorph and the ability doesn't allow it", () => {
    const statements: Statements = [];
    service.creatureSelfAbility(
      statements,
      fakeCreature({ behavior: { canPolymorph: true } }),
      fakeAbility(),
      options(),
    );
    expect(statements[0].triggers).toContainEqual({
      name: "CheckStat",
      params: ["Myself", 0, "POLYMORPHED"],
    });
  });

  it("does not add a polymorph check when the ability explicitly allows it", () => {
    const statements: Statements = [];
    service.creatureSelfAbility(
      statements,
      fakeCreature({ behavior: { canPolymorph: true } }),
      fakeAbility({ canUseWhenPolymorphed: true }),
      options(),
    );
    expect(statements[0].triggers).not.toContainEqual(
      expect.objectContaining({ name: "CheckStat" }),
    );
  });

  it("wraps actions with disable/enable interrupt when disableInterrupt is set", () => {
    const statements: Statements = [];
    service.creatureSelfAbility(
      statements,
      fakeCreature(),
      fakeAbility({ disableInterrupt: true }),
      options(),
    );
    const actions = statements[0].responses[0].actions;
    expect(actions[0]).toEqual({ name: "SetInterrupt", params: ["FALSE"] });
    expect(actions[actions.length - 1]).toEqual({
      name: "SetInterrupt",
      params: ["TRUE"],
    });
  });
});

describe("creatureTargetAbility (private)", () => {
  it("emits one statement per resolved target", () => {
    const statements: Statements = [];
    service.creatureTargetAbility(
      statements,
      fakeCreature(),
      fakeAbility(),
      { name: "Players" },
      options(),
    );
    expect(statements).toHaveLength(6);
  });

  it("adds the shared round timer trigger by default and skips it when noRoundTimer is set", () => {
    const withTimer: Statements = [];
    service.creatureTargetAbility(
      withTimer,
      fakeCreature(),
      fakeAbility(),
      { name: "Players", limit: 1 },
      options(),
    );
    expect(withTimer[0].triggers).toContainEqual({
      name: "GlobalTimerNotExpired",
      params: [GLOBAL_CONFIG.bafConstants.roundTimer, "LOCALS"],
      negation: true,
    });

    const withoutTimer: Statements = [];
    service.creatureTargetAbility(
      withoutTimer,
      fakeCreature(),
      fakeAbility({ noRoundTimer: true }),
      { name: "Players", limit: 1 },
      options(),
    );
    expect(withoutTimer[0].triggers).not.toContainEqual(
      expect.objectContaining({ name: "GlobalTimerNotExpired" }),
    );
  });

  it("adds a LastSeenBy-anchored range trigger when ability.range is set", () => {
    const statements: Statements = [];
    service.creatureTargetAbility(
      statements,
      fakeCreature(),
      fakeAbility({ range: 20 }),
      { name: "Players", limit: 1 },
      options(),
    );
    expect(statements[0].triggers).toContainEqual({
      name: "Range",
      params: ["LastSeenBy", 20],
    });
  });

  it("adds an Allegiance(Myself,ENEMY) trigger when the resolved target list requires an allegiance check (no real target list currently sets this)", () => {
    const spy = vi
      .spyOn(targetService, "getTargetFromAbility")
      .mockReturnValueOnce({ targets: ["PC"], allegianceCheck: true });
    try {
      const statements: Statements = [];
      service.creatureTargetAbility(
        statements,
        fakeCreature(),
        fakeAbility(),
        { name: "Players" },
        options(),
      );
      expect(statements[0].triggers).toContainEqual({
        name: "Allegiance",
        params: ["Myself", "ENEMY"],
      });
    } finally {
      spy.mockRestore();
    }
  });
});

describe("getAdditionals (private)", () => {
  it("returns empty triggers/actions when no additionalCodes entry matches the location", () => {
    expect(service.getAdditionals(fakeCreature(), "trackTargets")).toEqual({
      triggers: [],
      actions: [],
    });
  });

  it("returns the matching additionalCodes entry for the location", () => {
    const additional = {
      location: "trackTargets",
      triggers: [{ name: "See", params: ["PC"] }],
      actions: [{ name: "Wait", params: [1] }],
    };
    const creature = fakeCreature({
      behavior: { additionalCodes: [additional] } as any,
    });
    expect(service.getAdditionals(creature, "trackTargets")).toEqual(
      additional,
    );
  });
});

describe("parseAbilities / creatureAbilities (private)", () => {
  it("routes to creatureSelfAbility when the ability has no targets", () => {
    const statements: Statements = [];
    service.parseAbilities(statements, fakeCreature(), options(), [
      fakeAbility(),
    ]);
    expect(statements).toHaveLength(1);
  });

  it("routes to creatureTargetsAbility (one statement per target list entry) when targets are set", () => {
    const statements: Statements = [];
    service.parseAbilities(statements, fakeCreature(), options(), [
      fakeAbility({ targets: [{ name: "Players" }] }),
    ]);
    expect(statements).toHaveLength(6);
  });

  it("creatureAbilities delegates to behavior.abilities", () => {
    const statements: Statements = [];
    service.creatureAbilities(
      statements,
      fakeCreature({ behavior: { abilities: [fakeAbility()] } as any }),
      options(),
    );
    expect(statements).toHaveLength(1);
  });
});

describe("execute (private, custom-code dispatch)", () => {
  it("calls the default function when there is no matching custom code", () => {
    const statements: Statements = [];
    let called = false;
    service.execute(
      function () {
        called = true;
      },
      "rest",
      statements,
      fakeCreature(),
      options(),
    );
    expect(called).toBe(true);
  });

  it("suppresses the default function for a 'replace' custom code, applying its abilities but not its statements", () => {
    const statements: Statements = [];
    let called = false;
    const creature = fakeCreature({
      behavior: {
        customCodes: [
          {
            location: "rest",
            type: "replace",
            statements: [{ triggers: [], responses: [], comment: "custom" }],
            abilities: [fakeAbility()],
          },
        ],
      } as any,
    });
    service.execute(
      function () {
        called = true;
      },
      "rest",
      statements,
      creature,
      options(),
    );
    expect(called).toBe(false);
    // custom.statements are dropped for "replace" - only custom.abilities are applied.
    expect(statements.some((s) => s.comment === "custom")).toBe(false);
    expect(statements).toHaveLength(1);
  });

  it("defaults abilities to an empty array for 'replace' when omitted", () => {
    const statements: Statements = [];
    let called = false;
    const creature = fakeCreature({
      behavior: {
        customCodes: [{ location: "rest", type: "replace" }],
      } as any,
    });
    service.execute(
      function () {
        called = true;
      },
      "rest",
      statements,
      creature,
      options(),
    );
    expect(called).toBe(false);
    expect(statements).toEqual([]);
  });

  it("runs custom statements before the default function for 'insertBefore'", () => {
    const statements: Statements = [];
    const creature = fakeCreature({
      behavior: {
        customCodes: [
          {
            location: "rest",
            type: "insertBefore",
            statements: [{ triggers: [], responses: [], comment: "custom" }],
            abilities: [],
          },
        ],
      } as any,
    });
    service.execute(
      function (stmts: Statements) {
        stmts.push({ triggers: [], responses: [], comment: "default" });
      },
      "rest",
      statements,
      creature,
      options(),
    );
    expect(statements.map((s) => s.comment)).toEqual(["custom", "default"]);
  });

  it("runs custom statements after the default function for 'insertAfter'", () => {
    const statements: Statements = [];
    const creature = fakeCreature({
      behavior: {
        customCodes: [
          {
            location: "rest",
            type: "insertAfter",
            statements: [{ triggers: [], responses: [], comment: "custom" }],
            abilities: [],
          },
        ],
      } as any,
    });
    service.execute(
      function (stmts: Statements) {
        stmts.push({ triggers: [], responses: [], comment: "default" });
      },
      "rest",
      statements,
      creature,
      options(),
    );
    expect(statements.map((s) => s.comment)).toEqual(["default", "custom"]);
  });

  it("defaults statements/abilities to empty arrays for 'insertBefore' when omitted", () => {
    const statements: Statements = [];
    const creature = fakeCreature({
      behavior: {
        customCodes: [{ location: "rest", type: "insertBefore" }],
      } as any,
    });
    let called = false;
    service.execute(
      function (stmts: Statements) {
        called = true;
        stmts.push({ triggers: [], responses: [], comment: "default" });
      },
      "rest",
      statements,
      creature,
      options(),
    );
    expect(called).toBe(true);
    expect(statements.map((s) => s.comment)).toEqual(["default"]);
  });

  it("defaults statements/abilities to empty arrays for 'insertAfter' when omitted", () => {
    const statements: Statements = [];
    const creature = fakeCreature({
      behavior: {
        customCodes: [{ location: "rest", type: "insertAfter" }],
      } as any,
    });
    service.execute(
      function (stmts: Statements) {
        stmts.push({ triggers: [], responses: [], comment: "default" });
      },
      "rest",
      statements,
      creature,
      options(),
    );
    expect(statements.map((s) => s.comment)).toEqual(["default"]);
  });
});

describe("processStatements (private)", () => {
  it("pushes a statement without a target as-is", () => {
    const statements: Statements = [];
    service.processStatements(statements, [
      { triggers: [], responses: [], comment: "x" },
    ]);
    expect(statements).toEqual([{ triggers: [], responses: [], comment: "x" }]);
  });

  it("expands a statement with a target into one statement per resolved target", () => {
    const statements: Statements = [];
    service.processStatements(statements, [
      { triggers: [], responses: [], target: { name: "Players", limit: 2 } },
    ]);
    expect(statements).toHaveLength(2);
  });

  it("adds an Allegiance(Myself,ENEMY) trigger when the resolved target list requires an allegiance check (no real target list currently sets this)", () => {
    const spy = vi
      .spyOn(targetService, "getTargetFromAbility")
      .mockReturnValueOnce({ targets: ["PC"], allegianceCheck: true });
    try {
      const statements: Statements = [];
      service.processStatements(statements, [
        { triggers: [], responses: [], target: { name: "Players" } },
      ]);
      expect(statements[0].triggers).toContainEqual({
        name: "Allegiance",
        params: ["Myself", "ENEMY"],
      });
    } finally {
      spy.mockRestore();
    }
  });
});

describe("buildStatements (integration)", () => {
  it("produces a non-empty statement list for a fully-default creature", () => {
    const result = statementService.buildStatements(fakeCreature(), options());
    expect(result.length).toBeGreaterThan(0);
  });

  it("suppresses the built-in rest statement and applies custom abilities (not custom statements) for a 'replace' custom code targeting 'rest'", () => {
    const creature = fakeCreature({
      behavior: {
        customCodes: [
          {
            location: "rest",
            type: "replace",
            statements: [
              { triggers: [], responses: [], comment: "custom-rest" },
            ],
            abilities: [fakeAbility({ name: "ability.unknown" })],
          },
        ],
      } as any,
    });
    const result = statementService.buildStatements(creature, options());
    expect(result.some((s) => s.comment?.startsWith("Rest"))).toBe(false);
    expect(result.some((s) => s.comment === "custom-rest")).toBe(false);
    expect(result.some((s) => s.comment === "(unknown)")).toBe(true);
  });

  it("inserts custom statements for 'insertBefore' immediately ahead of the built-in dialog statement", () => {
    const creature = fakeCreature({
      behavior: {
        dialog: ["ja#drow"],
        customCodes: [
          {
            location: "dialog",
            type: "insertBefore",
            statements: [
              { triggers: [], responses: [], comment: "custom-before-dialog" },
            ],
            abilities: [],
          },
        ],
      } as any,
    });
    const result = statementService.buildStatements(creature, options());
    const idx = result.findIndex((s) => s.comment === "custom-before-dialog");
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(result[idx + 1].comment).toBe("Initiate dialog");
  });
});
