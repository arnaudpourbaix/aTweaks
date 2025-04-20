import * as fs from "fs";
import path from "path";
import { CR, TAB } from "../model/constants";
import {
  Creature,
  CREATURE_DATA,
  CREATURE_DATA_KEYS,
  CreatureAdditionalData,
  CreatureAdjustment,
  CreatureData,
} from "../model/final/creature";
import { Effect } from "../model/final/effect";
import { EffectTypeEnum } from "../model/final/effect.type";
import {
  ItemAbilityLocationEnum,
  ItemAbilityTargetEnum,
  ItemAbilityTypeEnum,
  SpellTypeEnum,
} from "../model/final/enums";
import { ImmunityConfig } from "../model/final/immunity";
import { ProjectileTypeEnum } from "../model/final/projectile";
import { Spell } from "../model/final/spell";
import { CodeLine } from "../model/misc";
import { RawCreatureAutoGenerate } from "../model/raw/creature";
import { WEAPON_SLOTS } from "../model/raw/enum";
import { GrabConfig } from "../model/raw/grab";
import { State } from "../state";
import { AbstractWeiduService } from "./abstract-weidu.service";
import { CreatureService } from "./creature.service";
import { GrabService } from "./grab.service";
import { EffectService } from "./effect.service";

export class WeiduCreatureService extends AbstractWeiduService {
  static instance = new WeiduCreatureService();

  private creatureService = CreatureService.instance;
  private grabService = GrabService.instance;
  private effectService = EffectService.instance;

  generateWeiduScript(creature: Creature): void {
    const lines: CodeLine[] = [];
    if (creature.bafFile) this.compileScripts(lines, creature);
    this.creatureService.checkWeapons(creature);
    this.createProjectiles(lines, creature);
    this.createSpells(lines, creature);
    if (creature.attack.grab) {
      this.createGrabSpell(lines, creature, creature.attack.grab);
      this.createReleaseGrabSpell(lines, creature, creature.attack.grab);
      this.createGrabProtectionEffect(lines, creature.attack.grab);
    }
    this.createItems(lines, creature);
    this.patchCreatures(lines, creature);
    const content = lines.map((l) => `${TAB.repeat(l.tab)}${l.code}`).join(CR);
    fs.writeFileSync(
      `${path.join(State.modFolder, creature.tpaFile)}.tpa`,
      content
    );
  }

  private compileScripts(lines: CodeLine[], creature: Creature) {
    this.add(lines, `COMPILE ~%MOD_FOLDER%/${creature.bafFile}.baf~`);
    if (creature.adjustments.some((a) => !!a.summon))
      this.add(lines, `COMPILE ~%MOD_FOLDER%/${creature.bafFile}su.baf~`);
    this.add(lines, "");
  }

