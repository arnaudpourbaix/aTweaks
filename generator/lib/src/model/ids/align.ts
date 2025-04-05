export enum AlignIdentifiers {
    NONE = 'NONE',
    LAWFUL_GOOD = 'LAWFUL_GOOD',
    LAWFUL_NEUTRAL = 'LAWFUL_NEUTRAL',
    LAWFUL_EVIL = 'LAWFUL_EVIL',
    NEUTRAL_GOOD = 'NEUTRAL_GOOD',
    NEUTRAL = 'NEUTRAL',
    NEUTRAL_EVIL = 'NEUTRAL_EVIL',
    CHAOTIC_GOOD = 'CHAOTIC_GOOD',
    CHAOTIC_NEUTRAL = 'CHAOTIC_NEUTRAL',
    CHAOTIC_EVIL = 'CHAOTIC_EVIL',
    MASK_GOOD = 'MASK_GOOD',
    MASK_GENEUTRAL = 'MASK_GENEUTRAL',
    MASK_EVIL = 'MASK_EVIL',
    MASK_LAWFUL = 'MASK_LAWFUL',
    MASK_LCNEUTRAL = 'MASK_LCNEUTRAL',
    MASK_CHAOTIC = 'MASK_CHAOTIC'
}

export const alignIds = [
    { id: '0x00', value: 'NONE' },
    { id: '0x11', value: 'LAWFUL_GOOD' },
    { id: '0x12', value: 'LAWFUL_NEUTRAL' },
    { id: '0x13', value: 'LAWFUL_EVIL' },
    { id: '0x21', value: 'NEUTRAL_GOOD' },
    { id: '0x22', value: 'NEUTRAL' },
    { id: '0x23', value: 'NEUTRAL_EVIL' },
    { id: '0x31', value: 'CHAOTIC_GOOD' },
    { id: '0x32', value: 'CHAOTIC_NEUTRAL' },
    { id: '0x33', value: 'CHAOTIC_EVIL' },
    { id: '0x01', value: 'MASK_GOOD' },
    { id: '0x02', value: 'MASK_GENEUTRAL' },
    { id: '0x03', value: 'MASK_EVIL' },
    { id: '0x10', value: 'MASK_LAWFUL' },
    { id: '0x20', value: 'MASK_LCNEUTRAL' },
    { id: '0x30', value: 'MASK_CHAOTIC' }
];