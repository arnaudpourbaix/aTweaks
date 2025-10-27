export default {
  immunity: {
    poison: "Immune to poison",
    disease: "Immune to all diseases",
    bleeding: "Immune to bleeding",
    hold: "Immune to hold",
    stun: "Immune to stun",
    sleep: "Immune to sleep",
    fear: "Immune to fear and morale failure",
    charm: "Immune to charm",
    confusion: "Immune to confusion",
    fatigue: "Immune to fatigue",
    abilityDrain: "Immune to ability drain",
    energyDrain: "Immune to level drain",
    blindness: "Immune to blindness",
    fireSpells: "Immune to fire spells",
    fire: "Immune to fire",
    coldSpells: "Immune to cold spells",
    cold: "Immune to cold",
    lightningSpells: "Immune to lightning spells",
    lightning: "Immune to lightning",
    acidSpells: "Immune to acid spells",
    acid: "Immune to acid",
    magic: "Immune to magic",
    magicDamage: "Immune to magic damage",
    cureAndCauseWoundSpells: "Immune to healing and cause wounds spells",
    cloudSpells: "Immune to cloud spells",
    web: "Immune to web effects",
    entangle: "Immune to entangle effects",
    insectSpells: "Immune to insects spells",
    petrification: "Immune to petrification",
    gazeAttacks: "Immune to gaze attacks",
    polymorph: "Immune to polymorph spells",
    vorpal: "Immune to vorpal effects",
    physicalDamage: "Immune to physical damage",
    slashingDamage: "Immune to slashing damage",
    crushingDamage: "Immune to crushing damage",
    piercingDamage: "Immune to piercing damage",
    missileDamage: "Immune to missile damage",
    missileWeapons: "Immune to missile weapons",
    turnUndead: "Immune to turn undead",
    illusion: "Immune to illusion spells",
    necromancyEffects: "Immune to necromancy effects",
    deathEffects: "Immune to death effects",
    deathSpell: "Immune to death spell",
    mindSpells:
      "Immunity to mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects)",
    normalWeapons: "Immune to normal weapons",
    backstab: "Immune to backstab",
    criticalHit: "Immune to critical hits",
    devourBrain: "Immune to devour brain ability",
    magicMissile: "Immune to magic missiles spell",
    earthquakeSpells: "Immune to earthquake spell",
    fireballSpell: "Immune to fireball spell",
    lightningBoltSpell: "Immune to lightning bolt spell",
    flameArrowSpell: "Immune to flame arrow spell",
  },
  traits: {
    hover: {
      name: "Hover (flight)",
      desc: `This effectively prevents ground-based spells such as Earthquake, Entangle, Grease and Web from affecting the creature.
Furthermore, creatures with this ability can cross lava and acid pools without taking damage by hovering above them.`,
    },
    construct: {
      name: "Construct",
      desc: `Immunity to poison, sleep effects, paralysis, stunning, disease, death effects, necromancy effects, mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects).
Not subject to critical hits, backstab, nonlethal damage, ability damage, ability drain, fatigue, exhaustion, energy drain, flesh to Stone, insect Plague and similar spells.
Darkvision out to 60 feet.`,
    },
    undead: {
      name: "Undead",
      desc: `Immunity to poison, sleep effects, paralysis, stunning, disease, death effects, necromancy effects, mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects).
Not subject to critical hits, backstab, nonlethal damage, ability damage, ability drain, fatigue, exhaustion, energy drain, flesh to Stone, insect Plague and similar spells.
Undead with no Intelligence scores cannot heal damage on their own, though they can be healed.
Negative energy (such as an inflict wounds spell) can heal undead creatures.
Hit Die: d12
Darkvision out to 60 feet.`,
    },
    fey: {
      name: "Fey",
      desc: `Fey creatures cannot be interrupted while using their spell-like abilities, all of which have a casting time of 1.
In all other aspects, spell-like abilities function exactly like the spells which they mimic.`,
    },
    elemental: {
      name: "Elemental",
      desc: `Immunity to poison, sleep effects, paralysis, bleeding, and stunning.
Not subject to critical hits or backstab. Due to their unique physiology, elementals are not subject to the Mind Flayers' Devour Brain attack.
They are also unaffected by Flesh to Stone, Insect Plague and similar spells. Darkvision out to 60 feet.`,
    },
    airAffinity: {
      name: "Air affinity",
      desc: "Creatures with this trait receive a +1 bonus to hit and a +4 bonus to damage when fighting airborne opponents.",
    },
    earthAffinity: {
      name: "Earth affinity",
      desc: "Creatures with this trait receive a -2 penalty to hit and damage when fighting airborne and waterborne opponents. They are also unaffected by the Earthquake spell.",
    },
    skeletal: {
      name: "Skeletal",
      desc: "Skeletal undead suffer no damage from cold-based attacks. Due to their bony frames, edged and piercing weapons inflict only half damage.",
    },
    extraplanar: {
      name: "Extraplanar",
      desc: "Extraplanar creatures are immune to Death Spell and are unaffected by all Cure and Cause Wound spells including Heal and Harm.",
    },
    plant: {
      name: "Plant",
      desc: `Immunity to all mind-affecting effects (charms, compulsions, phantasms, patterns, and morale effects).
Immunity to poison, sleep effects, paralysis, polymorph, and stunning.
Not subject to critical hits and backstab.
Infravision.`,
    },
    infravision: "Infravision",
    seeInvisible: "True sight (see invisible creatures)",
    incorporeal: {
      name: "Incorporeal",
      desc: `An incorporeal creature has no physical body.
Immune to backstab and critical hits
Immune to all nonmagical attacks.
Has a 50% resistance to every damages.
Deflection bonus (+3 AC).
Attacks pass through armor (+4 THAC0).`,
      // "Do not set off traps that are triggered by weight. (not implemented)",
    },
    blindsight: {
      name: "blindsight",
      desc: `Invisibility, darkness, and most kinds of concealment are irrelevant.
Blindsight does not subject a creature to gaze attacks.`,
    },
    ooze: {
      name: "Ooze",
      desc: `Blindsight (can see invisible, not subject to gaze attacks).
Immunity to poison, sleep effects, paralysis, stunning, polymorph, blindness, mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects).
Not subject to critical hits, backstab.
Darkvision out to 60 feet.
Translucent
10-sided Hit Dice`,
    },
    vermin: {
      name: "Vermin",
      desc: `Immunity to mind-affecting spells and abilities (charms, compulsions, phantasms, patterns, and morale effects)
Darkvision out to 60 feet.`,
    },
  },
  spell: {
    outdoorCast: "This spell can only be cast outdoor",
    restrained: "Restrained",
    callWoodlandBeeings: {
      name: "Call Woodland Beeings",
      description: `Call Woodland Beings
(Conjuration, Summoning)
Level: 4
Sphere: Animal, Summoning
Range: Visual Range of Caster
Duration: 2 turns
Casting Time: 9
Area of Effect: Special
Saving Throw: None

By means of this spell, the caster is able to summon certain woodland creatures to his location. Naturally, this spell works only outdoors, but not necessarily only in wooded areas.

7th: Dryad (55%), Hamadryad (30%), 5HD Treant (15%)
10th: Hamadryad (55%), 5HD Treant (30%), 7HD Treant (15%)
13th: 7HD Treant (55%), 9HD Treant (30%), 11HD Treant (15%)

The summoned creatures aid the caster by whatever means they possess, staying until they are slain or the spell duration expires.

Dryad (2 Hit Dice):
STR 10, DEX 12, CON 11, INT 14, WIS 15, CHA 18
HP 16, AC 9, THAC0 19, 50% magic resistance
Dimension Door (at will) in wilderness area only.
Dire Charm (x3), saves vs spell at -3.

5HD Treant:
STR 19, DEX 8, CON 19, INT 12, WIS 16, CHA 12
HP 65, AC 0, THAC0 15, -25% fire resistance
2 Attacks Per Round, 2d8 crushing

7HD Treant:
STR 20, DEX 8, CON 20, INT 12, WIS 16, CHA 12
HP 91, AC 0, THAC0 13, -25% fire resistance
2 Attacks Per Round, 2d8 crushing

9HD Treant:
STR 21, DEX 8, CON 20, INT 12, WIS 16, CHA 12
HP 117, AC 0, THAC0 11, -25% fire resistance
2 Attacks Per Round, 3d6 crushing

11HD Treant:
STR 23, DEX 8, CON 21, INT 12, WIS 16, CHA 12
HP 142, AC 0, THAC0 9, -25% fire resistance
2 Attacks Per Round, 4d6 crushing`,
    },
    colorSpray: {
      name: "Color Spray",
      description: `Color Spray (Alteration)
Level: 1
Range: 30 feet
Duration: Special
Casting Time: 1
Area of Effect: 60 degree arc
Saving Throw: Special

Upon the casting of this spell, a vivid, fan-shaped spray of clashing colors spring forth in front of the caster. All creatures in the area of effect are entitled a saving throw vs. spell to avoid the effects, if they are above the 6th level or above the level of the caster. Blind or unseeing creatures are not affected. Creatures that are not allowed a saving throw, or that fail their saving throw, and whose level is below or equal to the level of the caster are struck unconscious for 4 rounds; those whose level is 1 or 2 greater than the level of the caster are struck blind for 2 rounds; those that are 3 or more levels above the level of the caster are disoriented and unable to think or act coherently for 1 round.`,
    },
    dimensionDoor: {
      name: "Dimension Door",
      description: `Dimension Door (Alteration)
Level: 4
Range: 900
Duration: Instant
Casting Time: 1
Area of Effect: The caster
Saving Throw: None

This spell transports the caster to any designated place that is already known to him. The caster always arrives at exactly the spot desired by simply visualizing an area that he is familiar with. When the spell is cast, a dimensional portal opens up in front of the caster, which he immediately steps through.  Upon passing through the portal, the caster finds himself at his chosen destination.`,
    },
    slimeSplit: {
      name: "Slime Split",
      puddingDesc: `Lightning bolts and blows from weapons divide them into smaller puddings, each able to attack exactly as the original pudding.
Because puddings do not use all of their mouth openings (which cover their exposed surfaces), the smallest pudding does the same damage as the largest.`,
      mustardDesc: `This large creature can divide itself at will into two smaller, faster halves (movement rate 18).
Each is capable of attacking, but has only half the hit points the creature had before dividing.`,
    },
  },
  grab: {
    grab: "Grab",
    grabbed: "Grabbed",
  },
  item: {
    drinkPotion: "*quaffs a potion*",
  },
  weapon: { paws: "Paws" },
};