  private createItems(lines: CodeLine[], creature: Creature) {
    for (const item of creature.items) {
      if (item.copyFrom) {
        const immunity = State.immunities.find((i) => i.name === item.copyFrom);
        if (immunity && !immunity.itemSlot)
          throw new Error(`No file configured for immunity ${item.copyFrom}`);
        this.add(
          lines,
          `COPY_EXISTING ~${
            immunity?.itemSlot?.file ?? item.copyFrom
          }.ITM~  ~override/${item.file}.ITM~`,
          0
        );
      } else {
        this.add(lines, `CREATE ITM "${item.file}"`, 0);
        this.add(lines, `WRITE_LONG 0x64 0x72`, 1);
        if (item.type) {
          this.add(lines, `INSERT_BYTES 0x72 0x38`, 1);
          this.add(lines, `WRITE_SHORT 0x68 1`, 1);
          this.add(lines, `WRITE_SHORT 0x72 ${item.type}`, 1);
          this.add(lines, `WRITE_LONG 0x6a 0xaa`, 1);
        }
      }
      if (item.flags) {
        const flags = item.flags.reduce((sum, save) => {
          sum += 2 ** save;
          return sum;
        }, 0);
        this.add(lines, `WRITE_LONG 0x18 ${flags}`, 1);
      }
      if (item.name)
        this.add(lines, `SAY NAME1 ~${item.name}~ SAY NAME2 ~${item.name}~`, 1);
      if (item.description)
        this.add(
          lines,
          `SAY UNIDENTIFIED_DESC ~${item.description.join("\n")}~`,
          1
        );
      if (item.category)
        this.add(lines, `WRITE_SHORT 0x1c ${item.category}`, 1);
      if (item.animation)
        this.add(lines, `WRITE_ASCII 0x22 ~${item.animation}~ #2`, 1);
      if (item.proficiency)
        this.add(lines, `WRITE_BYTE 0x31 ${item.proficiency}`, 1);
      if (item.icon) this.add(lines, `WRITE_ASCII 0x3a ~${item.icon}~ #8`, 1);
      if (item.enchantment)
        this.add(lines, `WRITE_LONG 0x60 ${item.enchantment}`, 1);
      //this.add(lines, `LPF set_enchantment INT_VAR enchantment = ${item.enchantment} END`, 1);
      if (item.location)
        this.add(lines, `WRITE_SHORT 0x74 ${item.location}`, 1);
      if (item.target) this.add(lines, `WRITE_BYTE 0x7e ${item.target}`, 1);
      if (item.range) this.add(lines, `WRITE_SHORT 0x80 ${item.range}`, 1);
      if (item.speed) this.add(lines, `WRITE_SHORT 0x84 ${item.speed}`, 1);
      if (item.bonusToHit)
        this.add(lines, `WRITE_SHORT 0x86 ${item.bonusToHit}`, 1);
      if (item.diceSize) this.add(lines, `WRITE_BYTE 0x88 ${item.diceSize}`, 1);
      if (item.diceThrown)
        this.add(lines, `WRITE_BYTE 0x8a ${item.diceThrown}`, 1);
      if (item.damageBonus)
        this.add(lines, `WRITE_SHORT 0x8c ${item.damageBonus}`, 1);
      if (item.damageType)
        this.add(lines, `WRITE_SHORT 0x8e ${item.damageType}`, 1);
      if (item.projectile)
        this.add(
          lines,
          `WRITE_SHORT 0x9c (IDS_OF_SYMBOL (~projectl~ ~${item.projectile}~)) + 1`,
          1
        );
      if (item.type === ItemAbilityTypeEnum.Melee) {
        this.add(
          lines,
          `WRITE_SHORT 0x9e ${item.animationSwing?.overhand ?? "34"}`,
          1
        );
        this.add(
          lines,
          `WRITE_SHORT 0xa0 ${item.animationSwing?.backhand ?? "33"}`,
          1
        );
        this.add(
          lines,
          `WRITE_SHORT 0xa2 ${item.animationSwing?.thrust ?? "33"}`,
          1
        );
      } else if (item.type === ItemAbilityTypeEnum.Ranged) {
        this.add(lines, `WRITE_SHORT 0x38 1`, 1);
        this.add(lines, `WRITE_SHORT 0xa4 1`, 1);
      }
      if (item.abilityflags) {
        const flags = item.abilityflags.reduce((sum, save) => {
          sum += 2 ** save;
          return sum;
        }, 0);
        this.add(lines, `WRITE_LONG 0x98 ${flags}`, 1);
      }
      if (!item.copyFrom)
        this.add(lines, `COPY_EXISTING ~${item.file}.itm~ ~override~`, 0);
      for (const effect of item.effects) {
        this.addEffect(lines, 1, effect, "ITM");
      }
      if (creature.attack.grab?.weaponFile === item.file) {
        const effect = this.grabService.getGrabEffect(
          creature,
          creature.attack.grab
        );
        this.addEffect(lines, 1, effect, "ITM");
      }
      for (const name of item.immunities) {
        this.add(
          lines,
          `LPF ${this.utils.getImmunityFunctionName(name)} END`,
          1
        );
      }
      this.add(lines, "", 0);
    }
  }

  private createSpells(lines: CodeLine[], creature: Creature) {
    for (const spell of creature.spells) {
      if (spell.copyFrom) {
        this.createSpellFrom(lines, creature, spell);
      } else {
        this.createSpell(lines, creature, spell);
      }
    }
  }

  private createSpell(lines: CodeLine[], creature: Creature, spell: Spell) {
    this.add(lines, `CREATE SPL "${spell.file}"`, 0);
    this.add(lines, `WRITE_LONG 0x64 0x72`, 1);
    this.createSpellCommon(lines, creature, spell);
  }

  private createSpellFrom(lines: CodeLine[], creature: Creature, spell: Spell) {
    this.add(
      lines,
      `COPY_EXISTING ~${spell.copyFrom}.SPL~  ~override/${spell.file}.SPL~`,
      0
    );
    for (const level of spell.deleteHeaders)
      this.add(
        lines,
        `LPF DELETE_SPELL_HEADER STR_VAR min_level = ${level} END`,
        1
      );
    for (const opcode of spell.removeOpcodes)
      this.add(
        lines,
        `LPF DELETE_EFFECT INT_VAR match_opcode = ${opcode} END`,
        1
      );
    this.createSpellCommon(lines, creature, spell);
  }

