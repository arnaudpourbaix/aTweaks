export type StatsIdentifiers =
  | "MAXHITPOINTS"
  | "ARMORCLASS"
  | "ACCRUSHINGMOD"
  | "ACMISSILEMOD"
  | "ACPIERCINGMOD"
  | "ACSLASHINGMOD"
  | "THAC0"
  | "NUMBEROFATTACKS"
  | "SAVEVSDEATH"
  | "SAVEVSWANDS"
  | "SAVEVSPOLY"
  | "SAVEVSBREATH"
  | "SAVEVSSPELL"
  | "RESISTFIRE"
  | "RESISTCOLD"
  | "RESISTELECTRICITY"
  | "RESISTACID"
  | "RESISTMAGIC"
  | "RESISTMAGICFIRE"
  | "RESISTMAGICCOLD"
  | "RESISTSLASHING"
  | "RESISTCRUSHING"
  | "RESISTPIERCING"
  | "RESISTMISSILE"
  | "LORE"
  | "LOCKPICKING"
  | "STEALTH"
  | "TRAPS"
  | "PICKPOCKET"
  | "FATIGUE"
  | "INTOXICATION"
  | "LUCK"
  | "TRACKING"
  | "LEVEL"
  | "SEX"
  | "STR"
  | "STREXTRA"
  | "INT"
  | "WIS"
  | "DEX"
  | "CON"
  | "CHR"
  | "XPVALUE"
  | "XP"
  | "GOLD"
  | "MORALEBREAK"
  | "MORALERECOVERYTIME"
  | "REPUTATION"
  | "HATEDRACE"
  | "DAMAGEBONUS"
  | "SPELLFAILUREMAGE"
  | "SPELLFAILUREPRIEST"
  | "SPELLDURATIONMODMAGE"
  | "SPELLDURATIONMODPRIEST"
  | "TURNUNDEADLEVEL"
  | "BACKSTABDAMAGEMULTIPLIER"
  | "LAYONHANDSAMOUNT"
  | "HELD"
  | "POLYMORPHED"
  | "TRANSLUCENT"
  | "IDENTIFYMODE"
  | "ENTANGLE"
  | "SANCTUARY"
  | "MINORGLOBE"
  | "SHIELDGLOBE"
  | "GREASE"
  | "WEB"
  | "LEVEL2"
  | "LEVEL3"
  | "CasterHold"
  | "ENCUMBERANCE"
  | "MISSILETHAC0BONUS"
  | "MAGICDAMAGERESISTANCE"
  | "RESISTPOISON"
  | "DONOTJUMP"
  | "AURACLEANSING"
  | "MENTALSPEED"
  | "PHYSICALSPEED"
  | "CASTINGLEVELBONUSMAGE"
  | "CASTINGLEVELBONUSCLERIC"
  | "SEEINVISIBLE"
  | "IGNOREDIALOGPAUSE"
  | "MINHITPOINTS"
  | "THAC0BONUSRIGHT"
  | "THAC0BONUSLEFT"
  | "DAMAGEBONUSRIGHT"
  | "DAMAGEBONUSLEFT"
  | "STONESKINS"
  | "PROFICIENCYBASTARDSWORD"
  | "PROFICIENCYLONGSWORD"
  | "PROFICIENCYSHORTSWORD"
  | "PROFICIENCYAXE"
  | "PROFICIENCYTWOHANDEDSWORD"
  | "PROFICIENCYKATANA"
  | "PROFICIENCYSCIMITARWAKISASHININJATO"
  | "PROFICIENCYDAGGER"
  | "PROFICIENCYWARHAMMER"
  | "PROFICIENCYSPEAR"
  | "PROFICIENCYHALBERD"
  | "PROFICIENCYFLAILMORNINGSTAR"
  | "PROFICIENCYMACE"
  | "PROFICIENCYQUARTERSTAFF"
  | "PROFICIENCYCROSSBOW"
  | "PROFICIENCYLONGBOW"
  | "PROFICIENCYSHORTBOW"
  | "PROFICIENCYDART"
  | "PROFICIENCYSLING"
  | "PROFICIENCYBLACKJACK"
  | "WEAPON_ENCHANTMENT"
  | "CLERIC_ARMOR_OF_FAITH"
  | "PROFICIENCY2HANDED"
  | "PROFICIENCYSWORDANDSHIELD"
  | "PROFICIENCYSINGLEWEAPON"
  | "PROFICIENCY2WEAPON"
  | "PROFICIENCYCLUB"
  | "WIZARD_SPELL_DEFLECTION"
  | "PROTECTION_FROM_EVIL"
  | "TRUE_SIGHT"
  | "CLERIC_CHAOTIC_COMMANDS"
  | "CLERIC_INSECT_PLAGUE"
  | "CLERIC_BLADE_BARRIER"
  | "CLERIC_PHYSICAL_MIRROR"
  | "CLERIC_SHIELD_OF_THE_ARCHONS"
  | "CLERIC_REGENERATION"
  | "WIZARD_FIRE_SHIELD"
  | "WIZARD_PROTECTION_FROM_MAGIC_ENERGY"
  | "WIZARD_MISLEAD"
  | "WIZARD_PROTECTION_FROM_MAGIC_WEAPONS"
  | "WIZARD_SPELL_TURNING"
  | "WIZARD_PROTECTION_FROM_THE_ELEMENTS"
  | "CLERIC_FREE_ACTION"
  | "WIZARD_KHELBENS_WARDING_WHIP"
  | "CLERIC_DEFENSIVE_HARMONY"
  | "EXTRAPROFICIENCY20"
  | "HIDEINSHADOWS"
  | "DETECTILLUSIONS"
  | "SETTRAPS"
  | "PUPPETMASTERID"
  | "PUPPETMASTERTYPE"
  | "PUPPETTYPE"
  | "PUPPETID"
  | "CHECKFORBERSERK"
  | "BERSERKSTAGE1"
  | "BERSERKSTAGE2"
  | "DAMAGELUCK"
  | "CRITICALHITBONUS"
  | "VISUALRANGE"
  | "EXPLORE"
  | "THRULLCHARM"
  | "SUMMONDISABLE"
  | "HITBONUS"
  | "KIT"
  | "FORCESURGE"
  | "SURGEMOD"
  | "IMPROVEDHASTE"
  | "SCRIPTINGSTATE1"
  | "WING_BUFFET"
  | "SCRIPTINGSTATE2"
  | "DEATH_WARD"
  | "SCRIPTINGSTATE3"
  | "LEVEL_DRAIN_IMMUNITY"
  | "SCRIPTINGSTATE4"
  | "OFFENSIVE_MODIFIER"
  | "SCRIPTINGSTATE5"
  | "DEFENSIVE_MODIFIER"
  | "SCRIPTINGSTATE6"
  | "STRENGTH_MODIFIER"
  | "WIZARD_SPELL_IMMUNITY"
  | "WIZARD_PROTECTION_FROM_ENERGY"
  | "WIZARD_SPELL_TRAP"
  | "WIZARD_IMPROVED_ALACRITY"
  | "MELEE_THACO_BONUS"
  | "MELEE_DAMAGE_BONUS"
  | "MISSILE_DAMAGE_BONUS"
  | "DISABLE_CIRCLE"
  | "FIST_THACO_BONUS"
  | "FIST_DAMAGE_BONUS"
  | "CLASS_STRING_OVERRIDE_MIXED"
  | "CLASS_STRING_OVERRIDE_LOWER"
  | "PREVENT_SPELL_PROTECTION_EFFECTS"
  | "IMMUNITY_TO_BACKSTAB"
  | "LOCKPICKINGMTPBONUS"
  | "WIZARD_PROTECTION_FROM_PETRIFICATION"
  | "MOVESILENTLYMTPBONUS"
  | "WIZARD_SPELL_SHIELD"
  | "TRAPSMTPBONUS"
  | "WIZARD_RESIST_FEAR"
  | "PICKPOCKETMTPBONUS"
  | "WIZARD_PROTECTION_FROM_NORMAL_MISSILES"
  | "HIDEINSHADOWSMTPBONUS"
  | "WIZARD_GREATER_MALISON"
  | "DETECTILLUSIONSMTPBONUS"
  | "WIZARD_PROTECTION_FROM_NORMAL_WEAPONS"
  | "SETTRAPSMTPBONUS"
  | "WIZARD_TENSERS_TRANSFORMATION"
  | "PREVENT_AI_SLOWDOWN"
  | "EXISTANCE_DELAY_OVERRIDE"
  | "ANIMATION_ONLY_HASTE"
  | "NO_PERMANENT_DEATH"
  | "IMMUNE_TO_TURN_UNDEAD"
  | "SUMMON_DISABLE_ACTION"
  | "CHAOS_SHIELD"
  | "NPC_BUMP"
  | "USE_ANY_ITEM"
  | "ASSASSINATE"
  | "SEX_CHANGED"
  | "SPELL_FAILURE_INNATE"
  | "IMMUNE_TO_TRACKING"
  | "DEAD_MAGIC"
  | "IMMUNE_TO_TIME_STOP"
  | "IMMUNE_TO_SEQUESTER"
  | "STONESKINSGOLEM"
  | "LEVELDRAIN"
  | "DONOTDRAW"
  | "IGNOREDRAINDEATH";

