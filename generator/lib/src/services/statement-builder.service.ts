import { GLOBAL_CONFIG } from "../../config/generate";
import { KIT_ABILITIES } from "../../config/kit-ability";
import { POTIONS } from "../../config/potion";
import { StringReferenceEnum } from "../../config/stringRef";
import { TARGET_STATUS } from "../../config/target-config";
import { TargetListName, TargetStatusName } from "../../config/target-name";
import { CreatureAbility } from "../model/final/ability";
import { Creature } from "../model/final/creature";
import { RaceIdentifier } from "../model/ids/race";
import { BuilderOptions } from "../model/misc";
import { Actions } from "../model/raw/actions";
import { CustomCodeLocation, Statements } from "../model/raw/script";
import { RawTargetList } from "../model/raw/target";
import { Triggers } from "../model/raw/triggers";
import { FactoryService } from "./factory.service";
import { TargetService } from "./target.service";
import { UtilsService } from "./utils.service";

export class StatementService {
  static instance = new StatementService();

  private factory = FactoryService.instance;
  private utils = UtilsService.instance;
  private targetService = TargetService.instance;

  buildStatements(creature: Creature, options: BuilderOptions): Statements {
    const statements: Statements = [];
    this.execute(
      this.destroyUponDeath,
      "destroyUponDeath",
      statements,
      creature,
      options
    );
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
      this.handlePanic,
      "handlePanic",
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
    this.execute(
      this.listenToShouts,
      "listenToShouts",
      statements,
      creature,
      options
    );
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
      this.processStatements(statements, custom.statements);
    }
    if (!custom || custom.type !== "replace") {
      fn.apply(this, [statements, creature, options]);
    }
    if (custom && custom.type === "insertAfter") {
      this.processStatements(statements, custom.statements);
    }
  }

  private processStatements(statements: Statements, newStatements: Statements) {
    for (const statement of newStatements) {
      if (!statement.target) statements.push(statement);
      else {
        const { triggers, targetTriggers } =
          this.targetService.getTriggersFromTargetList(statement.target);
        const targets = this.targetService.getTargetFromAbility(
          statement.target.name,
          statement.target.limit
        ) as string[];
        this.factory.addStatementsFromTargetList({
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

  private handlePanic(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (this.utils.hasImmunity(creature.additionalData.immunities, "fear"))
      return;
    statements.push({
      comment: "Random walk on panic",
      triggers: [
        {
          name: "StateCheck",
          params: ["Myself", "STATE_PANIC"],
        },
      ],
      responses: this.factory.response([{ name: "RandomWalkContinuous" }]),
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
      responses: this.factory.response([{ name: "DestroySelf" }]),
    });
  }

  private init(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (options.summon) return;
    const actions: Actions.Action[] = [
      this.factory.setGlobal(GLOBAL_CONFIG.bafConstants.initGlobal, 1),
      this.factory.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
      this.factory.setGlobal(GLOBAL_CONFIG.bafConstants.allowMelee, 0),
      this.factory.setGlobal(GLOBAL_CONFIG.bafConstants.disableSpellcasting, 0),
      this.factory.setGlobalTimer(GLOBAL_CONFIG.bafConstants.restTimer, 2400), // EIGHT_HOURS
    ];
    for (const action of creature.initActions) {
      actions.push(action);
    }
    statements.push({
      comment: "Init",
      triggers: [this.factory.global(GLOBAL_CONFIG.bafConstants.initGlobal, 0)],
      responses: this.factory.response(actions),
    });
  }

  private rest(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (options.summon) return;
    const actions: Actions.Action[] = [
      this.factory.setGlobal(GLOBAL_CONFIG.bafConstants.initGlobal, 0),
      { name: "Rest" },
    ];
    if (creature.restHeal)
      actions.push({
        name: "ApplySpellRES",
        params: [GLOBAL_CONFIG.bafConstants.fullHealSpellResource, "Myself"],
      });
    statements.push({
      comment: "Rest (reset everything and heal if applicable)",
      triggers: [
        this.factory.global(GLOBAL_CONFIG.bafConstants.initGlobal, 1),
        this.factory.globalTimerExpired(GLOBAL_CONFIG.bafConstants.restTimer),
        {
          name: "Detect",
          params: ["GOODCUTOFF"],
          negation: true,
        },
      ],
      responses: this.factory.response(actions),
    });
  }

  private turnHostile(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (options.summon) return;
    statements.push({
      comment: "Turn hostile if attacked",
      triggers: [
        {
          name: "Allegiance",
          params: ["Myself", "ENEMY"],
          negation: true,
        },
        {
          name: "Or",
          triggers: [
            {
              name: "AttackedBy",
              params: ["GOODCUTOFF", "DEFAULT"],
            },
            {
              name: "AttackedBy",
              params: ["CONTROLLED", "DEFAULT"],
            },
            {
              name: "AttackedBy",
              params: ["CHARMED", "DEFAULT"],
            },
            {
              name: "SpellCastOnMe",
              params: ["GOODCUTOFF", 0],
            },
            {
              name: "SpellCastOnMe",
              params: ["CONTROLLED", 0],
            },
            {
              name: "SpellCastOnMe",
              params: ["CHARMED", 0],
            },
          ],
        },
      ],
      responses: this.factory.response([{ name: "Enemy" }]),
    });
    if (["BEAR"].includes(creature.data.race as RaceIdentifier)) {
      statements.push({
        comment: "Turn hostile if too close and not druid/ranger",
        triggers: [
          { name: "Range", params: ["GOODCUTOFF", 7] },
          {
            name: "See",
            params: [
              this.targetService.targetObject({
                ea: "PC",
                clazz: "DRUID",
              }),
            ],
            negation: true,
          },
          {
            name: "See",
            params: [
              this.targetService.targetObject({
                ea: "PC",
                clazz: "RANGER",
              }),
            ],
            negation: true,
          },
          {
            name: "See",
            params: [
              this.targetService.targetObject({
                ea: "PC",
                clazz: "FIGHTER_DRUID",
              }),
            ],
            negation: true,
          },
          {
            name: "See",
            params: [
              this.targetService.targetObject({
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
        responses: this.factory.response([{ name: "Enemy" }]),
      });
    }
  }

  private detectCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    const actions: Actions.Action[] = [
      this.factory.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
    ];
    if (creature.help) {
      actions.push({
        name: "Shout",
        params: [
          options.summon
            ? GLOBAL_CONFIG.bafConstants.summonerShoutId
            : GLOBAL_CONFIG.bafConstants.monsterShoutId,
        ],
      });
    }
    statements.push({
      comment: "Detect combat",
      triggers: [
        this.factory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
        { name: "See", params: ["NearestEnemyOf"] },
      ],
      responses: this.factory.response(actions),
    });
  }

  private listenToShouts(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.help) return;
    const shoutId = options.summon
      ? GLOBAL_CONFIG.bafConstants.summonerShoutId
      : GLOBAL_CONFIG.bafConstants.monsterShoutId;
    const trigger: Triggers.Trigger = options.summon
      ? { name: "Heard", params: ["LastSummonerOf", shoutId] }
      : {
          name: "Heard",
          params: [`${"EVILCUTOFF"}.0.${creature.data.race}`, shoutId],
        };
    statements.push({
      comment: "React to shouts",
      triggers: [
        this.factory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
        trigger,
      ],
      responses: this.factory.response([
        this.factory.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
      ]),
    });
  }

  private noActionOutsideOfCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    statements.push({
      comment: "Do nothing if combat is not started",
      triggers: [
        this.factory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
        { name: "ActionListEmpty" },
      ],
      responses: this.factory.response([{ name: "NoAction" }]),
    });
  }

  private followSummoner(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!options.summon) return;
    const triggers: Triggers.Trigger[] = [
      this.factory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
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
      responses: this.factory.response([
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
        name: "Range",
        params: [
          GLOBAL_CONFIG.tokens.target,
          GLOBAL_CONFIG.bafConstants.trackingRange,
        ],
      },
    ];
    const actions: Actions.Action[] = [
      { name: "MoveToObject", params: [GLOBAL_CONFIG.tokens.target] },
    ];
    this.factory.addStatementsFromTargetList({
      statements,
      comment: "Track players if allegiance is not GOODCUTOFF",
      triggers: [
        allegiance,
        ...triggers,
        ...this.factory.validTrackTarget({
          isTargetPlayer: true,
          seeInvisible: this.utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        }),
      ],
      responses: this.factory.response(actions),
      targets: this.targetService.getList("Players"),
    });
    this.factory.addStatementsFromTargetList({
      statements,
      comment: "Track last seen enemy if allegiance is GOODCUTOFF",
      triggers: [
        { ...allegiance, negation: false },
        ...triggers,
        ...this.factory.validTrackTarget({
          isTargetPlayer: false,
          seeInvisible: this.utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        }),
      ],
      responses: this.factory.response(actions),
      targets: ["LastSeenBy"],
      random: false,
    });
  }

  private randomWalkCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    this;
    this.randomWalk(statements, true, creature, options);
  }

  private randomWalkNoCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    this;
    this.randomWalk(statements, false, creature, options);
  }

  private randomWalk(
    statements: Statements,
    combat: boolean,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.walk) return;
    const triggers: Triggers.Trigger[] = [
      this.factory.global(
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
      responses: this.factory.response([
        { name: "RandomWalk" },
        { name: "Wait", params: [2] },
      ]),
    });
  }

  private attack(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
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
      const targets = this.targetService.getList(targetListName);
      const targetTriggers = [
        ...(statusDetails.targetTriggers as Triggers.Trigger[]),
        ...this.factory.validAttackTarget({
          isTargetPlayer: statusDetails.canOnlyTargetPlayer,
          seeInvisible: this.utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        }),
      ];
      const responses = this.factory.attackResponses({
        attacks: creature.attack.actions,
        oncePerRound: false,
        weaponAttackSlot,
      });
      this.factory.addOneBlockTargetList({
        statements,
        comment: `Attack ${statusDetails.status} enemy`,
        targetTriggers,
        responses,
        targets,
      });
    }
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
          this.factory.globalRoundTimerNotExpired(),
          ...(potion.triggers ?? []),
        ];
        const actions: Actions.Action[] = [
          ...(potion.actions ?? []),
          {
            name: "DisplayStringHead",
            params: ["Myself", `@${StringReferenceEnum.QuaffPotion}`],
          },
          { name: "UseItem", params: [file, "Myself"] },
          this.factory.setGlobalRoundTimer(),
        ];
        statements.push({
          comment: potion.name,
          triggers,
          responses: this.factory.response(actions),
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
          this.factory.globalRoundTimerNotExpired(),
          ...(ability.triggers ?? []),
        ];
        const actions: Actions.Action[] = [
          ...(ability.actions ?? []),
          { name: "SpellRES", params: [file, "Myself"] },
          this.factory.setGlobalRoundTimer(),
        ];
        statements.push({
          comment: ability.name,
          triggers,
          responses: this.factory.response(actions),
        });
      }
    }
  }

  private creatureAbilities(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    for (const ability of creature.abilities) {
      if (ability.target)
        this.creatureTargetAbility(
          statements,
          creature,
          ability,
          ability.target,
          options
        );
      else this.creatureSelfAbility(statements, creature, ability, options);
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
      this.targetService.getTriggersFromTargetList(target);
    triggers.unshift(...ability.triggers);
    if (ability.isTargetSpell)
      targetTriggers.push(
        ...this.factory.validSpellTarget({
          isTargetPlayer: false,
          seeInvisible: this.utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        })
      );
    else
      targetTriggers.push(
        ...this.factory.validAttackTarget({
          isTargetPlayer: false,
          seeInvisible: this.utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        })
      );
    const actions: Actions.Action[] = [...ability.actions];
    if (ability.timer) {
      triggers.unshift(this.factory.globalTimerNotExpired(ability.timer.name));
      actions.push(
        this.factory.setGlobalTimer(ability.timer.name, ability.timer.value)
      );
    } else {
      triggers.push(this.factory.globalRoundTimerNotExpired());
      actions.push(this.factory.setGlobalRoundTimer());
    }
    if (ability.range) {
      targetTriggers.unshift({
        name: "Range",
        params: [GLOBAL_CONFIG.tokens.target, ability.range],
      });
    }
    if (ability.disableInterrupt) {
      actions.unshift(this.factory.disableInterrupt());
      actions.push(this.factory.enableInterrupt());
    }
    const targets = this.targetService.getTargetFromAbility(
      target.name,
      target.limit
    ) as string[];
    this.factory.addStatementsFromTargetList({
      statements,
      comment: ability.name,
      triggers: [...triggers, ...targetTriggers],
      responses: this.factory.response(actions),
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
      triggers.unshift(this.factory.globalTimerNotExpired(ability.timer.name));
      actions.push(
        this.factory.setGlobalTimer(ability.timer.name, ability.timer.value)
      );
    } else {
      triggers.push(this.factory.globalRoundTimerNotExpired());
      actions.push(this.factory.setGlobalRoundTimer());
    }
    if (ability.disableInterrupt) {
      actions.unshift(this.factory.disableInterrupt());
      actions.push(this.factory.enableInterrupt());
    }
    statements.push({
      comment: ability.name,
      triggers,
      responses: this.factory.response(actions),
    });
  }
}
