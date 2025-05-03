import { Creature } from "../model/final/creature";
import { ProjectileTypeEnum } from "../model/final/projectile";
import { CodeLine } from "../model/misc";
import { AbstractWeiduService } from "./abstract-weidu.service";

export class WeiduProjectileService extends AbstractWeiduService {
  static instance = new WeiduProjectileService();

  createProjectiles(lines: CodeLine[], creature: Creature) {
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
}
