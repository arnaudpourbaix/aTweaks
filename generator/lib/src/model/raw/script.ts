import { RawTargetList } from "./target";

export interface Statements {
    list: ConditionalStatement[];
}

export interface ConditionalStatement {
    comment?: string;
    target?: RawTargetList;
    triggers: (Trigger | OrTrigger)[];
    responses: Response[];
}

export interface BasicStatement {
    triggers: Trigger[];
    actions: Action[];
}

export interface Response {
    weight: number;
    actions: Action[];
}

export type ActionType = 'Attack' | 'AttackOneRound' | 'AttackReevaluate' | 'Enemy' | 'Ally' | 'ChangeEnemyAlly' | 'MoveToObject' | 'MoveToObjectFollow' | 'MoveToObjectNoInterrupt' | 'RunAwayFrom' | 'RunAwayFromNoInterruptNoLeaveArea' | 'RunAwayFromNoLeaveArea' | 'RunAwayFromNoInterrupt' | 'RandomWalk' | 'RandomWalkTime' | 'RandomWalkContinuousTime' | 'RandomWalkContinuous' | 'SetGlobal' | 'AddGlobals' | 'IncrementGlobal' | 'StartTimer' | 'SetGlobalTimer' | 'Spell' | 'SpellRES' | 'SpellPoint' | 'SpellPointRES' | 'ForceSpell' | 'ForceSpellRES' | 'ForceSpellRES' | 'ForceSpellPoint' | 'ForceSpellPointRES' | 'ForceSpellPointRES' | 'ForceSpellRange' | 'ForceSpellRangeRES' | 'ForceSpellPointRange' | 'ForceSpellPointRangeRES' | 'SpellNoDec' | 'SpellNoDecRES' | 'SpellPointNoDec' | 'SpellPointNoDecRES' | 'ReallyForceSpellPoint' | 'ReallyForceSpellPointRES' | 'ReallyForceSpell' | 'ReallyForceSpellRES' | 'ApplySpell' | 'ApplySpellRES' | 'RemoveSpell' | 'RemoveSpellRES' | 'ReallyForceSpellDead' | 'ReallyForceSpellDeadRES' | 'EquipItem' | 'UseItem' | 'SelectWeaponAbility' | 'EquipMostDamagingMelee' | 'EquipRanged' | 'GiveOrder' | 'Help' | 'Hide' | 'Panic' | 'Turn' | 'Rest' | 'Shout' | 'DestroySelf' | 'Kill' | 'DisplayString' | 'ChangeClass' | 'ChangeAnimation' | 'GlobalShout' | 'Calm' | 'DisplayStringHead' | 'AddKit' | 'ApplyDamage' | 'ApplyDamagePercent' | 'NoAction' | 'ClearActions' | 'Continue' | 'Wait' | 'SmallWait' | 'SetInterrupt';
export type TriggerType = 'HaveSpell' | 'HaveSpellRES' | 'HaveAnySpells' | 'SpellCast' | 'SpellCastRES' | 'SpellCastOnMe' | 'SpellCastOnMeRES' | 'SpellCastPriest' | 'SpellCastPriestRES' | 'SpellCastInnate' | 'SpellCastInnateRES' | 'HaveKnownSpell' | 'HaveKnownSpellRES' | 'HasWeaponEquiped' | 'HasItem' | 'HasItemType' | 'NumItems' | 'NumItemsGT' | 'NumItemsLT' | 'NumItemsParty' | 'NumItemsPartyGT' | 'NumItemsPartyLT' | 'HasItemEquiped' | 'HasItemSlot' | 'CheckItemSlot' | 'CurrentAmmo' | 'Global' | 'GlobalGT' | 'GlobalLT' | 'GlobalsEqual' | 'GlobalsGT' | 'GlobalsLT' | 'LocalsEqual' | 'LocalsGT' | 'LocalsLT' | 'GlobalTimerExpired' | 'GlobalTimerNotExpired' | 'TimerExpired' | 'RealGlobalTimerExact' | 'RealGlobalTimerExpired' | 'RealGlobalTimerNotExpired' | 'HP' | 'HPGT' | 'HPLT' | 'HPPercent' | 'HPPercentLT' | 'HPPercentGT' | 'OnCreation' | 'ActuallyInCombat' | 'CombatCounter' | 'CombatCounterLT' | 'CombatCounterGT' | 'AttackedBy' | 'HitBy' | 'TookDamage' | 'DamageTaken' | 'DamageTakenGT' | 'DamageTakenLT' | 'Help' | 'Heard' | 'InWeaponRange' | 'CanEquipRanged' | 'IsWeaponRanged' | 'WeaponEffectiveVs' | 'WeaponCanDamage' | 'Level' | 'LevelGT' | 'LevelLT' | 'ClassLevel' | 'ClassLevelGT' | 'ClassLevelLT' | 'LOS' | 'Exists' | 'See' | 'Detect' | 'BecameVisible' | 'Range' | 'TargetUnreachable' | 'NumCreature' | 'NumCreatureLT' | 'NumCreatureGT' | 'NumCreatureVsParty' | 'NumInParty' | 'NumInPartyGT' | 'NumInPartyLT' | 'NumInPartyAlive' | 'NumInPartyAliveGT' | 'NumInPartyAliveLT' | 'Killed' | 'Die' | 'Died' | 'Dead' | 'CheckStat' | 'CheckStatGT' | 'CheckStatLT' | 'StateCheck' | 'NotStateCheck' | 'ExtendedStateCheck' | 'CheckSpellState' | 'Alignment' | 'Allegiance' | 'General' | 'Race' | 'Gender' | 'Class' | 'OriginalClass' | 'Kit' | 'Morale' | 'MoraleGT' | 'MoraleLT' | 'Name' | 'HasBounceEffects' | 'HasImmunityEffects' | 'ImmuneToSpellLevel' | 'CanTurn' | 'TurnedBy' | 'AreaType' | 'InMyArea' | 'InMyGroup' | 'InParty' | 'True' | 'False' | 'ActionListEmpty' | 'Delay' | 'ReceivedOrder' | 'RandomNum' | 'RandomNumGT' | 'RandomNumLT' | 'IsActive';

export interface Action extends Parameter {
    name: ActionType;
}

export interface Trigger extends Parameter {
    name: TriggerType;
    negation?: boolean;
}

export interface Parameter {
    params?: (string | number)[];
}

export interface OrTrigger {
    triggers: Trigger[];
}

export interface MultipleStatementTrigger {
    comment: string;
    triggers: Trigger[];
}

export interface CustomCode {
    location: CustomCodeLocation;
    type: CustomCodeType;
    statements: Statements;
}

export type CustomCodeLocation = 'destroyUponDeath'
    | 'init'
    | 'rest'
    | 'turnHostile'
    | 'detectCombat'
    | 'listenToShouts'
    | 'trackTargets'
    | 'attack'
    | 'handlePanic'
    | 'followSummoner'
    | 'creatureAbilities'
    | 'randomWalkNoCombat'
    | 'randomWalkCombat'
    | 'noActionOutsideOfCombat';

export type CustomCodeType = 'insertBefore' | 'insertAfter' | 'replace';