  private createSpellCommon(
    lines: CodeLine[],
    creature: Creature,
    spell: Spell
  ) {
    if (spell.type) {
      this.add(lines, `INSERT_BYTES 0x72 0x28`, 1);
      this.add(lines, `WRITE_SHORT 0x68 1`, 1);
      this.add(lines, `WRITE_LONG 0x6a 0x9a`, 1);
      this.add(lines, `WRITE_SHORT 0x72 ${spell.type}`, 1);
      this.add(lines, `WRITE_SHORT 0x82 1`, 1);
    }
    if (spell.spellType)
      this.add(lines, `WRITE_SHORT 0x1c ${spell.spellType}`, 1);
    if (spell.secondaryType)
      this.add(lines, `WRITE_BYTE 0x27 ${spell.secondaryType}`, 1);
    if (spell.spellLevel)
      this.add(lines, `WRITE_LONG 0x34 ${spell.spellLevel}`, 1);
    if (spell.location)
      this.add(lines, `WRITE_SHORT 0x74 ${spell.location}`, 1);
    if (spell.target) this.add(lines, `WRITE_BYTE 0x7e ${spell.target}`, 1);
    if (spell.range) this.add(lines, `WRITE_SHORT 0x80 ${spell.range}`, 1);
    if (spell.speed) this.add(lines, `WRITE_SHORT 0x84 ${spell.speed}`, 1);
    if (spell.stringRef) {
      this.add(
        lines,
        `SAY NAME1 ${this.utils.getStringReference(
          spell.stringRef
        )} SAY NAME2 ${this.utils.getStringReference(spell.stringRef)}`,
        1
      );
    }
    if (spell.description)
      this.add(
        lines,
        `SAY UNIDENTIFIED_DESC ~${spell.description.join("\n")}~`,
        1
      );
    if (spell.projectile)
      this.add(
        lines,
        `WRITE_SHORT 0x98 (IDS_OF_SYMBOL (~projectl~ ~${spell.projectile}~)) + 1`,
        1
      );
    for (const effect of spell.effects) this.addEffect(lines, 1, effect, "SPL");
    this.add(lines, "", 0);
  }

  private createProjectiles(lines: CodeLine[], creature: Creature) {
    for (const projectile of creature.projectiles) {
      this.add(
        lines,
        `COPY_EXISTING "${projectile.copyFromFile}.pro" ~override/${projectile.file}.pro~`,
        0
      );
      this.add(lines, `READ_SHORT 0x08 type`, 1);
      if (projectile.type !== ProjectileTypeEnum.NoBAM) {
        this.add(lines, `PATCH_IF (%type% = 1) BEGIN`, 1);
        this.add(lines, `INSERT_BYTES 0x100 0x100`, 2);
        this.add(lines, `END`, 1);
      }
      if (projectile.type === ProjectileTypeEnum.AreaOfEffect) {
        this.add(lines, `PATCH_IF (%type% != 3) BEGIN`, 1);
        this.add(lines, `INSERT_BYTES 0x200 0x100`, 2);
        this.add(lines, `END`, 1);
      }
      if (projectile.type)
        this.add(lines, `WRITE_SHORT 0x08 ${projectile.type}`, 1);
      if (projectile.speed)
        this.add(lines, `WRITE_SHORT 0x0a ${projectile.speed}`, 1);
      if (projectile.behaviorFlags.length) {
        const flags = projectile.behaviorFlags.reduce((sum, save) => {
          sum += 2 ** save;
          return sum;
        }, 0);
        this.add(lines, `WRITE_LONG 0x0c ${flags}`, 1);
      }
      if (projectile.fireSound)
        this.add(lines, `WRITE_ASCII 0x10 ~${projectile.fireSound}~ #8`, 1);
      if (projectile.impactSound)
        this.add(lines, `WRITE_ASCII 0x18 ~${projectile.impactSound}~ #8`, 1);
      if (projectile.sourceAnimation)
        this.add(
          lines,
          `WRITE_ASCII 0x20 ~${projectile.sourceAnimation}~ #8`,
          1
        );
      if (projectile.particleColor)
        this.add(lines, `WRITE_SHORT 0x28 ${projectile.particleColor}`, 1);
      if (projectile.projectileWidth)
        this.add(lines, `WRITE_SHORT 0x2a ${projectile.projectileWidth}`, 1);
      if (projectile.extendedFlags.length) {
        const flags = projectile.behaviorFlags.reduce((sum, save) => {
          sum += 2 ** save;
          return sum;
        }, 0);
        this.add(lines, `WRITE_LONG 0x2c ${flags}`, 1);
      }
      if (projectile.stringRef)
        this.add(
          lines,
          `WRITE_LONG 0x30 ${this.utils.resolveStringRef(
            projectile.stringRef
          )})`,
          1
        );
      if (projectile.color) {
        this.add(lines, `WRITE_SHORT 0x3a ${projectile.color}`, 1);
      }
      if (projectile.colorSpeed)
        this.add(lines, `WRITE_SHORT 0x38 ${projectile.colorSpeed}`, 1);
      if (projectile.screenShakeAmount)
        this.add(lines, `WRITE_SHORT 0x3a ${projectile.screenShakeAmount}`, 1);
      if (projectile.idsTarget1)
        this.add(lines, `WRITE_SHORT 0x3e ${projectile.idsTarget1}`, 1);
      if (projectile.idsTarget2)
        this.add(lines, `WRITE_SHORT 0x40 ${projectile.idsTarget2}`, 1);
      if (projectile.defaultSpell)
        this.add(lines, `WRITE_ASCII 0x44 ~${projectile.defaultSpell}~ #8`, 1);
      if (projectile.successSpell)
        this.add(lines, `WRITE_ASCII 0x4c ~${projectile.successSpell}~ #8`, 1);
      if (projectile.bamProjectileFlags.length) {
        const flags = projectile.bamProjectileFlags.reduce((sum, save) => {
          sum += 2 ** save;
          return sum;
        }, 0);
        this.add(lines, `WRITE_LONG 0x100 ${flags}`, 1);
      }
      if (projectile.projectileSmokeAnimation)
        this.add(
          lines,
          `WRITE_SHORT 0x134 ${projectile.projectileSmokeAnimation}`,
          1
        );
      if (projectile.areaProjectileFlags.length) {
        const flags = projectile.areaProjectileFlags.reduce((sum, save) => {
          sum += 2 ** save;
          return sum;
        }, 0);
        this.add(lines, `WRITE_LONG 0x200 ${flags}`, 1);
      }
      if (projectile.rayCount)
        this.add(lines, `WRITE_SHORT 0x202 ${projectile.rayCount}`, 1);
      if (projectile.triggerRadius)
        this.add(lines, `WRITE_SHORT 0x204 ${projectile.triggerRadius}`, 1);
      if (projectile.areaOfEffect)
        this.add(lines, `WRITE_SHORT 0x206 ${projectile.areaOfEffect}`, 1);
      if (projectile.fragmentAnimation)
        this.add(lines, `WRITE_SHORT 0x212 ${projectile.fragmentAnimation}`, 1);
      if (projectile.explosionEffect)
        this.add(lines, `WRITE_BYTE 0x217 ${projectile.explosionEffect}`, 1);
      if (projectile.triggerCount)
        this.add(lines, `WRITE_BYTE 0x216 ${projectile.triggerCount}`, 1);
      if (projectile.coneWidth)
        this.add(lines, `WRITE_SHORT 0x224 ${projectile.coneWidth}`, 1);
      this.add(
        lines,
        `ADD_PROJECTILE ~override/${projectile.file}.pro~ ~${projectile.description}~`,
        0
      );
      this.add(lines, "", 0);
    }
  }

