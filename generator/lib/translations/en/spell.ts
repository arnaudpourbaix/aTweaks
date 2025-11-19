export default {
  outdoorCast: "This spell can only be cast outdoor",
  restrained: "Restrained",
  grab: {
    grab: "Grab",
    grabbed: "Grabbed",
    description: `Grab and hold your target for {{duration}} rounds.
Grabbed creature will suffer these effects:
- can not move
- loose armor class from dexterity bonus
- -4 AC (opponents get +4 bonus on their attack rolls against grabbed target)
- -4 THAC0`,
  },
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

Upon the casting of this spell, a vivid, fan-shaped spray of clashing colors spring forth in front of the caster.
All creatures in the area of effect are entitled a saving throw vs. spell to avoid the effects, if they are above the 6th level or above the level of the caster.
Blind or unseeing creatures are not affected.
Creatures that are not allowed a saving throw, or that fail their saving throw, and whose level is below or equal to the level of the caster are struck unconscious for 4 rounds;
those whose level is 1 or 2 greater than the level of the caster are struck blind for 2 rounds;
those that are 3 or more levels above the level of the caster are disoriented and unable to think or act coherently for 1 round.`,
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

This spell transports the caster to any designated place that is already known to him.
The caster always arrives at exactly the spot desired by simply visualizing an area that he is familiar with.
When the spell is cast, a dimensional portal opens up in front of the caster, which he immediately steps through.
Upon passing through the portal, the caster finds himself at his chosen destination.`,
  },
  slimeSplit: {
    name: "Slime Split",
    puddingDesc: `Lightning bolts and blows from weapons divide them into smaller puddings, each able to attack exactly as the original pudding.
Because puddings do not use all of their mouth openings (which cover their exposed surfaces), the smallest pudding does the same damage as the largest.`,
    mustardDesc: `This large creature can divide itself at will into two smaller, faster halves (movement rate 18).
Each is capable of attacking, but has only half the hit points the creature had before dividing.`,
  },
};
