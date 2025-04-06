export type RaceIdentifier =
  | "HUMAN"
  | "ELF"
  | "HALF_ELF"
  | "DWARF"
  | "HALFLING"
  | "GNOME"
  | "HALFORC"
  | "ANKHEG"
  | "BASILISK"
  | "BEAR"
  | "CARRIONCRAWLER"
  | "DOG"
  | "DOPPLEGANGER"
  | "ETTERCAP"
  | "GHOUL"
  | "GIBBERLING"
  | "GNOLL"
  | "HOBGOBLIN"
  | "KOBOLD"
  | "OGRE"
  | "SKELETON"
  | "SPIDER"
  | "WOLF"
  | "WYVERN"
  | "SLIME"
  | "FAIRY"
  | "DEMONIC"
  | "LYCANTHROPE"
  | "BEHOLDER"
  | "MIND_FLAYER"
  | "VAMPIRE"
  | "VAMPYRE"
  | "OTYUGH"
  | "RAKSHASA"
  | "TROLL"
  | "UMBERHULK"
  | "SAHUAGIN"
  | "SHADOW"
  | "SPECTRE"
  | "WRAITH"
  | "KUO-TOA"
  | "MIST"
  | "CAT"
  | "DUERGAR"
  | "MEPHIT"
  | "MIMIC"
  | "IMP"
  | "GIANT"
  | "ORC"
  | "GOLEM"
  | "ELEMENTAL"
  | "DRAGON"
  | "GENIE"
  | "ZOMBIE"
  | "STATUE"
  | "LICH"
  | "RABBIT"
  | "GITHYANKI"
  | "TIEFLING"
  | "YUANTI"
  | "DEMILICH"
  | "SOLAR"
  | "ANTISOLAR"
  | "PLANATAR"
  | "DARKPLANATAR"
  | "BEETLE"
  | "GOBLIN"
  | "LIZARDMAN"
  | "MYCONID"
  | "BUGBEAR"
  | "FEYR"
  | "HOOK_HORROR"
  | "SHRIEKER"
  | "SALAMANDER"
  | "BIRD"
  | "MINOTAUR"
  | "DRIDER"
  | "SIMULACRUM"
  | "HARPY"
  | "SPECTRAL_UNDEAD"
  | "SHAMBLING_MOUND"
  | "CHIMERA"
  | "HALF_DRAGON"
  | "YETI"
  | "KEG"
  | "WILL-O-WISP"
  | "MAMMAL"
  | "REPTILE"
  | "TREANT"
  | "AASIMAR"
  | "ETTIN"
  | "SWORD"
  | "BOW"
  | "XBOW"
  | "STAFF"
  | "SLING"
  | "MACE"
  | "DAGGER"
  | "SPEAR"
  | "FIST"
  | "HAMMER"
  | "MORNINGSTAR"
  | "ROBES"
  | "LEATHER"
  | "CHAIN"
  | "PLATE"
  | "NO_RACE";

export const RACE_IDENTIFIERS = [
  "HUMAN",
  "ELF",
  "HALF_ELF",
  "DWARF",
  "HALFLING",
  "GNOME",
  "HALFORC",
  "ANKHEG",
  "BASILISK",
  "BEAR",
  "CARRIONCRAWLER",
  "DOG",
  "DOPPLEGANGER",
  "ETTERCAP",
  "GHOUL",
  "GIBBERLING",
  "GNOLL",
  "HOBGOBLIN",
  "KOBOLD",
  "OGRE",
  "SKELETON",
  "SPIDER",
  "WOLF",
  "WYVERN",
  "SLIME",
  "FAIRY",
  "DEMONIC",
  "LYCANTHROPE",
  "BEHOLDER",
  "MIND_FLAYER",
  "VAMPIRE",
  "VAMPYRE",
  "OTYUGH",
  "RAKSHASA",
  "TROLL",
  "UMBERHULK",
  "SAHUAGIN",
  "SHADOW",
  "SPECTRE",
  "WRAITH",
  "KUO-TOA",
  "MIST",
  "CAT",
  "DUERGAR",
  "MEPHIT",
  "MIMIC",
  "IMP",
  "GIANT",
  "ORC",
  "GOLEM",
  "ELEMENTAL",
  "DRAGON",
  "GENIE",
  "ZOMBIE",
  "STATUE",
  "LICH",
  "RABBIT",
  "GITHYANKI",
  "TIEFLING",
  "YUANTI",
  "DEMILICH",
  "SOLAR",
  "ANTISOLAR",
  "PLANATAR",
  "DARKPLANATAR",
  "BEETLE",
  "GOBLIN",
  "LIZARDMAN",
  "MYCONID",
  "BUGBEAR",
  "FEYR",
  "HOOK_HORROR",
  "SHRIEKER",
  "SALAMANDER",
  "BIRD",
  "MINOTAUR",
  "DRIDER",
  "SIMULACRUM",
  "HARPY",
  "SPECTRAL_UNDEAD",
  "SHAMBLING_MOUND",
  "CHIMERA",
  "HALF_DRAGON",
  "YETI",
  "KEG",
  "WILL-O-WISP",
  "MAMMAL",
  "REPTILE",
  "TREANT",
  "AASIMAR",
  "ETTIN",
  "SWORD",
  "BOW",
  "XBOW",
  "STAFF",
  "SLING",
  "MACE",
  "DAGGER",
  "SPEAR",
  "FIST",
  "HAMMER",
  "MORNINGSTAR",
  "ROBES",
  "LEATHER",
  "CHAIN",
  "PLATE",
  "NO_RACE",
];