  private createGrabSpell(
    lines: CodeLine[],
    creature: Creature,
    grab: GrabConfig
  ) {
    this.add(lines, `CREATE SPL "${grab.file}"`, 0);
    this.add(lines, `WRITE_SHORT 0x1c ${SpellTypeEnum.Innate}`, 1);
    this.add(lines, `WRITE_LONG 0x34 1`, 1);
    this.add(lines, `WRITE_LONG 0x64 0x72`, 1);
    this.add(lines, `WRITE_SHORT 0x68 1`, 1);
    this.add(lines, `WRITE_LONG 0x6a 0x9a`, 1);
    this.add(lines, `INSERT_BYTES 0x72 0x28`, 1);
    this.add(lines, `WRITE_SHORT 0x72 ${ItemAbilityTypeEnum.Melee}`, 1);
    this.add(lines, `WRITE_SHORT 0x74 ${ItemAbilityLocationEnum.Ability}`, 1);
    this.add(lines, `WRITE_BYTE 0x7e ${ItemAbilityTargetEnum.LivingActor}`, 1);
    this.add(lines, `WRITE_SHORT 0x80 5`, 1);
    this.add(lines, `WRITE_SHORT 0x82 1`, 1);
    this.add(lines, `WRITE_SHORT 0x94 1`, 1);
    this.add(
      lines,
      `SAY NAME1 @${grab.grabStringRef} SAY NAME2 @${grab.grabStringRef}`,
      1
    );
    const effects = this.grabService.getGrabbedEffects(creature, grab);
    for (const effect of effects) this.addEffect(lines, 1, effect, "SPL");
    this.add(lines, "", 0);
  }

  private createReleaseGrabSpell(
    lines: CodeLine[],
    creature: Creature,
    grab: GrabConfig
  ) {
    this.add(lines, `CREATE SPL "${grab.file}r"`, 0);
    this.add(lines, `WRITE_SHORT 0x1c ${SpellTypeEnum.Innate}`, 1);
    this.add(lines, `WRITE_LONG 0x34 1`, 1);
    this.add(lines, `WRITE_LONG 0x64 0x72`, 1);
    this.add(lines, `WRITE_SHORT 0x68 1`, 1);
    this.add(lines, `WRITE_LONG 0x6a 0x9a`, 1);
    this.add(lines, `INSERT_BYTES 0x72 0x28`, 1);
    this.add(lines, `WRITE_SHORT 0x72 ${ItemAbilityTypeEnum.Melee}`, 1);
    this.add(lines, `WRITE_SHORT 0x74 ${ItemAbilityLocationEnum.Ability}`, 1);
    this.add(lines, `WRITE_BYTE 0x7e ${ItemAbilityTargetEnum.LivingActor}`, 1);
    this.add(lines, `WRITE_SHORT 0x80 5`, 1);
    this.add(lines, `WRITE_SHORT 0x82 1`, 1);
    this.add(lines, `WRITE_SHORT 0x94 1`, 1);
    this.add(lines, `SAY NAME1 ~Release grabbed target~`, 1);
    const effects = this.grabService.getReleaseGrabbedEffects(grab);
    for (const effect of effects) this.addEffect(lines, 1, effect, "SPL");
    this.add(lines, "", 0);
  }

