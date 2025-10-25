import { GLOBAL_CONFIG } from "../../config/generate";
import { KIT_ABILITIES } from "../../config/kit-ability";
import { POTIONS } from "../../config/potion";
import { TraStringReferenceEnum } from "../../config/stringRef";
import { TARGET_STATUS } from "../../config/target-config";
import { TargetListName, TargetStatusName } from "../../config/target-name";
import factoryService from "../factories/factory.service";
import { CreatureAbility } from "../model/final/ability";
import { Creature } from "../model/final/creature";
import { CustomCodeLocation, Statements } from "../model/final/script";
import { AllegianceIdentifier } from "../model/ids/allegiance";
import { RaceIdentifier } from "../model/ids/race";
import { BuilderOptions } from "../model/misc";
import { Actions } from "../model/raw/actions";
import { RawTargetList } from "../model/raw/target";
import { Triggers } from "../model/raw/triggers";
import targetService from "./target.service";
import utils from "./utils.service";

class StatementService {
  buildStatements(creature: Creature, options: BuilderOptions): Statements {
    const statements: Statements = [];
    this.execute(
      this.destroyUponDeath,
      "destroyUponDeath",
      statements,
      creature,
      options
    );
    this.execute(this.dialog, "dialog", statements, creature, options);
    this.execute(this.init, "init", statements, creature, options);
    this.execute(this.rest, "rest", statements, creature, options);
    this.execute(
      this.turnHostile,
      "turnHostile",
      statements,
      creature,
      options
    );
    this.execute(
      this.detectCombat,
      "detectCombat",
      statements,
      creature,
      options
    );
    this.execute(this.shouts, "shouts", statements, creature, options);
    this.execute(
      this.followSummoner,
      "followSummoner",
      statements,
      creature,
      options
    );
    this.execute(
      this.randomWalkNoCombat,
      "randomWalkNoCombat",
      statements,
      creature,
      options
    );
    this.execute(
      this.noActionOutsideOfCombat,
      "noActionOutsideOfCombat",
      statements,
      creature,
      options
    );
    this.execute(
      this.handlePanic,
      "handlePanic",
      statements,
      creature,
      options
    );
    this.execute(
      this.creatureAbilities,
      "creatureAbilities",
      statements,
      creature,
      options
    );
    this.execute(this.potions, "potions", statements, creature, options);
    this.execute(
      this.kitAbilities,
      "kitAbilities",
      statements,
      creature,
      options
    );
    this.execute(this.attack, "attack", statements, creature, options);
    this.execute(
      this.trackTargets,
      "trackTargets",
      statements,
      creature,
      options
    );
    this.execute(
      this.randomWalkCombat,
      "randomWalkCombat",
      statements,
      creature,
      options
    );
    return statements;
  }

  private execute(
    fn: (
      statements: Statements,
      creature: Creature,
      options: BuilderOptions
    ) => void,
    location: CustomCodeLocation,
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ) {
    const custom = creature.customCode.find((c) => c.location === location);
    if (custom && custom.type === "insertBefore") {
      this.processStatements(statements, custom.statements ?? []);
      this.parseAbilities(
        statements,
        creature,
        options,
        custom.abilities ?? []
      );
    }
    if (!custom || custom.type !== "replace") {
      fn.apply(this, [statements, creature, options]);
    }
    if (custom && custom.type === "insertAfter") {
      this.processStatements(statements, custom.statements ?? []);
      this.parseAbilities(
        statements,
        creature,
        options,
        custom.abilities ?? []
      );
    }
  }

  private processStatements(statements: Statements, newStatements: Statements) {
    for (const statement of newStatements) {
      if (!statement.target) statements.push(statement);
      else {
        const { triggers, targetTriggers } =
          targetService.getTriggersFromTargetList(statement.target);
        const targets = targetService.getTargetFromAbility(
          statement.target.name,
          statement.target.limit,
          statement.target.randomOrder
        ) as string[];
        factoryService.addStatementsFromTargetList({
          statements,
          comment: statement.comment,
          triggers: [...statement.triggers, ...triggers, ...targetTriggers],
          responses: statement.responses,
          targets,
          random: statement.target.random,
          reverse: statement.target.reverse,
        });
      }
    }
  }

