export type ClassIdentifier =
  | "MAGE"
  | "FIGHTER"
  | "CLERIC"
  | "THIEF"
  | "BARD"
  | "PALADIN"
  | "FIGHTER_MAGE"
  | "FIGHTER_CLERIC"
  | "FIGHTER_THIEF"
  | "FIGHTER_MAGE_THIEF"
  | "DRUID"
  | "RANGER"
  | "MAGE_THIEF"
  | "CLERIC_MAGE"
  | "CLERIC_THIEF"
  | "FIGHTER_DRUID"
  | "FIGHTER_MAGE_CLERIC"
  | "CLERIC_RANGER"
  | "SORCERER"
  | "MONK"
  | "SHAMAN"
  | "ANKHEG"
  | "BASILISK"
  | "BASILISK_GREATER"
  | "BEAR_BLACK"
  | "BEAR_BROWN"
  | "BEAR_CAVE"
  | "BEAR_POLAR"
  | "CARRIONCRAWLER"
  | "DOG_WILD"
  | "DOG_WAR"
  | "DOPPLEGANGER"
  | "DOPPLEGANGER_GREATER"
  | "DRIZZT"
  | "ELMINSTER"
  | "ETTERCAP"
  | "GHOUL"
  | "GHOUL_REVEANT"
  | "GHOUL_GHAST"
  | "GIBBERLING"
  | "GNOLL"
  | "HOBGOBLIN"
  | "KOBOLD"
  | "KOBOLD_TASLOI"
  | "KOBOLD_XVART"
  | "OGRE"
  | "OGRE_MAGE"
  | "OGRE_HALFOGRE"
  | "OGRE_OGRILLON"
  | "SAREVOK"
  | "FAIRY_SIRINE"
  | "FAIRY_DRYAD"
  | "FAIRY_NEREID"
  | "FAIRY_NYMPH"
  | "SKELETON"
  | "SKELETON_WARRIOR"
  | "SKELETON_BANEGUARD"
  | "SPIDER_GIANT"
  | "SPIDER_HUGE"
  | "SPIDER_PHASE"
  | "SPIDER_SWORD"
  | "SPIDER_WRAITH"
  | "VOLO"
  | "WOLF"
  | "WOLF_WORG"
  | "WOLF_DIRE"
  | "WOLF_WINTER"
  | "WOLF_VAMPIRIC"
  | "WOLF_DREAD"
  | "WYVERN"
  | "OLIVE_SLIME"
  | "MUSTARD_JELLY"
  | "OCRE_JELLY"
  | "GREY_OOZE"
  | "GREEN_SLIME"
  | "INNOCENT"
  | "FLAMING_FIST"
  | "WEREWOLF"
  | "WOLFWERE"
  | "DEATHKNIGHT"
  | "TANARI"
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
  | "GOLEM_IRON"
  | "GOLEM_FLESH"
  | "GOLEM_STONE"
  | "GOLEM_CLAY"
  | "ELEMENTAL_AIR"
  | "ELEMENTAL_FIRE"
  | "ELEMENTAL_EARTH"
  | "SPIDER_CENTEOL"
  | "RED_DRAGON"
  | "SHADOW_DRAGON"
  | "SILVER_DRAGON"
  | "GENIE_DJINNI"
  | "GENIE_DAO"
  | "GENIE_EFREETI"
  | "GENIE_NOBLE_DJINNI"
  | "GENIE_NOBLE_EFREETI"
  | "ZOMBIE_NORMAL"
  | "FOOD_CREATURE"
  | "HUNTER_CREATURE"
  | "LONG_SWORD"
  | "LONG_BOW"
  | "MAGE_ALL"
  | "FIGHTER_ALL"
  | "CLERIC_ALL"
  | "THIEF_ALL"
  | "BARD_ALL"
  | "PALADIN_ALL"
  | "DRUID_ALL"
  | "RANGER_ALL"
  | "WIZARD_EYE"
  | "CANDLEKEEP_WATCHER"
  | "AMNISH_SOLDIER"
  | "TOWN_GUARD"
  | "ELEMENTAL_WATER"
  | "GREEN_DRAGON"
  | "NEOTHELID"
  | "SPECTRAL_TROLL"
  | "WIGHT"
  | "NO_CLASS";