  private createGrabProtectionEffect(lines: CodeLine[], grab: GrabConfig) {
    const effect = this.grabService.getGrabProtectionEffect(grab);
    this.add(lines, `CREATE EFF "${grab.file}"`, 0);
    this.add(lines, `WRITE_LONG 0x10 ${effect.opcode}`, 1);
    this.add(lines, `WRITE_LONG 0x14 ${effect.target}`, 1);
    this.add(lines, `WRITE_LONG 0x24 ${effect.timing}`, 1);
    this.add(lines, `WRITE_LONG 0x28 ${effect.duration}`, 1);
    this.add(lines, `WRITE_SHORT 0x2c ${effect.probability1}`, 1);
    this.add(lines, `WRITE_ASCII 0x30 ~${effect.resource}~ #8`, 1);
    this.add(lines, "", 0);
  }

  private addEffect(
    lines: CodeLine[],
    tab: number,
    effect: Effect,
    type: "SPL" | "ITM" | "CRE"
  ) {
    if (effect.opcode === EffectTypeEnum.RemoveSpellTypeProtections) {
      this.add(
        lines,
        `LPF GET_2DA_ENTRY_OF INT_VAR col_match = 0 STR_VAR file = ~msectype.2da~ entry_match = ~${effect.parameter2}~ RET row col END`,
        1
      );
      effect.parameter2 = "row";
      this.add(lines, `PATCH_IF row != "-1" BEGIN`, tab++);
    }
    let fn = "ADD_EFFECT";
    if (effect.global && type === "ITM") fn = "ADD_ITEM_EQEFFECT";
    else if (type === "CRE") fn = "ADD_CRE_EFFECT";
    this.add(lines, `LPF ${fn}`, tab);
    this.add(lines, `INT_VAR`, tab + 1);
    this.add(lines, `opcode = ${effect.opcode}`, tab + 2);
    if (effect.target) this.add(lines, `target = ${effect.target}`, tab + 2);
    if (effect.power) this.add(lines, `power = ${effect.power}`, tab + 2);
    if (effect.parameter1 && effect.parameter1 !== "0")
      this.add(
        lines,
        `parameter1 = ${this.getIntegerValue(effect.parameter1)}`,
        tab + 2
      );
    if (effect.parameter2 && effect.parameter2 !== "0")
      this.add(
        lines,
        `parameter2 = ${this.getIntegerValue(effect.parameter2)}`,
        tab + 2
      );
    if (effect.timing) this.add(lines, `timing = ${effect.timing}`, tab + 2);
    if (effect.dispelResistance)
      this.add(lines, `resist_dispel = ${effect.dispelResistance}`, tab + 2);
    if (effect.duration)
      this.add(lines, `duration = ${effect.duration}`, tab + 2);
    this.add(lines, `probability1 = ${effect.probability1}`, tab + 2);
    if (effect.probability2)
      this.add(lines, `probability2 = ${effect.probability2}`, tab + 2);
    if (effect.diceThrown)
      this.add(lines, `dicenumber = ${effect.diceThrown}`, tab + 2);
    if (effect.diceSize)
      this.add(lines, `dicesize = ${effect.diceSize}`, tab + 2);
    if (effect.saveTypes) {
      const savingthrow = effect.saveTypes.reduce((sum, save) => {
        sum += 2 ** save;
        return sum;
      }, 0);
      this.add(lines, `savingthrow = ${savingthrow}`, tab + 2);
    }
    if (effect.saveBonus) {
      this.add(lines, `savebonus = "${effect.saveBonus}"`, tab + 2);
    }
    if (effect.flags !== undefined) {
      const special =
        typeof effect.flags === "number"
          ? effect.flags
          : effect.flags.reduce((sum, save) => {
              sum += 2 ** save;
              return sum;
            }, 0);
      this.add(lines, `special = ${special}`, tab + 2);
    }
    if (effect.special) {
      this.add(lines, `special = ${effect.special}`, tab + 2);
    }
    if (effect.resource) {
      this.add(lines, `STR_VAR`, 2);
      this.add(lines, `resource = "${effect.resource}"`, tab + 2);
    }
    this.add(lines, `END`, tab + 1);
    if (effect.opcode === EffectTypeEnum.RemoveSpellTypeProtections) {
      this.add(lines, `END`, --tab);
    }
  }

