import { describe } from "node:test";
import description from "./description";

export default {
  ankheg: {
    name: "Ankheg",
    weapon: "Mandibles",
    digestiveEnzyme: {
      name: "Digestive Enzymes",
      description:
        "The ankheg can secret acidic digestive enzymes to cause an additional 1d4 points of damage per round for 4 rounds.",
    },
    enzymeStream: {
      name: "Stream of acidic enzymes",
      description: `The ankheg can squirt a stream of acidic enzymes once every six hours to a distance of 30 feet.
A victim struck by the stream of acidic enzymes suffers 8d4 points of damage (half damage if the victim rolls a successful saving throw vs. poison).
It uses this attack technique only when desperate.`,
      description5e: `Any creature, that can see and within 30 feet of the basilisk, must save vs petrify at -4.
On a failed save, the creature magically begins to turn to stone and is restrained.
It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic.`,
    },
  },
  basilisk: {
    lesser: "Lesser Basilisk",
    greater: "Greater Basilisk",
    weapon: { claws: "Claws", jaws: "Jaws" },
    petrifyingGaze: {
      name: "Petrifying Gaze",
      description: `Any creature, that can see and within 30 feet of the basilisk, must save vs petrify at -4. On a failed save, the creature is petrified until freed by the greater restoration spell or other magic.`,
      description5e: `Any creature, that can see and within 30 feet of the basilisk, must save vs petrify at -4. On a failed save, the creature magically begins to turn to stone and is restrained.
It must repeat the saving throw on the next round. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic.`,
      petrified: "Petrified",
      turningToStone: "Turning to stone",
    },
    foulBreath: {
      name: "Foul Breath",
      description: `All creatures within 5 feet must roll successful saving throws vs. poison (with a +2 bonus) or die (check each round of exposure).`,
    },
  },
  carrionCrawler: {
    name: "Carrion Crawler",
    weapon: "Tentacles",
  },
  bear: {
    name: {
      black: "Black Bear",
      brown: "Brown Bear",
      cave: "Cave Bear",
      polar: "Polar Bear",
    },
    weapon: { claws: "Paws", jaws: "Jaws" },
    hug: { name: "Hug" },
    improvedStreamOfFrost: {
      name: "Improved stream of frost",
      description:
        "Unleash a stream of frost, causing 6d4 points of damage to everything within 10 feet. A save vs. breath weapon is allowed for half damage. Affected creatures are also paralyzed for one turn (saves vs paralyze at -2)",
    },
  },
  cat: {
    name: {
      jaguar: "Jaguar",
      leopard: "Leopard",
      lion: "Lion",
      mountainLion: "Mountain Lion",
      wildTiger: "Wild Tiger",
      hellcat: "Hellcat",
      displacerBeast: "Displacer Beast",
    },
    weapon: { claws: "Paws", jaws: "Jaws", tentacles: "Tentacles" },
    rearClawsAttack: { name: "Rear claws attack" },
  },
  construct: {
    name: {
      helmedHorror: "Helmed Horror",
      battleHorror: "Battle Horror",
      doomSayer: "Doom Sayer",
      doomGuard: "Doom Guard",
    },
    weapon: { flamingSword: "Flaming Greatsword", longSword: "Long Sword" },
    item: { plateMail: "Plate Mail", helmet: "Helmet" },
  },
  dog: {
    name: {
      wild: "Wild Dog",
      war: "War Dog",
      blink: "Blink Dog",
      spectralHound: "Spectral Hound",
    },
    weapon: { jaws: "Jaws" },
    ability: {
      blink: "Blink",
      astralPlaneShift: "Astral Plane Shift",
    },
  },
  fey: {
    name: {
      dryad: "Dryad",
      hamadryad: "Hamadryad",
      sirine: "Sirine",
      nymph: "Nymph",
    },
    weapon: { sirineTouch: "Sirine Touch" },
    ability: {
      dryadDireCharm: "Dryad Dire Charm",
      entangle: {
        name: "Entangle",
        description: `Hamadryad can cast Entangle as the priest spell, but it won't affect its allies since her affinity with nature.`,
      },
      speakWithPlants: {
        name: "Speak With Plants",
        description: `Immunity to entangle spell for 10 rounds.
The caster can question plants as to whether or not creatures have passed through them, cause thickets to part to enable easy passage, require vines to entangle pursuers, and command similar services.`,
      },
      animalFriendship: {
        name: "Animal Friendship",
        description: `The caster can use this spell to attract up to 2 Hit Dice of animal(s) per experience level he possesses (save vs spell to negate).`,
      },
      detectTraps: {
        name: "Detect snares and pits",
        description: `When cast, all traps concealed -normally or magically- of magical or mechanical nature become apparent for 16 rounds.`,
      },
      blindingBeauty: {
        name: "Blinding Beauty",
        description: `Looking at a nymph will cause permanent blindness unless the onlookers save versus spell.
If the nymph is nude or disrobes, an onlooker will die unless a saving throw versus spell is successful.`,
      },
      charmSong: {
        name: "Charm Song",
        description: `The charm ability is used through the sirine's song, and all people within 30 feet are subject to it, even if they are hostile or attacking.
Each victim can save vs spell to negate or be charmed for 3 turns.`,
      },
      fogCloud: {
        name: "Fog Cloud",
        description: `As a fog bank, this spell creates a fog of any size and shape up to a maximum 20-foot cube per caster level. The fog obscures all sight, normal and infravision, beyond 2 feet.
Victims are blinded for one round, no save.`,
      },
      touchOfTranquility: {
        name: "Touch of Tranquility",
        description: `If the sirine touches an opponent, the victim must make a saving throw vs. poison; those failing to save are reduced to an Intelligence of 2.`,
      },
    },
  },
  golem: {
    name: {
      flesh: "Flesh Golem",
      clay: "Clay Golem",
      stone: "Stone Golem",
      iron: "Iron Golem",
      bone: "Bone Golem",
      juggernaut: "Juggernaut Golem",
      snow: "Snow Golem",
    },
    weapon: { fists: "Fists" },
    ability: {
      haste: "Haste",
      hideousLaugh: "Hideous Laugh",
      charge: {
        name: "Charge",
        description: `Gradually increases movement for 4 rounds. Peak speed is reached after 2 rounds.`,
        end: "End charge",
      },
      cloudOfPoisonousGas: {
        name: "Cloud Of Poisonous Gas",
        description: `The gas cloud fills a 10-foot cube directly in front of it, which dissipates by the following round, assuming there is somewhere for the gas to go.`,
      },
      coneOfCold: `Cone of Cold
Casting Time: 1
Saving Throw: Breath half
When this spell is cast, it causes a cone-shaped spray of extreme cold to spring forth.
The cone is 30 feet long and spread out in a horizontal arc of 60 degrees in front of the caster.
It drains heat and causes 10d4+10 cold damage, with a save vs. breath at -4 allowed for half damage.`,
    },
  },
  ogre: {
    name: {
      ogre: "Ogre",
      ogreBerserker: "Ogre Berserker",
      ogreMage: "Ogre Mage",
      halfOgre: "Half Ogre",
      ogreShaman: "Ogre Shaman",
      ogrillon: "Ogrillon",
    },
    weapon: {
      fists: "Fists",
      naginata: {
        name: "Naginata",
        description: `Similar to the glaive, the naginata is a pole weapon. Naginata were originally used by the samurai class.
STATISTICS:
Damage: 1D12
Damage type: slashing
Weight: 15
Speed Factor: 8
Proficiency Type: Halberds`,
      },
    },
    ability: {
      coneOfCold: `Cone of Cold
Casting Time: 1
Saving Throw: Breath half
When this spell is cast, it causes a cone-shaped spray of extreme cold to spring forth.
The cone is 60 feet long with a terminal diameter of 20 feet.
It drains heat and causes 8d8 cold damage, with a save vs. breath at -4 allowed for half damage.`,
    },
    fly: {
      name: "Fly",
      description: `The creature affected is able to move vertically and horizontally at a rate of 18.
This effectively prevents ground-based spells such as Earthquake, Entangle, Grease and Web from affecting the creature.
Furthermore, creatures with this ability can cross lava and acid pools without taking damage by hovering above them.`,
    },
    gaseousForm: {
      name: "Gaseous form",
      description: `The gaseous form cannot be physically harmed except by magical fires or lightning, in which case damage is normal, but the gaseous creature may be affected by mind-related attacks such as charm, hold or suggestion spells.`,
    },
  },
  spider: {
    webTangle: {
      name: "Web Tangle",
      standardDesc: `The spider can shoot web strands up to 5 feet to bind a foe.
Characters in contact with the webs must make a saving throw vs. paralyzation or be immobilized by the web for 3 rounds.`,
      wraithDesc: `These creatures create webs that glow with an eerie dim green light. Anyope touching a web will sustain 1d4 points of damage from the numbing cold of the strands.
Characters in contact with the webs must also make a saving throw vs. paralyzation or be immobilized by the web for 4 rounds, sustaining cold damage for each round in the web.`,
    },
  },
};