export const CLASS_IDENTIFIERS = [
  "MAGE",
  "FIGHTER",
  "CLERIC",
  "THIEF",
  "BARD",
  "PALADIN",
  "FIGHTER_MAGE",
  "FIGHTER_CLERIC",
  "FIGHTER_THIEF",
  "FIGHTER_MAGE_THIEF",
  "DRUID",
  "RANGER",
  "MAGE_THIEF",
  "CLERIC_MAGE",
  "CLERIC_THIEF",
  "FIGHTER_DRUID",
  "FIGHTER_MAGE_CLERIC",
  "CLERIC_RANGER",
  "SORCERER",
  "MONK",
  "SHAMAN",
  "ANKHEG",
  "BASILISK",
  "BASILISK_GREATER",
  "BEAR_BLACK",
  "BEAR_BROWN",
  "BEAR_CAVE",
  "BEAR_POLAR",
  "CARRIONCRAWLER",
  "DOG_WILD",
  "DOG_WAR",
  "DOPPLEGANGER",
  "DOPPLEGANGER_GREATER",
  "DRIZZT",
  "ELMINSTER",
  "ETTERCAP",
  "GHOUL",
  "GHOUL_REVEANT",
  "GHOUL_GHAST",
  "GIBBERLING",
  "GNOLL",
  "HOBGOBLIN",
  "KOBOLD",
  "KOBOLD_TASLOI",
  "KOBOLD_XVART",
  "OGRE",
  "OGRE_MAGE",
  "OGRE_HALFOGRE",
  "OGRE_OGRILLON",
  "SAREVOK",
  "FAIRY_SIRINE",
  "FAIRY_DRYAD",
  "FAIRY_NEREID",
  "FAIRY_NYMPH",
  "SKELETON",
  "SKELETON_WARRIOR",
  "SKELETON_BANEGUARD",
  "SPIDER_GIANT",
  "SPIDER_HUGE",
  "SPIDER_PHASE",
  "SPIDER_SWORD",
  "SPIDER_WRAITH",
  "VOLO",
  "WOLF",
  "WOLF_WORG",
  "WOLF_DIRE",
  "WOLF_WINTER",
  "WOLF_VAMPIRIC",
  "WOLF_DREAD",
  "WYVERN",
  "OLIVE_SLIME",
  "MUSTARD_JELLY",
  "OCRE_JELLY",
  "GREY_OOZE",
  "GREEN_SLIME",
  "INNOCENT",
  "FLAMING_FIST",
  "WEREWOLF",
  "WOLFWERE",
  "DEATHKNIGHT",
  "TANARI",
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
  "GOLEM_IRON",
  "GOLEM_FLESH",
  "GOLEM_STONE",
  "GOLEM_CLAY",
  "ELEMENTAL_AIR",
  "ELEMENTAL_FIRE",
  "ELEMENTAL_EARTH",
  "SPIDER_CENTEOL",
  "RED_DRAGON",
  "SHADOW_DRAGON",
  "SILVER_DRAGON",
  "GENIE_DJINNI",
  "GENIE_DAO",
  "GENIE_EFREETI",
  "GENIE_NOBLE_DJINNI",
  "GENIE_NOBLE_EFREETI",
  "ZOMBIE_NORMAL",
  "FOOD_CREATURE",
  "HUNTER_CREATURE",
  "LONG_SWORD",
  "LONG_BOW",
  "MAGE_ALL",
  "FIGHTER_ALL",
  "CLERIC_ALL",
  "THIEF_ALL",
  "BARD_ALL",
  "PALADIN_ALL",
  "DRUID_ALL",
  "RANGER_ALL",
  "WIZARD_EYE",
  "CANDLEKEEP_WATCHER",
  "AMNISH_SOLDIER",
  "TOWN_GUARD",
  "ELEMENTAL_WATER",
  "GREEN_DRAGON",
  "NEOTHELID",
  "SPECTRAL_TROLL",
  "WIGHT",
  "NO_CLASS",
];