  private patchCreatures(lines: CodeLine[], creature: Creature) {
    this.add(lines, "ACTION_FOR_EACH ~file~ IN");
    for (const file of creature.files) this.add(lines, file, 1);
    this.add(lines, "BEGIN", 0);
    this.add(lines, `ACTION_IF FILE_EXISTS_IN_GAME ~%file%.cre~ BEGIN`, 1);
    this.add(lines, `COPY_EXISTING ~%file%.cre~ ~override~`, 2);
    this.add(lines, `LPF FJ_CRE_VALIDITY END`, 3);
    this.removeKnownSpells(lines, 3, creature);
    this.removeMemorizedSpells(lines, 3, creature);
    this.removeItems(lines, 3, creature.additionalData);
    this.addItemSlots({
      lines,
      tab: 3,
      additionalData: creature.additionalData,
      creature,
    });
    this.addMemorizedSpells(lines, 3, creature.additionalData, creature.spells);
    this.add(lines, `LPF clearProficiencies END`, 3);
    for (const opcode of creature.additionalData.deleteEffectOpcodes) {
      this.add(
        lines,
        `LPF DELETE_CRE_EFFECT INT_VAR opcode_to_delete=${opcode} END`,
        3
      );
    }
    this.addProficiencies(lines, 3, creature.additionalData);
    if (creature.attack.grab) {
      this.add(
        lines,
        `ADD_MEMORIZED_SPELL ~${creature.attack.grab.file}~ #0 ~innate~ (1)`
      );
      this.add(
        lines,
        `ADD_MEMORIZED_SPELL ~${creature.attack.grab.file}r~ #0 ~innate~ (1)`
      );
    }
    for (const name of creature.additionalData.immunities) {
      const immunity = State.immunities.find(
        (i) => i.name === name
      ) as ImmunityConfig;
      if (!immunity.itemSlot) {
        this.add(
          lines,
          `LPF ${this.utils.getImmunityFunctionName(name)} END`,
          3
        );
      }
    }
    for (const effect of creature.additionalData.effects) {
      this.addEffect(lines, 3, effect, "CRE");
    }
    this.patchCreature({
      lines,
      tab: 3,
      data: creature.data,
      autoGenerate: creature.autoGenerate,
      enforce: true,
      creature,
    });
    if (creature.bafFile) {
      this.patchScripts(lines, 3, creature);
    }
    this.handleAdjustments(lines, 3, creature);
    this.add(lines, "BUT_ONLY_IF_IT_CHANGES", 2);
    this.add(lines, "END ELSE BEGIN", 1);
    this.add(lines, "PRINT ~====> CRE %file% not found!~", 2);
    this.add(lines, "END", 1);
    this.add(lines, "END", 0);
  }

  private removeKnownSpells(
    lines: CodeLine[],
    tab: number,
    creature: Creature
  ) {
    const files = [
      ...creature.adjustments.reduce((acc, adjustement) => {
        if (adjustement.additionalData?.removeKnownSpells === false) {
          for (const f of adjustement.files) acc.add(f);
        }
        return acc;
      }, new Set<string>()),
    ];
    this.executeCodeWithExcludedFiles(lines, tab, `REMOVE_KNOWN_SPELLS`, files);
  }

  private removeMemorizedSpells(
    lines: CodeLine[],
    tab: number,
    creature: Creature
  ) {
    const files = [
      ...creature.adjustments.reduce((acc, adjustement) => {
        if (adjustement.additionalData?.removeMemorizedSpells === false) {
          for (const f of adjustement.files) acc.add(f);
        }
        return acc;
      }, new Set<string>()),
    ];
    this.executeCodeWithExcludedFiles(
      lines,
      tab,
      `REMOVE_MEMORIZED_SPELLS`,
      files
    );
  }

  private removeItems(
    lines: CodeLine[],
    tab: number,
    additionalData: CreatureAdditionalData
  ) {
    for (const item of additionalData.removeItems) {
      this.add(lines, `REMOVE_CRE_ITEM ~${item}~`, tab);
    }
  }

  private addProficiencies(
    lines: CodeLine[],
    tab: number,
    additionalData: CreatureAdditionalData
  ) {
    if (!additionalData.proficiencies.length) return;
    for (const prof of additionalData.proficiencies)
      this.add(lines, `SET_BG2_PROFICIENCY ~${prof.type}~ ${prof.value}`, tab);
  }

  private addItemSlots(p: {
    lines: CodeLine[];
    tab: number;
    additionalData: CreatureAdditionalData;
    creature?: Creature;
  }) {
    let equip = false;
    for (const item of p.additionalData.itemSlots) {
      const noWeaponFiles = (p.creature ? p.creature.adjustments : []).reduce(
        (acc, a) => {
          if (a.noWeapon) acc.push(...a.files);
          return acc;
        },
        [] as string[]
      );
      const isWeapon = WEAPON_SLOTS.includes(item.slot);
      const code = `ADD_CRE_ITEM ~${item.file}~ #0 #0 #0 ~UNDROPPABLE~ ~${
        item.slot
      }~ ${isWeapon && !equip ? "EQUIP" : ""}`;
      this.addConditionalSourceRes(p.lines, code, p.tab, noWeaponFiles, true);
      if (isWeapon) equip = true;
    }
  }

