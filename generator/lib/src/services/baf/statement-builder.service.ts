import { GLOBAL_CONFIG } from "../../../config/generate";
import { POTIONS } from "../../../config/potion";
import { TraStringReferenceEnum } from "../../../config/stringRef";
import { TARGET_STATUS } from "../../../config/target-config";
import { TargetListName, TargetStatusName } from "../../../config/target-name";
import actionFactory from "../../factories/action.factory";
import bafFactory from "../../factories/baf.factory";
import responseFactory from "../../factories/response.factory";
import triggerFactory from "../../factories/trigger.factory";
import { CreatureAbility } from "../../model/creature/ability";
import { Creature } from "../../model/creature/creature";
import { WEAPON_SLOTS } from "../../model/creature/item";
import { AllegianceIdentifier } from "../../model/ids/allegiance";
import { BuilderOptions } from "../../model/misc";
import { Actions } from "../../model/script/actions";
import { CustomCodeLocation, Statements } from "../../model/script/script";
import { TargetList } from "../../model/script/target";
import { Triggers } from "../../model/script/triggers";
import translationService from "../translation.service";
import utils from "../utils/utils.service";
import targetService from "./target.service";

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
      this.thievesAbilities,
      "thievesAbilities",
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
    const custom = creature.behavior.customCodes.find(
      (c) => c.location === location
    );
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
        bafFactory.addStatementsFromTargetList({
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
    if (!creature.behavior.dialog.length) return;
    const nameTriggers: Triggers.Trigger[] = [];
    for (const name of creature.behavior.dialog) {
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
        triggerFactory.global(GLOBAL_CONFIG.bafConstants.dialog, 0),
        finalNameTrigger,
        { name: "NumTimesTalkedTo", params: [0] },
        { name: "See", params: ["PC"] },
      ],
      responses: responseFactory.response([
        actionFactory.setGlobal(GLOBAL_CONFIG.bafConstants.dialog, 1),
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
      responses: responseFactory.response([
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
      responses: responseFactory.response([{ name: "RandomWalkContinuous" }]),
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
      responses: responseFactory.response([{ name: "DestroySelf" }]),
    });
  }

  private init(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (options.summon) return;
    const actions: Actions.Action[] = [
      actionFactory.setGlobal(GLOBAL_CONFIG.bafConstants.initGlobal, 1),
      actionFactory.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
      // factoryService.setGlobal(GLOBAL_CONFIG.bafConstants.disableSpellcasting, 0),
      actionFactory.setGlobalTimer(GLOBAL_CONFIG.bafConstants.restTimer, 2400), // EIGHT_HOURS
    ];
    statements.push({
      comment: "Init",
      triggers: [
        triggerFactory.global(GLOBAL_CONFIG.bafConstants.initGlobal, 0),
      ],
      responses: responseFactory.response(actions),
    });
  }

  private rest(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (options.summon) return;
    const actions: Actions.Action[] = [
      actionFactory.setGlobal(GLOBAL_CONFIG.bafConstants.initGlobal, 0),
      { name: "Rest" },
    ];
    if (creature.behavior.restHeal)
      actions.push({
        name: "ApplySpell",
        params: ["Myself", "RESTORE_FULL_HEALTH"],
      });
    statements.push({
      comment: "Rest (reset everything and heal if applicable)",
      triggers: [
        triggerFactory.global(GLOBAL_CONFIG.bafConstants.initGlobal, 1),
        triggerFactory.globalTimerReallyExpired(
          GLOBAL_CONFIG.bafConstants.restTimer
        ),
        {
          name: "See",
          params: ["GOODCUTOFF"],
          negation: true,
        },
      ],
      responses: responseFactory.response(actions),
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
      responses: responseFactory.response(actions),
    });
  }

  private detectCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    const actions: Actions.Action[] = [
      actionFactory.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
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
          triggerFactory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
          {
            name: "Allegiance",
            params: ["Myself", ea.myself],
          },
          { name: "See", params: [ea.enemy] },
        ],
        responses: responseFactory.response(actions),
      });
    }
  }

  private shouts(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.behavior.help) return;
    const shoutId = options.summon
      ? GLOBAL_CONFIG.bafConstants.summonerShoutId
      : GLOBAL_CONFIG.bafConstants.monsterShoutId;
    statements.push({
      comment: "Shouts every 3 rounds",
      triggers: [
        triggerFactory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
        triggerFactory.globalTimerExpired(GLOBAL_CONFIG.bafConstants.helpTimer),
      ],
      responses: responseFactory.response([
        {
          name: "Shout",
          params: [shoutId],
        },
        actionFactory.setGlobalTimer(GLOBAL_CONFIG.bafConstants.helpTimer, 18),
      ]),
    });
    const heardObject = options.summon
      ? "LastSummonerOf"
      : `${"EVILCUTOFF"}.0.${creature.data.race}`;
    statements.push({
      comment: "React to shouts",
      triggers: [
        triggerFactory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
        { name: "Heard", params: [heardObject, shoutId] },
        { name: "InMyArea", params: [heardObject] },
      ],
      responses: responseFactory.response([
        actionFactory.setGlobal(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
        { name: "MoveToObject", params: ["LastHeardBy"] },
      ]),
    });
    statements.push({
      triggers: [
        triggerFactory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 1),
        { name: "Heard", params: [heardObject, shoutId] },
        { name: "InMyArea", params: [heardObject] },
        { name: "See", params: ["GOODCUTOFF"], negation: true },
      ],
      responses: responseFactory.response([
        { name: "MoveToObject", params: ["LastHeardBy"] },
      ]),
    });
  }

  private noActionOutsideOfCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    const responses = responseFactory.response([{ name: "NoAction" }]);
    let triggers: Triggers.Trigger[] = [
      {
        name: "Or",
        triggers: [
          triggerFactory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
          {
            name: "Allegiance",
            params: ["Myself", "EVILCUTOFF"],
            negation: true,
          },
          { name: "StateCheck", params: ["Myself", "STATE_IMMOBILE"] },
          { name: "StateCheck", params: ["Myself", "STATE_REALLY_DEAD"] },
        ],
      },
    ];
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    statements.push({
      comment: "Do nothing if...",
      triggers,
      responses,
    });
    triggers = [
      { name: "InActiveArea", params: ["Myself"], negation: true },
      { name: "Range", params: ["NearestEnemyOf", 30], negation: true },
    ];
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    statements.push({
      triggers,
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
      triggerFactory.global(GLOBAL_CONFIG.bafConstants.combatStarted, 0),
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
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    statements.push({
      comment: "Summon follow summoner",
      triggers,
      responses: responseFactory.response([
        { name: "MoveToObject", params: ["LastSummonerOf"] },
      ]),
    });
  }

  private trackTargets(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.behavior.tracking) return;
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
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    const actions: Actions.Action[] = [
      { name: "MoveToObject", params: [GLOBAL_CONFIG.tokens.target] },
      ...additionals.actions,
    ];
    bafFactory.addStatementsFromTargetList({
      statements,
      comment: "Track players if allegiance is not GOODCUTOFF",
      triggers: [
        allegiance,
        ...triggers,
        ...triggerFactory.validTrackTarget({
          isTargetPlayer: true,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        }),
      ],
      responses: responseFactory.response(actions),
      targets: targetService.getList("Players"),
    });
    bafFactory.addStatementsFromTargetList({
      statements,
      comment: "Track last seen enemy if allegiance is GOODCUTOFF",
      triggers: [
        { ...allegiance, negation: false },
        ...triggers,
        ...triggerFactory.validTrackTarget({
          isTargetPlayer: false,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        }),
      ],
      responses: responseFactory.response(actions),
      targets: ["LastSeenBy"],
      random: false,
    });
    if (!!creature.data.intelligence && creature.data.intelligence > 10) {
      statements.push({
        comment: "Open door",
        triggers: [
          triggerFactory.global(
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
        responses: responseFactory.response([
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
    if (!creature.behavior.combatWalk || options.summon) return;
    this.randomWalk(statements, true, options);
    this.avoidMeleeCombat(statements, creature, options);
  }

  private randomWalkNoCombat(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.behavior.walk || options.summon) return;
    this.randomWalk(statements, false, options);
  }

  private randomWalk(
    statements: Statements,
    combat: boolean,
    options: BuilderOptions
  ): void {
    const triggers: Triggers.Trigger[] = [
      triggerFactory.global(
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
      responses: responseFactory.response([
        { name: "RandomWalk" },
        { name: "Wait", params: [2] },
      ]),
    });
  }

  private thievesAbilities(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.data.hideShadow) return;
    const hideTimer = "BD_HIDE";
    statements.push({
      comment: `Hide in shadow`,
      triggers: [
        {
          name: "Allegiance",
          params: ["Myself", "NEUTRAL"],
          negation: true,
        },
        {
          name: "Or",
          triggers: [
            { name: "Detect", params: ["NearestEnemyOf"], negation: true },
            { name: "Kit", params: ["Myself", "SHADOWDANCER"] },
          ],
        },
        {
          name: "StateCheck",
          params: ["Myself", "STATE_INVISIBLE"],
          negation: true,
        },
        {
          name: "StateCheck",
          params: ["Myself", "STATE_BLIND"],
          negation: true,
        },
        { name: "CheckStatGT", params: ["Myself", 49, "HIDEINSHADOWS"] },
        triggerFactory.globalTimerExpired(hideTimer),
      ],
      responses: responseFactory.response(
        actionFactory.disableInterrupt([
          actionFactory.setGlobalTimer(hideTimer, 6),
          { name: "DisplayStringHead", params: ["Myself", 66968] }, // *attempts to hide in shadows*
          { name: "Hide" },
        ])
      ),
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
      responses: responseFactory.response([{ name: "RandomTurn" }]),
    });
  }

  private runAway(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    const triggers: Triggers.Trigger[] = [
      {
        name: "Range",
        params: ["NearestEnemyOf", 20],
      },
    ];
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    statements.push({
      comment: `Run away from enemies`,
      triggers,
      responses: responseFactory.response([
        { name: "RunAwayFromNoLeaveArea", params: ["NearestEnemyOf", 45] },
      ]),
    });
  }

  private reposition(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    const triggers: Triggers.Trigger[] = [
      { name: "CanEquipRanged" },
      {
        name: "Range",
        params: ["NearestEnemyOf", GLOBAL_CONFIG.bafConstants.meleeRange],
      },
    ];
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    statements.push({
      comment: `Try to reposition to use ranged attack`,
      triggers,
      responses: [
        {
          weight: 50,
          actions: [
            actionFactory.disableInterrupt(),
            { name: "RunAwayFromNoLeaveArea", params: ["NearestEnemyOf", 45] },
            actionFactory.enableInterrupt(),
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
        ...triggerFactory.validAttackTarget({
          isTargetPlayer: statusDetails.canOnlyTargetPlayer,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
          maxRange: creature.attack.maxRange,
        }),
      ];
      const triggers: Triggers.Trigger[] = [];
      if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
      // if (creature.canPolymorph) {
      //   const poly: Triggers.Trigger = {
      //     name: "CheckStat",
      //     params: ["Myself", 0, "POLYMORPHED"],
      //   };
      // }
      let selectWeaponStatements: Statements = [];
      if (creature.attack.selectWeapons) {
        selectWeaponStatements = this.selectWeaponStatements(
          creature,
          targetTriggers,
          options
        );
      } else if (creature.attack.melee && creature.attack.ranged) {
        selectWeaponStatements = this.selectWeaponMeleeRangeStatements(
          creature,
          options
        );
      }
      const responses = responseFactory.attackResponses({
        attacks: creature.attack.actions,
        oncePerRound: false,
        weaponAttackSlot,
      });
      bafFactory.addOneBlockTargetList({
        statements,
        comment: `Attack ${statusDetails.status} enemy`,
        triggers,
        targetTriggers,
        responses,
        targets,
        inBetweenStatements: selectWeaponStatements,
      });
    }
  }

  private selectWeaponMeleeRangeStatements(
    creature: Creature,
    options: BuilderOptions
  ): Statements {
    const statements: Statements = [];
    let triggers: Triggers.Trigger[] = [
      { name: "CanEquipRanged" },
      {
        name: "Range",
        params: ["LastSeenBy", GLOBAL_CONFIG.bafConstants.meleeRange],
        negation: true,
      },
    ];
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    statements.push({
      triggers,
      responses: responseFactory.response([
        { name: "EquipRanged" },
        { name: "Continue" },
      ]),
    });
    triggers = [
      {
        name: "Range",
        params: ["LastSeenBy", GLOBAL_CONFIG.bafConstants.meleeRange],
      },
    ];
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    statements.push({
      triggers,
      responses: responseFactory.response([
        { name: "EquipMostDamagingMelee" },
        { name: "Continue" },
      ]),
    });
    return statements;
  }

  private selectWeaponStatements(
    creature: Creature,
    targetTriggers: Triggers.Trigger[],
    options: BuilderOptions
  ): Statements {
    const statements: Statements = [];
    for (const select of creature.attack.selectWeapons) {
      let triggers: Triggers.Trigger[] = [
        ...utils.replaceTriggerTokens(targetTriggers, [
          { key: GLOBAL_CONFIG.tokens.target, value: "lastSeenBy" },
        ]),
        ...select.triggers,
      ];
      if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
      const slot = WEAPON_SLOTS.find((w) => w.slot === select.slot)!;
      statements.push({
        triggers,
        responses: responseFactory.response([
          { name: "SelectWeaponAbility", params: [slot.id, 0] },
          { name: "Continue" },
        ]),
      });
    }
    return statements;
  }

  private potions(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    if (!creature.behavior.usePotions) return;
    for (const potion of POTIONS) {
      for (const file of potion.files) {
        const triggers: Triggers.Trigger[] = [
          { name: "HasItem", params: [file, "Myself"] },
          triggerFactory.globalRoundTimerExpired(),
          ...(potion.triggers ?? []),
        ];
        if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
        const actions: Actions.Action[] = [
          ...(potion.actions ?? []),
          {
            name: "DisplayStringHead",
            params: ["Myself", `@${TraStringReferenceEnum.QuaffPotion}`],
          },
          actionFactory.setGlobalRoundTimer(),
          { name: "UseItem", params: [file, "Myself"] },
        ];
        statements.push({
          comment: potion.name,
          triggers,
          responses: responseFactory.response(actions),
        });
      }
    }
  }

  private creatureAbilities(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions
  ): void {
    this.parseAbilities(
      statements,
      creature,
      options,
      creature.behavior.abilities
    );
  }

  private parseAbilities(
    statements: Statements,
    creature: Creature,
    options: BuilderOptions,
    abilities: CreatureAbility[]
  ): void {
    for (const ability of abilities) {
      if (ability.targets.length)
        this.creatureTargetsAbility(
          statements,
          creature,
          ability,
          ability.targets,
          options
        );
      else this.creatureSelfAbility(statements, creature, ability, options);
    }
  }

  private creatureTargetsAbility(
    statements: Statements,
    creature: Creature,
    ability: CreatureAbility,
    targets: TargetList[],
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
    target: TargetList,
    options: BuilderOptions
  ): void {
    const { triggers, targetTriggers } =
      targetService.getTriggersFromTargetList(target);
    triggers.unshift(...ability.triggers);
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    if (ability.isSpell) {
      targetTriggers.push(
        ...triggerFactory.validSpellTarget({
          isTargetPlayer: false,
          seeInvisible: utils.hasImmunity(
            creature.additionalData.immunities,
            "seeInvisible"
          ),
        })
      );
    } else {
      targetTriggers.push(
        ...triggerFactory.validAttackTarget({
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
      triggers.unshift(triggerFactory.globalTimerExpired(ability.timer.name));
      actions.unshift(
        actionFactory.setGlobalTimer(ability.timer.name, ability.timer.value)
      );
    }
    if (!ability.noRoundTimer) {
      triggers.push(triggerFactory.globalRoundTimerExpired());
      actions.unshift(actionFactory.setGlobalRoundTimer());
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
    if (!ability.canUseWhenPolymorphed && creature.behavior.canPolymorph) {
      triggers.unshift({
        name: "CheckStat",
        params: ["Myself", 0, "POLYMORPHED"],
      });
    }
    if (ability.disableInterrupt) {
      actions.unshift(actionFactory.disableInterrupt());
      actions.push(actionFactory.enableInterrupt());
    }
    const targets = targetService.getTargetFromAbility(
      target.name,
      target.limit,
      target.randomOrder
    ) as string[];
    bafFactory.addStatementsFromTargetList({
      statements,
      comment: translationService.from(ability.name),
      triggers: [...triggers, ...targetTriggers],
      responses: responseFactory.response(actions),
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
    if (options.summon) triggers.unshift({ name: "ActionListEmpty" });
    const actions: Actions.Action[] = [...ability.actions];
    if (ability.timer) {
      triggers.unshift(triggerFactory.globalTimerExpired(ability.timer.name));
      actions.push(
        actionFactory.setGlobalTimer(ability.timer.name, ability.timer.value)
      );
    }
    if (!ability.noRoundTimer) {
      triggers.unshift(triggerFactory.globalRoundTimerExpired());
      actions.unshift(actionFactory.setGlobalRoundTimer());
    }
    if (ability.requireVocal) {
      triggers.unshift({
        name: "StateCheck",
        params: ["Myself", "STATE_SILENCED"],
        negation: true,
      });
    }
    if (!ability.canUseWhenPolymorphed && creature.behavior.canPolymorph) {
      triggers.unshift({
        name: "CheckStat",
        params: ["Myself", 0, "POLYMORPHED"],
      });
    }
    if (ability.disableInterrupt) {
      actions.unshift(actionFactory.disableInterrupt());
      actions.push(actionFactory.enableInterrupt());
    }
    statements.push({
      comment: translationService.from(ability.name),
      triggers,
      responses: responseFactory.response(actions),
    });
  }

  private getAdditionals(
    creature: Creature,
    location: CustomCodeLocation
  ): { triggers: Triggers.Trigger[]; actions: Actions.Action[] } {
    const additionals = creature.behavior.additionalCodes.find(
      (a) => a.location === location
    );
    return additionals ?? { triggers: [], actions: [] };
  }
}

const statementService = new StatementService();
export default statementService;