// export const statIds = [
//     { id: '1', value: 'MAXHITPOINTS' },
//     { id: '2', value: 'ARMORCLASS' },
//     { id: '3', value: 'ACCRUSHINGMOD' },
//     { id: '4', value: 'ACMISSILEMOD' },
//     { id: '5', value: 'ACPIERCINGMOD' },
//     { id: '6', value: 'ACSLASHINGMOD' },
//     { id: '7', value: 'THAC0' },
//     { id: '8', value: 'NUMBEROFATTACKS' },
//     { id: '9', value: 'SAVEVSDEATH' },
//     { id: '10', value: 'SAVEVSWANDS' },
//     { id: '11', value: 'SAVEVSPOLY' },
//     { id: '12', value: 'SAVEVSBREATH' },
//     { id: '13', value: 'SAVEVSSPELL' },
//     { id: '14', value: 'RESISTFIRE' },
//     { id: '15', value: 'RESISTCOLD' },
//     { id: '16', value: 'RESISTELECTRICITY' },
//     { id: '17', value: 'RESISTACID' },
//     { id: '18', value: 'RESISTMAGIC' },
//     { id: '19', value: 'RESISTMAGICFIRE' },
//     { id: '20', value: 'RESISTMAGICCOLD' },
//     { id: '21', value: 'RESISTSLASHING' },
//     { id: '22', value: 'RESISTCRUSHING' },
//     { id: '23', value: 'RESISTPIERCING' },
//     { id: '24', value: 'RESISTMISSILE' },
//     { id: '25', value: 'LORE' },
//     { id: '26', value: 'LOCKPICKING' },
//     { id: '27', value: 'STEALTH' },
//     { id: '28', value: 'TRAPS' },
//     { id: '29', value: 'PICKPOCKET' },
//     { id: '30', value: 'FATIGUE' },
//     { id: '31', value: 'INTOXICATION' },
//     { id: '32', value: 'LUCK' },
//     { id: '33', value: 'TRACKING' },
//     { id: '34', value: 'LEVEL' },
//     { id: '35', value: 'SEX' },
//     { id: '36', value: 'STR' },
//     { id: '37', value: 'STREXTRA' },
//     { id: '38', value: 'INT' },
//     { id: '39', value: 'WIS' },
//     { id: '40', value: 'DEX' },
//     { id: '41', value: 'CON' },
//     { id: '42', value: 'CHR' },
//     { id: '43', value: 'XPVALUE' },
//     { id: '44', value: 'XP' },
//     { id: '45', value: 'GOLD' },
//     { id: '46', value: 'MORALEBREAK' },
//     { id: '47', value: 'MORALERECOVERYTIME' },
//     { id: '48', value: 'REPUTATION' },
//     { id: '49', value: 'HATEDRACE' },
//     { id: '50', value: 'DAMAGEBONUS' },
//     { id: '51', value: 'SPELLFAILUREMAGE' },
//     { id: '52', value: 'SPELLFAILUREPRIEST' },
//     { id: '53', value: 'SPELLDURATIONMODMAGE' },
//     { id: '54', value: 'SPELLDURATIONMODPRIEST' },
//     { id: '55', value: 'TURNUNDEADLEVEL' },
//     { id: '56', value: 'BACKSTABDAMAGEMULTIPLIER' },
//     { id: '57', value: 'LAYONHANDSAMOUNT' },
//     { id: '58', value: 'HELD' },
//     { id: '59', value: 'POLYMORPHED' },
//     { id: '60', value: 'TRANSLUCENT' },
//     { id: '61', value: 'IDENTIFYMODE' },
//     { id: '62', value: 'ENTANGLE' },
//     { id: '63', value: 'SANCTUARY' },
//     { id: '64', value: 'MINORGLOBE' },
//     { id: '65', value: 'SHIELDGLOBE' },
//     { id: '66', value: 'GREASE' },
//     { id: '67', value: 'WEB' },
//     { id: '68', value: 'LEVEL2' },
//     { id: '69', value: 'LEVEL3' },
//     { id: '70', value: 'CasterHold' },
//     { id: '71', value: 'ENCUMBERANCE' },
//     { id: '72', value: 'MISSILETHAC0BONUS' },
//     { id: '73', value: 'MAGICDAMAGERESISTANCE' },
//     { id: '74', value: 'RESISTPOISON' },
//     { id: '75', value: 'DONOTJUMP' },
//     { id: '76', value: 'AURACLEANSING' },
//     { id: '77', value: 'MENTALSPEED' },
//     { id: '78', value: 'PHYSICALSPEED' },
//     { id: '79', value: 'CASTINGLEVELBONUSMAGE' },
//     { id: '80', value: 'CASTINGLEVELBONUSCLERIC' },
//     { id: '81', value: 'SEEINVISIBLE' },
//     { id: '82', value: 'IGNOREDIALOGPAUSE' },
//     { id: '83', value: 'MINHITPOINTS' },
//     { id: '84', value: 'THAC0BONUSRIGHT' },
//     { id: '85', value: 'THAC0BONUSLEFT' },
//     { id: '86', value: 'DAMAGEBONUSRIGHT' },
//     { id: '87', value: 'DAMAGEBONUSLEFT' },
//     { id: '88', value: 'STONESKINS' },
//     { id: '89', value: 'PROFICIENCYBASTARDSWORD' },
//     { id: '90', value: 'PROFICIENCYLONGSWORD' },
//     { id: '91', value: 'PROFICIENCYSHORTSWORD' },
//     { id: '92', value: 'PROFICIENCYAXE' },
//     { id: '93', value: 'PROFICIENCYTWOHANDEDSWORD' },
//     { id: '94', value: 'PROFICIENCYKATANA' },
//     { id: '95', value: 'PROFICIENCYSCIMITARWAKISASHININJATO' },
//     { id: '96', value: 'PROFICIENCYDAGGER' },
//     { id: '97', value: 'PROFICIENCYWARHAMMER' },
//     { id: '98', value: 'PROFICIENCYSPEAR' },
//     { id: '99', value: 'PROFICIENCYHALBERD' },
//     { id: '100', value: 'PROFICIENCYFLAILMORNINGSTAR' },
//     { id: '101', value: 'PROFICIENCYMACE' },
//     { id: '102', value: 'PROFICIENCYQUARTERSTAFF' },
//     { id: '103', value: 'PROFICIENCYCROSSBOW' },
//     { id: '104', value: 'PROFICIENCYLONGBOW' },
//     { id: '105', value: 'PROFICIENCYSHORTBOW' },
//     { id: '106', value: 'PROFICIENCYDART' },
//     { id: '107', value: 'PROFICIENCYSLING' },
//     { id: '108', value: 'PROFICIENCYBLACKJACK' },
//     { id: '109', value: 'CLERIC_HALLOW' },
//     { id: '109', value: 'WEAPON_ENCHANTMENT' },
//     { id: '110', value: 'CLERIC_ARMOR_OF_FAITH' },
//     { id: '111', value: 'PROFICIENCY2HANDED' },
//     { id: '112', value: 'PROFICIENCYSWORDANDSHIELD' },
//     { id: '113', value: 'PROFICIENCYSINGLEWEAPON' },
//     { id: '114', value: 'PROFICIENCY2WEAPON' },
//     { id: '115', value: 'PROFICIENCYCLUB' },
//     { id: '116', value: 'WIZARD_SPELL_DEFLECTION' },
//     { id: '117', value: 'PROTECTION_FROM_EVIL' },
//     { id: '118', value: 'TRUE_SIGHT' },
//     { id: '119', value: 'CLERIC_CHAOTIC_COMMANDS' },
//     { id: '120', value: 'CLERIC_INSECT_PLAGUE' },
//     { id: '121', value: 'CLERIC_BLADE_BARRIER' },
//     { id: '122', value: 'CLERIC_PHYSICAL_MIRROR' },
//     { id: '123', value: 'CLERIC_SHIELD_OF_THE_ARCHONS' },
//     { id: '124', value: 'CLERIC_REGENERATION' },
//     { id: '125', value: 'WIZARD_FIRE_SHIELD' },
//     { id: '126', value: 'WIZARD_PROTECTION_FROM_MAGIC_ENERGY' },
//     { id: '127', value: 'WIZARD_MISLEAD' },
//     { id: '128', value: 'WIZARD_PROTECTION_FROM_MAGIC_WEAPONS' },
//     { id: '129', value: 'WIZARD_SPELL_TURNING' },
//     { id: '130', value: 'WIZARD_PROTECTION_FROM_THE_ELEMENTS' },
//     { id: '131', value: 'CLERIC_FREE_ACTION' },
//     { id: '132', value: 'WIZARD_KHELBENS_WARDING_WHIP' },
//     { id: '133', value: 'CLERIC_DEFENSIVE_HARMONY' },
//     { id: '134', value: 'EXTRAPROFICIENCY20' },
//     { id: '135', value: 'HIDEINSHADOWS' },
//     { id: '136', value: 'DETECTILLUSIONS' },
//     { id: '137', value: 'SETTRAPS' },
//     { id: '138', value: 'PUPPETMASTERID' },
//     { id: '139', value: 'PUPPETMASTERTYPE' },
//     { id: '140', value: 'PUPPETTYPE' },
//     { id: '141', value: 'PUPPETID' },
//     { id: '142', value: 'CHECKFORBERSERK' },
//     { id: '143', value: 'BERSERKSTAGE1' },
//     { id: '144', value: 'BERSERKSTAGE2' },
//     { id: '145', value: 'DAMAGELUCK' },
//     { id: '146', value: 'CRITICALHITBONUS' },
//     { id: '147', value: 'VISUALRANGE' },
//     { id: '148', value: 'EXPLORE' },
//     { id: '149', value: 'THRULLCHARM' },
//     { id: '150', value: 'SUMMONDISABLE' },
//     { id: '151', value: 'HITBONUS' },
//     { id: '152', value: 'KIT' },
//     { id: '153', value: 'FORCESURGE' },
//     { id: '154', value: 'SURGEMOD' },
//     { id: '155', value: 'IMPROVEDHASTE' },
//     { id: '156', value: 'SCRIPTINGSTATE1' },
//     { id: '156', value: 'WING_BUFFET' },
//     { id: '157', value: 'SCRIPTINGSTATE2' },
//     { id: '157', value: 'DEATH_WARD' },
//     { id: '158', value: 'SCRIPTINGSTATE3' },
//     { id: '158', value: 'LEVEL_DRAIN_IMMUNITY' },
//     { id: '159', value: 'SCRIPTINGSTATE4' },
//     { id: '159', value: 'OFFENSIVE_MODIFIER' },
//     { id: '160', value: 'SCRIPTINGSTATE5' },
//     { id: '160', value: 'DEFENSIVE_MODIFIER' },
//     { id: '161', value: 'SCRIPTINGSTATE6' },
//     { id: '161', value: 'STRENGTH_MODIFIER' },
//     { id: '162', value: 'WIZARD_SPELL_IMMUNITY' },
//     { id: '163', value: 'WIZARD_PROTECTION_FROM_ENERGY' },
//     { id: '164', value: 'WIZARD_SPELL_TRAP' },
//     { id: '165', value: 'WIZARD_IMPROVED_ALACRITY' },
//     { id: '166', value: 'MELEE_THACO_BONUS' },
//     { id: '167', value: 'MELEE_DAMAGE_BONUS' },
//     { id: '168', value: 'MISSILE_DAMAGE_BONUS' },
//     { id: '169', value: 'DISABLE_CIRCLE' },
//     { id: '170', value: 'FIST_THACO_BONUS' },
//     { id: '171', value: 'FIST_DAMAGE_BONUS' },
//     { id: '172', value: 'CLASS_STRING_OVERRIDE_MIXED' },
//     { id: '173', value: 'CLASS_STRING_OVERRIDE_LOWER' },
//     { id: '174', value: 'PREVENT_SPELL_PROTECTION_EFFECTS' },
//     { id: '175', value: 'IMMUNITY_TO_BACKSTAB' },
//     { id: '176', value: 'WIZARD_PROTECTION_FROM_PETRIFICATION' },
//     { id: '176', value: 'LOCKPICKINGMTPBONUS' },
//     { id: '176', value: 'PROTECTION_FROM_PETRIFICATION_DONOTUSE' },
//     { id: '177', value: 'WIZARD_SPELL_SHIELD' },
//     { id: '177', value: 'MOVESILENTLYMTPBONUS' },
//     { id: '177', value: 'SPELL_SHIELD_DONOTUSE' },
//     { id: '178', value: 'WIZARD_RESIST_FEAR' },
//     { id: '178', value: 'TRAPSMTPBONUS' },
//     { id: '178', value: 'RESIST_FEAR_DONOTUSE' },
//     { id: '179', value: 'WIZARD_PROTECTION_FROM_NORMAL_MISSILES' },
//     { id: '179', value: 'PICKPOCKETMTPBONUS' },
//     { id: '179', value: 'PROTECTION_FROM_NORMAL_MISSILES_DONOTUSE' },
//     { id: '180', value: 'WIZARD_GREATER_MALISON' },
//     { id: '180', value: 'HIDEINSHADOWSMTPBONUS' },
//     { id: '180', value: 'MALISON_DONOTUSE' },
//     { id: '181', value: 'WIZARD_PROTECTION_FROM_NORMAL_WEAPONS' },
//     { id: '181', value: 'DETECTILLUSIONSMTPBONUS' },
//     { id: '181', value: 'PROTECTION_FROM_NORMAL_WEAPONS_DONOTUSE' },
//     { id: '182', value: 'WIZARD_TENSERS_TRANSFORMATION' },
//     { id: '182', value: 'SETTRAPSMTPBONUS' },
//     { id: '182', value: 'TENSERS_TRANSFORMATION_DONOTUSE' },
//     { id: '183', value: 'PREVENT_AI_SLOWDOWN' },
//     { id: '184', value: 'EXISTANCE_DELAY_OVERRIDE' },
//     { id: '185', value: 'ANIMATION_ONLY_HASTE' },
//     { id: '186', value: 'NO_PERMANENT_DEATH' },
//     { id: '187', value: 'IMMUNE_TO_TURN_UNDEAD' },
//     { id: '188', value: 'SUMMON_DISABLE_ACTION' },
//     { id: '189', value: 'CHAOS_SHIELD' },
//     { id: '190', value: 'NPC_BUMP' },
//     { id: '191', value: 'USE_ANY_ITEM' },
//     { id: '192', value: 'ASSASSINATE' },
//     { id: '193', value: 'SEX_CHANGED' },
//     { id: '194', value: 'SPELL_FAILURE_INNATE' },
//     { id: '195', value: 'IMMUNE_TO_TRACKING' },
//     { id: '196', value: 'DEAD_MAGIC' },
//     { id: '197', value: 'IMMUNE_TO_TIME_STOP' },
//     { id: '198', value: 'IMMUNE_TO_SEQUESTER' },
//     { id: '199', value: 'STONESKINSGOLEM' },
//     { id: '200', value: 'LEVELDRAIN' },
//     { id: '201', value: 'DONOTDRAW' },
//     { id: '202', value: 'IGNOREDRAINDEATH' },
// ];