  private addMemorizedSpells(
    lines: CodeLine[],
    tab: number,
    additionalData: CreatureAdditionalData,
    spells: Spell[]
  ) {
    for (const m of additionalData.memorizedSpells) {
      const spell = spells.find((s) => s.file === m.file);
      const infos = this.utils.getSpellInfos(m.file);
      let code = `ADD_MEMORIZED_SPELL ~${m.file}~ #${
        spell ? (spell.spellLevel ?? 1) - 1 : infos.level - 1
      } ~${infos.type}~ (${m.memorizedCount})`;
      if (m.memorizedCount === 0) code = `REMOVE_MEMORIZED_SPELL ~${m.file}~`;
      this.add(lines, code, tab);
    }
  }

  private patchCreature(p: {
    lines: CodeLine[];
    tab: number;
    data: CreatureData;
    autoGenerate: RawCreatureAutoGenerate;
    enforce: boolean;
    creature: Creature;
  }) {
    this.creatureService.autogenerateData({
      data: p.data,
      autoGenerate: p.autoGenerate,
      creature: p.creature,
    });
    if (p.creature.notEnforceFiles.length) {
      this.add(
        p.lines,
        `DEFINE_ARRAY notEnforceFiles BEGIN ${p.creature.notEnforceFiles.join(
          " "
        )} END`,
        p.tab
      );
    }
    this.add(p.lines, `LPF patchCreature`, p.tab);
    this.add(p.lines, `INT_VAR`, p.tab + 1);
    for (const key of CREATURE_DATA_KEYS) {
      if (p.data[key] !== undefined) {
        const value = this.extractDataValue(key, p.data);
        if (value !== undefined)
          this.add(p.lines, `${key}=${this.getIntegerValue(value)}`, p.tab + 2);
        if (key === "gender") {
          this.add(p.lines, `sex=${value}`, p.tab + 2);
        }
      }
    }
    if (p.enforce) this.add(p.lines, `enforce=1`, p.tab + 2);
    if (p.creature.attack.dualWielding)
      this.add(p.lines, `perfect2weapon=1`, p.tab + 2);
    if (p.creature.notEnforceFiles.length) {
      this.add(p.lines, "STR_VAR", p.tab + 1);
      this.add(p.lines, "notEnforceFiles", p.tab + 2);
    }
    this.add(p.lines, "END", p.tab);
  }

  private patchCreatureAdjustement(p: {
    lines: CodeLine[];
    tab: number;
    data: CreatureData;
    parent?: CreatureData;
    autoGenerate: RawCreatureAutoGenerate;
    summon: boolean;
    creature: Creature;
  }) {
    if (p.data.level1) {
      this.creatureService.autogenerateData({
        data: p.data,
        autoGenerate: p.autoGenerate,
        parent: p.parent,
        creature: p.creature,
      });
    }
    if (p.summon) {
      p.data.xpv = 0;
      p.data.gender = "SUMMONED";
    }
    for (const data of CREATURE_DATA) {
      if (p.data[data.key] !== undefined) {
        const value = this.extractDataValue(data.key, p.data);
        if (value !== undefined) {
          for (const field of data.fields) {
            this.add(
              p.lines,
              `${this.getWrite(field.size)} 0x${field.index.toString(
                16
              )} ${this.getIntegerValue(value)} // ${data.key}`,
              p.tab
            );
          }
        }
      }
    }
    if (p.data.movement !== undefined)
      throw new Error("movement is not handled in ajustment");
    if (p.data.doubleApr !== undefined)
      throw new Error("doubleApr is not handled in ajustment");
  }

  private patchScripts(lines: CodeLine[], tab: number, creature: Creature) {
    const summonFiles = [
      ...new Set(
        creature.adjustments
          .filter((a) => a.summon)
          .map((a) => a.files)
          .flat()
      ),
    ];
    const locationFiles = [
      ...new Set(
        creature.adjustments
          .filter((a) => !!a.additionalData.scriptLocation)
          .map((a) => a.files)
          .flat()
      ),
    ];
    const noScriptFiles = [
      ...new Set(
        creature.adjustments
          .filter((a) => a.noScript)
          .map((a) => a.files)
          .flat()
      ),
    ];
    const scriptName = `${this.extractScriptName(creature.bafFile as string)}`;
    const summonScriptName = `${this.extractScriptName(
      creature.bafFile as string
    )}su`;
    this.patchScript({
      lines,
      tab,
      script: scriptName,
      removeScripts: creature.additionalData.removeScripts,
      files: [],
      skipFiles: [...summonFiles, ...locationFiles, ...noScriptFiles],
    });
    if (summonFiles.length) {
      this.patchScript({
        lines,
        tab,
        script: summonScriptName,
        removeScripts: creature.additionalData.removeScripts,
        files: summonFiles,
        skipFiles: [],
      });
    }
    for (const adjustment of creature.adjustments) {
      if (adjustment.additionalData.scriptLocation) {
        this.patchScript({
          lines,
          tab,
          script: scriptName,
          slot: adjustment.additionalData.scriptLocation,
          removeScripts: adjustment.additionalData.removeScripts,
          files: adjustment.files,
          skipFiles: [],
        });
      }
    }
  }