// export const classIds = [
//     { id: '1', value: 'MAGE' },
//     { id: '2', value: 'FIGHTER' },
//     { id: '3', value: 'CLERIC' },
//     { id: '4', value: 'THIEF' },
//     { id: '5', value: 'BARD' },
//     { id: '6', value: 'PALADIN' },
//     { id: '7', value: 'FIGHTER_MAGE' },
//     { id: '8', value: 'FIGHTER_CLERIC' },
//     { id: '9', value: 'FIGHTER_THIEF' },
//     { id: '10', value: 'FIGHTER_MAGE_THIEF' },
//     { id: '11', value: 'DRUID' },
//     { id: '12', value: 'RANGER' },
//     { id: '13', value: 'MAGE_THIEF' },
//     { id: '14', value: 'CLERIC_MAGE' },
//     { id: '15', value: 'CLERIC_THIEF' },
//     { id: '16', value: 'FIGHTER_DRUID' },
//     { id: '17', value: 'FIGHTER_MAGE_CLERIC' },
//     { id: '18', value: 'CLERIC_RANGER' },
//     { id: '19', value: 'SORCERER' },
//     { id: '20', value: 'MONK' },
//     { id: '21', value: 'SHAMAN' },
//     { id: '101', value: 'ANKHEG' },
//     { id: '102', value: 'BASILISK' },
//     { id: '103', value: 'BASILISK_GREATER' },
//     { id: '104', value: 'BEAR_BLACK' },
//     { id: '105', value: 'BEAR_BROWN' },
//     { id: '106', value: 'BEAR_CAVE' },
//     { id: '107', value: 'BEAR_POLAR' },
//     { id: '108', value: 'CARRIONCRAWLER' },
//     { id: '109', value: 'DOG_WILD' },
//     { id: '110', value: 'DOG_WAR' },
//     { id: '111', value: 'DOPPLEGANGER' },
//     { id: '112', value: 'DOPPLEGANGER_GREATER' },
//     { id: '113', value: 'DRIZZT' },
//     { id: '114', value: 'ELMINSTER' },
//     { id: '115', value: 'ETTERCAP' },
//     { id: '116', value: 'GHOUL' },
//     { id: '117', value: 'GHOUL_REVEANT' },
//     { id: '118', value: 'GHOUL_GHAST' },
//     { id: '119', value: 'GIBBERLING' },
//     { id: '120', value: 'GNOLL' },
//     { id: '121', value: 'HOBGOBLIN' },
//     { id: '122', value: 'KOBOLD' },
//     { id: '123', value: 'KOBOLD_TASLOI' },
//     { id: '124', value: 'KOBOLD_XVART' },
//     { id: '125', value: 'OGRE' },
//     { id: '126', value: 'OGRE_MAGE' },
//     { id: '127', value: 'OGRE_HALFOGRE' },
//     { id: '128', value: 'OGRE_OGRILLON' },
//     { id: '129', value: 'SAREVOK' },
//     { id: '130', value: 'FAIRY_SIRINE' },
//     { id: '131', value: 'FAIRY_DRYAD' },
//     { id: '132', value: 'FAIRY_NEREID' },
//     { id: '133', value: 'FAIRY_NYMPH' },
//     { id: '134', value: 'SKELETON' },
//     { id: '135', value: 'SKELETON_WARRIOR' },
//     { id: '136', value: 'SKELETON_BANEGUARD' },
//     { id: '137', value: 'SPIDER_GIANT' },
//     { id: '138', value: 'SPIDER_HUGE' },
//     { id: '139', value: 'SPIDER_PHASE' },
//     { id: '140', value: 'SPIDER_SWORD' },
//     { id: '141', value: 'SPIDER_WRAITH' },
//     { id: '142', value: 'VOLO' },
//     { id: '143', value: 'WOLF' },
//     { id: '144', value: 'WOLF_WORG' },
//     { id: '145', value: 'WOLF_DIRE' },
//     { id: '146', value: 'WOLF_WINTER' },
//     { id: '147', value: 'WOLF_VAMPIRIC' },
//     { id: '148', value: 'WOLF_DREAD' },
//     { id: '149', value: 'WYVERN' },
//     { id: '150', value: 'OLIVE_SLIME' },
//     { id: '151', value: 'MUSTARD_JELLY' },
//     { id: '152', value: 'OCRE_JELLY' },
//     { id: '153', value: 'GREY_OOZE' },
//     { id: '154', value: 'GREEN_SLIME' },
//     { id: '155', value: 'INNOCENT' },
//     { id: '156', value: 'FLAMING_FIST' },
//     { id: '157', value: 'WEREWOLF' },
//     { id: '158', value: 'WOLFWERE' },
//     { id: '159', value: 'DEATHKNIGHT' },
//     { id: '160', value: 'TANARI' },
//     { id: '161', value: 'BEHOLDER' },
//     { id: '162', value: 'MIND_FLAYER' },
//     { id: '163', value: 'VAMPIRE' },
//     { id: '164', value: 'VAMPYRE' },
//     { id: '165', value: 'OTYUGH' },
//     { id: '166', value: 'RAKSHASA' },
//     { id: '167', value: 'TROLL' },
//     { id: '168', value: 'UMBERHULK' },
//     { id: '169', value: 'SAHUAGIN' },
//     { id: '170', value: 'SHADOW' },
//     { id: '171', value: 'SPECTRE' },
//     { id: '172', value: 'WRAITH' },
//     { id: '173', value: 'KUO-TOA' },
//     { id: '174', value: 'MIST' },
//     { id: '175', value: 'CAT' },
//     { id: '176', value: 'DUERGAR' },
//     { id: '177', value: 'MEPHIT' },
//     { id: '178', value: 'MIMIC' },
//     { id: '179', value: 'IMP' },
//     { id: '180', value: 'GIANT' },
//     { id: '181', value: 'ORC' },
//     { id: '182', value: 'GOLEM_IRON' },
//     { id: '183', value: 'GOLEM_FLESH' },
//     { id: '184', value: 'GOLEM_STONE' },
//     { id: '185', value: 'GOLEM_CLAY' },
//     { id: '186', value: 'ELEMENTAL_AIR' },
//     { id: '187', value: 'ELEMENTAL_FIRE' },
//     { id: '188', value: 'ELEMENTAL_EARTH' },
//     { id: '189', value: 'SPIDER_CENTEOL' },
//     { id: '190', value: 'RED_DRAGON' },
//     { id: '191', value: 'SHADOW_DRAGON' },
//     { id: '192', value: 'SILVER_DRAGON' },
//     { id: '193', value: 'GENIE_DJINNI' },
//     { id: '194', value: 'GENIE_DAO' },
//     { id: '195', value: 'GENIE_EFREETI' },
//     { id: '196', value: 'GENIE_NOBLE_DJINNI' },
//     { id: '197', value: 'GENIE_NOBLE_EFREETI' },
//     { id: '198', value: 'ZOMBIE_NORMAL' },
//     { id: '199', value: 'FOOD_CREATURE' },
//     { id: '200', value: 'HUNTER_CREATURE' },
//     { id: '201', value: 'LONG_SWORD' },
//     { id: '202', value: 'LONG_BOW' },
//     { id: '202', value: 'MAGE_ALL' },
//     { id: '203', value: 'FIGHTER_ALL' },
//     { id: '204', value: 'CLERIC_ALL' },
//     { id: '205', value: 'THIEF_ALL' },
//     { id: '206', value: 'BARD_ALL' },
//     { id: '207', value: 'PALADIN_ALL' },
//     { id: '208', value: 'DRUID_ALL' },
//     { id: '209', value: 'RANGER_ALL' },
//     { id: '210', value: 'WIZARD_EYE' },
//     { id: '211', value: 'CANDLEKEEP_WATCHER' },
//     { id: '212', value: 'AMNISH_SOLDIER' },
//     { id: '213', value: 'TOWN_GUARD' },
//     { id: '219', value: 'ELEMENTAL_WATER' },
//     { id: '220', value: 'GREEN_DRAGON' },
//     { id: '221', value: 'NEOTHELID' },
//     { id: '222', value: 'SPECTRAL_TROLL' },
//     { id: '223', value: 'WIGHT' },
//     { id: '255', value: 'NO_CLASS' }
// ];