  private dialog(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.dialog.length) return;
    const nameTriggers: Triggers.Trigger[] = [];
    for (const name of creature.dialog) {
      nameTriggers.push({
        name: "Name",
        params: [name, "Myself"],
      });
    }
    const finalNameTrigger: Triggers.Trigger =
      nameTriggers.length == 1
        ? nameTriggers[0]
        : { name: "Or", triggers: nameTriggers };
    statements.push({
      comment: "Initiate dialog",
      triggers: [
        factoryService.global(GLOBAL_CONFIG.bafConstants.dialog, 0),
        finalNameTrigger,
        { name: "NumTimesTalkedTo", params: [0] },
        { name: "See", params: ["PC"] },
      ],
      responses: factoryService.response([
        factoryService.setGlobal(GLOBAL_CONFIG.bafConstants.dialog, 1),
        { name: "FaceObject", params: ["PC"] },
        { name: "StartDialogueNoSet", params: ["PC"] },
      ]),
    });
  }

  private handlePanic(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (utils.hasImmunity(creature.additionalData.immunities, "fear")) return;
    statements.push({
      comment: "Handle Panic state",
      triggers: [
        {
          name: "StateCheck",
          params: ["Myself", "STATE_PANIC"],
        },
        {
          name: "Range",
          params: ["NearestEnemyOf", 10],
        },
      ],
      responses: factoryService.response([
        { name: "RunAwayFromNoLeaveArea", params: ["NearestEnemyOf", 15] },
      ]),
    });
    statements.push({
      triggers: [
        {
          name: "StateCheck",
          params: ["Myself", "STATE_PANIC"],
        },
      ],
      responses: factoryService.response([{ name: "RandomWalkContinuous" }]),
    });
  }

  private destroyUponDeath(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!options.summon) return;
    statements.push({
      comment: "Summons are destroyed on death",
      triggers: [{ name: "Die" }],
      responses: factoryService.response([{ name: "DestroySelf" }]),
    });
  }

  private init(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (options.summon) return;
    const actions: Actions.Action[] = [
      factoryService.setGlobal(GLOBAL_CONFIG.bafConstants.initGlobal, 1),
      factoryService.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
      // factoryService.setGlobal(GLOBAL_CONFIG.bafConstants.disableSpellcasting, 0),
      factoryService.setGlobalTimer(GLOBAL_CONFIG.bafConstants.restTimer, 2400), // EIGHT_HOURS
    ];
    statements.push({
      comment: "Init",
      triggers: [
        factoryService.global(GLOBAL_CONFIG.bafConstants.initGlobal, 0),
      ],
      responses: factoryService.response(actions),
    });
  }

  private rest(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (options.summon) return;
    const actions: Actions.Action[] = [
      factoryService.setGlobal(GLOBAL_CONFIG.bafConstants.initGlobal, 0),
      { name: "Rest" },
    ];
    if (creature.restHeal)
      actions.push({
        name: "ApplySpell",
        params: ["Myself", "RESTORE_FULL_HEALTH"],
      });
    statements.push({
      comment: "Rest (reset everything and heal if applicable)",
      triggers: [
        factoryService.global(GLOBAL_CONFIG.bafConstants.initGlobal, 1),
        factoryService.globalTimerReallyExpired(
          GLOBAL_CONFIG.bafConstants.restTimer
        ),
        {
          name: "See",
          params: ["GOODCUTOFF"],
          negation: true,
        },
      ],
      responses: factoryService.response(actions),
    });
  }

  private turnHostile(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (options.summon) return;
    const actions: Actions.Action[] = [{ name: "Enemy" }];
    statements.push({
      comment: "Turn hostile if attacked",
      triggers: [
        {
          name: "Allegiance",
          params: ["Myself", "NEUTRAL"],
        },
        {
          name: "Or",
          triggers: [
            {
              name: "AttackedBy",
              params: ["GOODCUTOFF", "DEFAULT"],
            },
            {
              name: "SpellCastOnMe",
              params: ["GOODCUTOFF", 0],
            },
            {
              name: "TookDamage",
            },
            {
              name: "Heard",
              params: [
                `${"EVILCUTOFF"}.0.${creature.data.race}`,
                GLOBAL_CONFIG.bafConstants.monsterShoutId,
              ],
            },
          ],
        },
      ],
      responses: factoryService.response(actions),
    });
    if (["BEAR"].includes(creature.data.race as RaceIdentifier)) {
      statements.push({
        comment: "Turn hostile if too close and not druid/ranger",
        triggers: [
          { name: "Range", params: ["GOODCUTOFF", 7] },
          {
            name: "See",
            params: [
              targetService.targetObject({
                ea: "PC",
                clazz: "DRUID",
              }),
            ],
            negation: true,
          },
          {
            name: "See",
            params: [
              targetService.targetObject({
                ea: "PC",
                clazz: "RANGER",
              }),
            ],
            negation: true,
          },
          {
            name: "See",
            params: [
              targetService.targetObject({
                ea: "PC",
                clazz: "FIGHTER_DRUID",
              }),
            ],
            negation: true,
          },
          {
            name: "See",
            params: [
              targetService.targetObject({
                ea: "PC",
                clazz: "CLERIC_RANGER",
              }),
            ],
            negation: true,
          },
          {
            name: "Allegiance",
            params: ["Myself", "NEUTRAL"],
          },
        ],
        responses: factoryService.response([{ name: "Enemy" }]),
      });
    }
  }

  private detectCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    const actions: Actions.Action[] = [
      factoryService.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
    ];
    const allegiances: {
      myself: AllegianceIdentifier;
      enemy: AllegianceIdentifier;
    }[] = [
      {
        myself: "EVILCUTOFF",
        enemy: "GOODCUTOFF",
      },
      {
        myself: "GOODCUTOFF",
        enemy: "EVILCUTOFF",
      },
    ];
    for (const ea of allegiances) {
      statements.push({
        comment: "Detect combat",
        triggers: [
          factoryService.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
          {
            name: "Allegiance",
            params: ["Myself", ea.myself],
          },
          { name: "See", params: [ea.enemy] },
        ],
        responses: factoryService.response(actions),
      });
    }
  }

  private shouts(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.help) return;
    const shoutId = options.summon
      ? GLOBAL_CONFIG.bafConstants.summonerShoutId
      : GLOBAL_CONFIG.bafConstants.monsterShoutId;
    statements.push({
      comment: "Shouts every 3 rounds",
      triggers: [
        factoryService.global(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
        factoryService.globalTimerExpired(GLOBAL_CONFIG.bafConstants.helpTimer),
      ],
      responses: factoryService.response([
        {
          name: "Shout",
          params: [shoutId],
        },
        factoryService.setGlobalTimer(GLOBAL_CONFIG.bafConstants.helpTimer, 18),
      ]),
    });
    const heardObject = options.summon
      ? "LastSummonerOf"
      : `${"EVILCUTOFF"}.0.${creature.data.race}`;
    statements.push({
      comment: "React to shouts",
      triggers: [
        factoryService.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
        { name: "Heard", params: [heardObject, shoutId] },
        { name: "InMyArea", params: [heardObject] },
      ],
      responses: factoryService.response([
        factoryService.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
        { name: "MoveToObject", params: ["LastHeardBy"] },
      ]),
    });
    statements.push({
      triggers: [
        factoryService.global(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
        { name: "Heard", params: [heardObject, shoutId] },
        { name: "InMyArea", params: [heardObject] },
        { name: "See", params: ["GOODCUTOFF"], negation: true },
      ],
      responses: factoryService.response([
        { name: "MoveToObject", params: ["LastHeardBy"] },
      ]),
    });
  }

  private noActionOutsideOfCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    const responses = factoryService.response([{ name: "NoAction" }]);
    statements.push({
      comment: "Do nothing if...",
      triggers: [
        {
          name: "Or",
          triggers: [
            factoryService.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
            {
              name: "Allegiance",
              params: ["Myself", "EVILCUTOFF"],
              negation: true,
            },
            { name: "StateCheck", params: ["Myself", "STATE_IMMOBILE"] },
            { name: "StateCheck", params: ["Myself", "STATE_REALLY_DEAD"] },
          ],
        },
      ],
      responses,
    });
    statements.push({
      triggers: [
        { name: "InActiveArea", params: ["Myself"], negation: true },
        { name: "Range", params: ["NearestEnemyOf", 30], negation: true },
      ],
      responses,
    });
  }

  private followSummoner(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!options.summon) return;
    const triggers: Triggers.Trigger[] = [
      factoryService.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
      {
        name: "StateCheck",
        params: ["Myself", "STATE_BLIND"],
        negation: true,
      },
      { name: "ActionListEmpty" },
      {
        name: "See",
        params: ["NearestEnemyOf"],
        negation: true,
      },
      {
        name: "See",
        params: ["LastSummonerOf"],
        negation: true,
      },
      { name: "HPGT", params: ["LastSummonerOf", 0] },
      {
        name: "Range",
        params: ["LastSummonerOf", GLOBAL_CONFIG.bafConstants.trackingRange],
      },
    ];
    statements.push({
      comment: "Summon follow summoner",
      triggers,
      responses: factoryService.response([
        { name: "MoveToObject", params: ["LastSummonerOf"] },
      ]),
    });
  }

  private trackTargets(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.tracking) return;
    const additionals = this.getAdditionals(creature, "trackTargets");
    const allegiance: Triggers.Trigger = {
      name: "Allegiance",
      params: ["Myself", "GOODCUTOFF"],
      negation: true,
    };
    const triggers: Triggers.Trigger[] = [
      {
        name: "StateCheck",
        params: ["Myself", "STATE_BLIND"],
        negation: true,
      },
      {
        name: "InMyArea",
        params: [GLOBAL_CONFIG.tokens.target],
      },
      {
        name: "Range",
        params: [
          GLOBAL_CONFIG.tokens.target,
          GLOBAL_CONFIG.bafConstants.trackingRange,
        ],
      },
      ...additionals.triggers,
    ];
    const actions: Actions.Action[] = [
      { name: "MoveToObject", params: [GLOBAL_CONFIG.tokens.target] },
      ...additionals.actions,
    ];
    factoryService.addStatementsFromTargetList({
      statements,
      comment: "Track players if allegiance is not GOODCUTOFF",
      triggers: [
        allegiance,
        ...triggers,
        ...factoryService.validTrackTarget({
          isTargetPlayer: true,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        }),
      ],
      responses: factoryService.response(actions),
      targets: targetService.getList("Players"),
    });
    factoryService.addStatementsFromTargetList({
      statements,
      comment: "Track last seen enemy if allegiance is GOODCUTOFF",
      triggers: [
        { ...allegiance, negation: false },
        ...triggers,
        ...factoryService.validTrackTarget({
          isTargetPlayer: false,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        }),
      ],
      responses: factoryService.response(actions),
      targets: ["LastSeenBy"],
      random: false,
    });
    if (!!creature.data.intelligence && creature.data.intelligence > 10) {
      statements.push({
        comment: "Open door",
        triggers: [
          factoryService.global(
            GLOBAL_CONFIG.bafConstants.noOpenDoor,
            0,
            "GLOBAL"
          ),
          { name: "Allegiance", params: ["Myself", "EVILCUTOFF"] },
          { name: "AreaType", params: ["OUTDOOR"], negation: true },
          { name: "Range", params: ["NearestEnemyOf", 30], negation: true },
          { name: "Range", params: ["NearestDoor", 15] },
          { name: "OpenState", params: ["NearestDoor", "FALSE"] },
        ],
        responses: factoryService.response([
          { name: "MoveToObject", params: ["NearestDoor"] },
          { name: "OpenDoor", params: ["NearestDoor"] },
        ]),
      });
    }
  }

  private randomWalkCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.combatWalk) return;
    this.randomWalk(statements, true, creature, options);
    this.avoidMeleeCombat(statements, creature, options);
  }

  private randomWalkNoCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.walk) return;
    this.randomWalk(statements, false, creature, options);
  }

  private randomWalk(
    statements: Statements,
    combat: boolean,
    creature: Creature,
    options: BuilderOptions
  ): void {
    const triggers: Triggers.Trigger[] = [
      factoryService.global(
        GLOBAL_CONFIG.bafConstants.combatStarted,
        combat ? 1 : 0
      ),
      { name: "ActionListEmpty" },
      {
        name: "See",
        params: ["GOODCUTOFF"],
        negation: true,
      },
    ];
    statements.push({
      comment: `Random walking (${combat ? "in combat" : "not in combat"}) `,
      triggers,
      responses: factoryService.response([
        { name: "RandomWalk" },
        { name: "Wait", params: [2] },
      ]),
    });
  }

  private avoidMeleeCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ) {
    if (creature.attack.melee || creature.attack.ranged) return;
    statements.push({
      comment: `Random facing`,
      triggers: [
        {
          name: "Range",
          params: ["NearestEnemyOf", 30],
          negation: true,
        },
      ],
      responses: factoryService.response([{ name: "RandomTurn" }]),
    });
  }

  private runAway(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    statements.push({
      comment: `Run away from enemies`,
      triggers: [
        {
          name: "Range",
          params: ["NearestEnemyOf", 20],
        },
      ],
      responses: factoryService.response([
        { name: "RunAwayFromNoLeaveArea", params: ["NearestEnemyOf", 45] },
      ]),
    });
  }

  private reposition(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    statements.push({
      comment: `Try to reposition to use ranged attack`,
      triggers: [
        { name: "CanEquipRanged" },
        {
          name: "Range",
          params: ["NearestEnemyOf", GLOBAL_CONFIG.bafConstants.meleeRange],
        },
      ],
      responses: [
        {
          weight: 50,
          actions: [
            factoryService.disableInterrupt(),
            { name: "RunAwayFromNoLeaveArea", params: ["NearestEnemyOf", 45] },
            factoryService.enableInterrupt(),
          ],
        },
        { weight: 50, actions: [{ name: "Continue" }] },
      ],
    });
  }

  private attack(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.attack.melee && !creature.attack.ranged)
      return this.runAway(statements, creature, options);
    else if (creature.attack.ranged)
      this.reposition(statements, creature, options);
    for (const targetPriority of creature.attack.targetPriorities) {
      for (const targetList of targetPriority.targets) {
        this.attackTargetWithStatuses(
          statements,
          creature,
          options,
          targetList,
          targetPriority.status
        );
      }
    }
  }

  private attackTargetWithStatuses(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions,
    targetListName: TargetListName,
    statusNameList: TargetStatusName[]
  ): void {
    for (const status of statusNameList) {
      const statusDetails = TARGET_STATUS.find((t) => t.status === status);
      const weaponAttackSlot =
        creature.attack.targetStatusWeaponSlot.find((t) =>
          t.status.includes(status)
        )?.slot ?? creature.attack.defaultWeaponSlot;
      if (!statusDetails)
        throw new Error(`Target status details ${status} not found!`);
      if (statusDetails.targetTriggers.some((t) => "triggers" in t))
        throw new Error(`OR triggers not handled currently: ${status}`);
      if (statusDetails.canOnlyTargetPlayer && targetListName !== "Players")
        throw new Error(`Status ${status} must target party`);
      const targets = targetService.getList(targetListName);
      const targetTriggers = [
        ...(statusDetails.targetTriggers as Triggers.Trigger[]),
        ...factoryService.validAttackTarget({
          isTargetPlayer: statusDetails.canOnlyTargetPlayer,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
          maxRange: creature.attack.maxRange,
        }),
      ];
      // if (creature.canPolymorph) {
      //   const poly: Triggers.Trigger = {
      //     name: "CheckStat",
      //     params: ["Myself", 0, "POLYMORPHED"],
      //   };
      // }
      const selectWeaponStatements =
        creature.attack.melee && creature.attack.ranged
          ? this.selectWeaponStatements(creature, options)
          : [];

      const responses = factoryService.attackResponses({
        attacks: creature.attack.actions,
        oncePerRound: false,
        weaponAttackSlot,
      });
      factoryService.addOneBlockTargetList({
        statements,
        comment: `Attack ${statusDetails.status} enemy`,
        targetTriggers,
        responses,
        targets,
        inBetweenStatements: selectWeaponStatements,
      });
    }
  }

  private selectWeaponStatements(
    creature: Creature,
    options: BuilderOptions
  ): Statements {
    const statements: Statements = [];
    statements.push({
      triggers: [
        { name: "CanEquipRanged" },
        {
          name: "Range",
          params: ["LastSeenBy", GLOBAL_CONFIG.bafConstants.meleeRange],
          negation: true,
        },
      ],
      responses: factoryService.response([
        { name: "EquipRanged" },
        { name: "Continue" },
      ]),
    });
    statements.push({
      triggers: [
        {
          name: "Range",
          params: ["LastSeenBy", GLOBAL_CONFIG.bafConstants.meleeRange],
        },
      ],
      responses: factoryService.response([
        { name: "EquipMostDamagingMelee" },
        { name: "Continue" },
      ]),
    });
    return statements;
  }

  private potions(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.usePotions) return;
    for (const potion of POTIONS) {
      for (const file of potion.files) {
        const triggers: Triggers.Trigger[] = [
          { name: "HasItem", params: [file, "Myself"] },
          factoryService.globalRoundTimerExpired(),
          ...(potion.triggers ?? []),
        ];
        const actions: Actions.Action[] = [
          ...(potion.actions ?? []),
          {
            name: "DisplayStringHead",
            params: ["Myself", `@${TraStringReferenceEnum.QuaffPotion}`],
          },
          factoryService.setGlobalRoundTimer(),
          { name: "UseItem", params: [file, "Myself"] },
        ];
        statements.push({
          comment: potion.name,
          triggers,
          responses: factoryService.response(actions),
        });
      }
    }
  }

  private kitAbilities(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.useKitAbilities) return;
    for (const ability of KIT_ABILITIES) {
      for (const file of ability.files) {
        const triggers: Triggers.Trigger[] = [
          { name: "HaveSpellRES", params: [file] },
          factoryService.globalRoundTimerExpired(),
          ...(ability.triggers ?? []),
        ];
        const actions: Actions.Action[] = [
          ...(ability.actions ?? []),
          factoryService.setGlobalRoundTimer(),
          { name: "SpellRES", params: [file, "Myself"] },
        ];
        statements.push({
          comment: ability.name,
          triggers,
          responses: factoryService.response(actions),
        });
      }
    }
  }

  private creatureAbilities(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    this.parseAbilities(statements, creature, options, creature.abilities);
  }

  private parseAbilities(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions,
    abilities: CreatureAbility[]
  ): void {
    for (const ability of abilities) {
      if (ability.target)
        this.creatureTargetsAbility(
          statements,
          creature,
          ability,
          ability.target,
          options
        );
      else this.creatureSelfAbility(statements, creature, ability, options);
    }
  }

  private creatureTargetsAbility(
    statements: Statements,
    creature: Creature,
    ability: CreatureAbility,
    targets: RawTargetList[],
    options: BuilderOptions
  ): void {
    for (const [index, target] of targets.entries()) {
      this.creatureTargetAbility(
        statements,
        creature,
        ability,
        target,
        options
      );
    }
  }

  private creatureTargetAbility(
    statements: Statements,
    creature: Creature,
    ability: CreatureAbility,
    target: RawTargetList,
    options: BuilderOptions
  ): void {
    const { triggers, targetTriggers } =
      targetService.getTriggersFromTargetList(target);
    triggers.unshift(...ability.triggers);
    if (ability.isSpell) {
      targetTriggers.push(
        ...factoryService.validSpellTarget({
          isTargetPlayer: false,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        })
      );
    } else {
      targetTriggers.push(
        ...factoryService.validAttackTarget({
          isTargetPlayer: false,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        })
      );
    }
    const actions: Actions.Action[] = [...ability.actions];
    if (ability.timer) {
      triggers.unshift(factoryService.globalTimerExpired(ability.timer.name));
      actions.unshift(
        factoryService.setGlobalTimer(ability.timer.name, ability.timer.value)
      );
    }
    if (!ability.noRoundTimer) {
      triggers.push(factoryService.globalRoundTimerExpired());
      actions.unshift(factoryService.setGlobalRoundTimer());
    }
    if (ability.range) {
      targetTriggers.unshift({
        name: "Range",
        params: [GLOBAL_CONFIG.tokens.target, ability.range],
      });
    }
    if (ability.minRange) {
      targetTriggers.unshift({
        name: "Range",
        params: [GLOBAL_CONFIG.tokens.target, ability.minRange],
        negation: true,
      });
    }
    if (ability.requireVocal) {
      triggers.unshift({
        name: "StateCheck",
        params: ["Myself", "STATE_SILENCED"],
        negation: true,
      });
    }
    if (!ability.canUseWhenPolymorphed && creature.canPolymorph) {
      triggers.unshift({
        name: "CheckStat",
        params: ["Myself", 0, "POLYMORPHED"],
      });
    }
    if (ability.disableInterrupt) {
      actions.unshift(factoryService.disableInterrupt());
      actions.push(factoryService.enableInterrupt());
    }
    const targets = targetService.getTargetFromAbility(
      target.name,
      target.limit,
      target.randomOrder
    ) as string[];
    factoryService.addStatementsFromTargetList({
      statements,
      comment: ability.name,
      triggers: [...triggers, ...targetTriggers],
      responses: factoryService.response(actions),
      targets,
      random: target.random,
      reverse: target.reverse,
    });
  }

  private creatureSelfAbility(
    statements: Statements,
    creature: Creature,
    ability: CreatureAbility,
    options: BuilderOptions
  ): void {
    const triggers = [...ability.triggers];
    const actions: Actions.Action[] = [...ability.actions];
    if (ability.timer) {
      triggers.unshift(factoryService.globalTimerExpired(ability.timer.name));
      actions.push(
        factoryService.setGlobalTimer(ability.timer.name, ability.timer.value)
      );
    }
    triggers.unshift(factoryService.globalRoundTimerExpired());
    actions.unshift(factoryService.setGlobalRoundTimer());
    if (ability.requireVocal) {
      triggers.unshift({
        name: "StateCheck",
        params: ["Myself", "STATE_SILENCED"],
        negation: true,
      });
    }
    if (!ability.canUseWhenPolymorphed && creature.canPolymorph) {
      triggers.unshift({
        name: "CheckStat",
        params: ["Myself", 0, "POLYMORPHED"],
      });
    }
    if (ability.disableInterrupt) {
      actions.unshift(factoryService.disableInterrupt());
      actions.push(factoryService.enableInterrupt());
    }
    statements.push({
      comment: ability.name,
      triggers,
      responses: factoryService.response(actions),
    });
  }

  private getAdditionals(
    creature: Creature,
    location: CustomCodeLocation
  ): { triggers: Triggers.Trigger[]; actions: Actions.Action[] } {
    const additionals = creature.additionalCode.find(
      (a) => a.location === location
    );
    return additionals ?? { triggers: [], actions: [] };
  }
}

const statementService = new StatementService();
export default statementService;