  private patchScript(p: {
    lines: CodeLine[];
    tab: number;
    script: string;
    slot?: string;
    removeScripts: string[];
    files: string[];
    skipFiles: string[];
  }) {
    let removeScripts = "";
    let skipFiles = "";
    let files = "";
    if (p.removeScripts.length) {
      this.add(
        p.lines,
        `DEFINE_ARRAY removeScripts BEGIN ${p.removeScripts.join(" ")} END`,
        p.tab
      );
      removeScripts = " removeScripts";
    }
    if (p.skipFiles.length) {
      this.add(
        p.lines,
        `DEFINE_ARRAY skipFiles BEGIN ${p.skipFiles.join(" ")} END`,
        p.tab
      );
      skipFiles = " skipFiles";
    }
    if (p.files.length) {
      this.add(
        p.lines,
        `DEFINE_ARRAY files BEGIN ${p.files.join(" ")} END`,
        p.tab
      );
      files = " files";
    }
    const slot = p.slot ? ` slot=${p.slot}` : "";
    this.add(
      p.lines,
      `LPF patchCreatureScript STR_VAR script=${p.script}${slot}${files}${skipFiles}${removeScripts} END`,
      p.tab
    );
  }

  private handleAdjustments(
    lines: CodeLine[],
    tab: number,
    creature: Creature
  ) {
    for (const adjustment of creature.adjustments) {
      for (const f of adjustment.files)
        if (!creature.files.includes(f))
          throw new Error(`Unknown adjustment file ${f}`);
      if (
        adjustment.data ||
        adjustment.additionalData.itemSlots.length ||
        adjustment.additionalData.memorizedSpells.length ||
        adjustment.additionalData.removeItems.length ||
        adjustment.additionalData.memorizedSpells.length ||
        adjustment.additionalData.proficiencies.length ||
        adjustment.additionalData.effects.length ||
        adjustment.summon
      ) {
        this.handleAdjustment(lines, tab, creature, adjustment);
      }
    }
  }

  private handleAdjustment(
    lines: CodeLine[],
    tab: number,
    creature: Creature,
    adjustment: CreatureAdjustment
  ) {
    this.startConditionalSourceRes(lines, tab++, adjustment.files, false);
    if (adjustment.summon) {
      adjustment.data = adjustment.data ?? {};
      adjustment.data.xpv = 0;
    }
    if (adjustment.data?.kit === "BARBARIAN" || adjustment.data?.movement) {
      this.deleteEffect(lines, tab, EffectTypeEnum.MovementRateBonus);
      this.deleteEffect(lines, tab, EffectTypeEnum.MovementRateBonus2);
      const movement =
        adjustment.data.movement ?? (creature.data.movement as number) + 2;
      const effect = this.effectService.getEffect({
        opcode: "MovementRateBonus2",
        type: "Set",
        value: movement,
      });
      this.addEffect(lines, tab, effect, "CRE");
    }
    if (adjustment.data?.kit === "BARBARIAN") {
      const effect = this.effectService.getEffect({
        opcode: "ProtectionFromBackstab",
      });
      this.addEffect(lines, tab, effect, "CRE");
    }
    if (adjustment.data)
      this.patchCreatureAdjustement({
        lines,
        tab,
        data: adjustment.data,
        parent: creature.data,
        autoGenerate: creature.autoGenerate,
        summon: !!adjustment.summon,
        creature,
      });
    if (adjustment.additionalData) {
      this.removeItems(lines, tab, adjustment.additionalData);
      this.addItemSlots({
        lines,
        tab,
        additionalData: adjustment.additionalData,
      });
      this.addMemorizedSpells(
        lines,
        tab,
        adjustment.additionalData,
        creature.spells
      );
      this.addProficiencies(lines, tab, adjustment.additionalData);
      for (const effect of adjustment.additionalData.effects) {
        this.addEffect(lines, tab, effect, "CRE");
      }
    }
    this.add(lines, "END", --tab);
  }

  private extractDataValue(key: keyof CreatureData, creature: CreatureData) {
    if (
      [
        "alignment",
        "animation",
        "modAnimation",
        "general",
        "race",
        "class",
        "kit",
        "gender",
      ].includes(key)
    ) {
      let file = key as string;
      if (key === "alignment") file = "align";
      else if (["modAnimation", "animation"].includes(key)) file = "animate";
      return `IDS_OF_SYMBOL (~${file}~ ~${creature[key]}~)`;
    } else if (typeof creature[key] === "boolean")
      return creature[key] ? "1" : "0";
    return creature[key];
  }

  private extractScriptName(filename: string) {
    const start = filename.lastIndexOf("/") + 1;
    return filename.substring(start);
  }
}
