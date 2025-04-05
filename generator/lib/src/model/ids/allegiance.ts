export enum AllegianceIdentifiers {
    /**
     * Used by script actions and triggers. Includes all party-friendly allegiances.
     */
    GOODCUTOFF = 'GOODCUTOFF',
    /**
     * Creatures of same allegiance as party, but uses red (hostile) selection circles. Can not be controlled by the player.
     */
    GOODBUTRED = 'GOODBUTRED',
    /**
     * Creatures of same allegiance as party, but uses blue (neutral) selection circles. Can not be controlled by the player.
     */
    GOODBUTBLUE = 'GOODBUTBLUE',

    /**
     * Used by script actions and triggers. Includes all hostile allegiances.
     */
    EVILCUTOFF = 'EVILCUTOFF',
    /**
     * Hostile creatures, but uses green (friendly) selection circles.
     */
    EVILBUTGREEN = 'EVILBUTGREEN',
    /**
     * Hostile creatures, but uses blue (neutral) selection circles.
     */
    EVILBUTBLUE = 'EVILBUTBLUE',
    /**
     * Creatures that are hostile to the party and allied creatures.
     */
    ENEMY = 'ENEMY',

    ANYONE = 'ANYONE',
    INANIMATE = 'INANIMATE',
    PC = 'PC',
    FAMILIAR = 'FAMILIAR',
    ALLY = 'ALLY',
    CONTROLLED = 'CONTROLLED',
    CHARMED = 'CHARMED',
    REALLYCHARMED = 'REALLYCHARMED',
    /**
     * This is just a separate EA from ENEMY for detection purposes. They're still valid objects for EVILCUTOFF and NearestEnemyOf(), but not by ENEMY. It's not specific to PCs.
     */
    CHARMED_PC = 'CHARMED_PC',
    /**
     * Used by script actions and triggers. Includes everything except party-friendly allegiances.
     */
    NOTGOOD = 'NOTGOOD',
    ANYTHING = 'ANYTHING',
    NEUTRAL = 'NEUTRAL',
    /**
     * Used by neutrals when targetting with enemy-only spells.
     */
    NOTNEUTRAL = 'NOTNEUTRAL',
    /**
     * Used by script actions and triggers. Includes everything except hostile allegiances.
     */
    NOTEVIL = 'NOTEVIL'
}