// export const raceIds = [
//     { id: '1', value: 'HUMAN' },
//     { id: '2', value: 'ELF' },
//     { id: '3', value: 'HALF_ELF' },
//     { id: '4', value: 'DWARF' },
//     { id: '5', value: 'HALFLING' },
//     { id: '6', value: 'GNOME' },
//     { id: '7', value: 'HALFORC' },
//     { id: '101', value: 'ANKHEG' },
//     { id: '102', value: 'BASILISK' },
//     { id: '103', value: 'BEAR' },
//     { id: '104', value: 'CARRIONCRAWLER' },
//     { id: '105', value: 'DOG' },
//     { id: '106', value: 'DOPPLEGANGER' },
//     { id: '107', value: 'ETTERCAP' },
//     { id: '108', value: 'GHOUL' },
//     { id: '109', value: 'GIBBERLING' },
//     { id: '110', value: 'GNOLL' },
//     { id: '111', value: 'HOBGOBLIN' },
//     { id: '112', value: 'KOBOLD' },
//     { id: '113', value: 'OGRE' },
//     { id: '115', value: 'SKELETON' },
//     { id: '116', value: 'SPIDER' },
//     { id: '117', value: 'WOLF' },
//     { id: '118', value: 'WYVERN' },
//     { id: '119', value: 'SLIME' },
//     { id: '120', value: 'FAIRY' },
//     { id: '121', value: 'DEMONIC' },
//     { id: '122', value: 'LYCANTHROPE' },
//     { id: '123', value: 'BEHOLDER' },
//     { id: '124', value: 'MIND_FLAYER' },
//     { id: '125', value: 'VAMPIRE' },
//     { id: '126', value: 'VAMPYRE' },
//     { id: '127', value: 'OTYUGH' },
//     { id: '128', value: 'RAKSHASA' },
//     { id: '129', value: 'TROLL' },
//     { id: '130', value: 'UMBERHULK' },
//     { id: '131', value: 'SAHUAGIN' },
//     { id: '132', value: 'SHADOW' },
//     { id: '133', value: 'SPECTRE' },
//     { id: '134', value: 'WRAITH' },
//     { id: '135', value: 'KUO-TOA' },
//     { id: '136', value: 'MIST' },
//     { id: '137', value: 'CAT' },
//     { id: '138', value: 'DUERGAR' },
//     { id: '139', value: 'MEPHIT' },
//     { id: '140', value: 'MIMIC' },
//     { id: '141', value: 'IMP' },
//     { id: '142', value: 'GIANT' },
//     { id: '143', value: 'ORC' },
//     { id: '144', value: 'GOLEM' },
//     { id: '145', value: 'ELEMENTAL' },
//     { id: '146', value: 'DRAGON' },
//     { id: '147', value: 'GENIE' },
//     { id: '148', value: 'ZOMBIE' },
//     { id: '149', value: 'STATUE' },
//     { id: '150', value: 'LICH' },
//     { id: '151', value: 'RABBIT' },
//     { id: '152', value: 'GITHYANKI' },
//     { id: '153', value: 'TIEFLING' },
//     { id: '154', value: 'YUANTI' },
//     { id: '155', value: 'DEMILICH' },
//     { id: '156', value: 'SOLAR' },
//     { id: '157', value: 'ANTISOLAR' },
//     { id: '158', value: 'PLANATAR' },
//     { id: '159', value: 'DARKPLANATAR' },
//     { id: '160', value: 'BEETLE' },
//     { id: '161', value: 'GOBLIN' },
//     { id: '162', value: 'LIZARDMAN' },
//     { id: '164', value: 'MYCONID' },
//     { id: '165', value: 'BUGBEAR' },
//     { id: '166', value: 'FEYR' },
//     { id: '167', value: 'HOOK_HORROR' },
//     { id: '168', value: 'SHRIEKER' },
//     { id: '169', value: 'SALAMANDER' },
//     { id: '170', value: 'BIRD' },
//     { id: '171', value: 'MINOTAUR' },
//     { id: '172', value: 'DRIDER' },
//     { id: '173', value: 'SIMULACRUM' },
//     { id: '174', value: 'HARPY' },
//     { id: '175', value: 'SPECTRAL_UNDEAD' },
//     { id: '176', value: 'SHAMBLING_MOUND' },
//     { id: '177', value: 'CHIMERA' },
//     { id: '178', value: 'HALF_DRAGON' },
//     { id: '179', value: 'YETI' },
//     { id: '180', value: 'KEG' },
//     { id: '181', value: 'WILL-O-WISP' },
//     { id: '182', value: 'MAMMAL' },
//     { id: '183', value: 'REPTILE' },
//     { id: '184', value: 'TREANT' },
//     { id: '185', value: 'AASIMAR' },
//     { id: '199', value: 'ETTIN' },
//     { id: '201', value: 'SWORD' },
//     { id: '202', value: 'BOW' },
//     { id: '203', value: 'XBOW' },
//     { id: '204', value: 'STAFF' },
//     { id: '205', value: 'SLING' },
//     { id: '206', value: 'MACE' },
//     { id: '207', value: 'DAGGER' },
//     { id: '208', value: 'SPEAR' },
//     { id: '209', value: 'FIST' },
//     { id: '210', value: 'HAMMER' },
//     { id: '211', value: 'MORNINGSTAR' },
//     { id: '212', value: 'ROBES' },
//     { id: '213', value: 'LEATHER' },
//     { id: '214', value: 'CHAIN' },
//     { id: '215', value: 'PLATE' },
//     { id: '255', value: 'NO_RACE' }
// ];
