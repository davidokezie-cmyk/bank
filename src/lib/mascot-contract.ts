/**
 * Mascot Asset Contract for Kobo.
 * 
 * Documented in 04-DESIGN-BRIEF.md and encoded here for programmatic validation.
 * This contract defines the expected structure of the Koba GLB assets.
 * 
 * When Bforartists is available, both kobo.glb and kobo-lite.glb must satisfy
 * this contract. The Vitest test tests/mascot-contract.test.ts parses the GLB's
 * JSON chunk (no WebGL needed) and fails if anything is missing.
 * 
 * In procedural fallback mode, this contract serves as documentation only,
 * and the Vitest test is skipped (no GLB to parse).
 */

// Animations that must exist in the GLB
export const MASCOT_ANIMATIONS = ['Idle', 'Wave', 'Celebrate', 'Think', 'HopIn'] as const

// Morph targets (shape keys) that must exist in the GLB
export const MASCOT_MORPH_TARGETS = ['blink', 'smile', 'surprised', 'think'] as const

// Nodes that must exist in the GLB
export const MASCOT_NODES = [
  'Kobo_Root',
  'Head',
  'BlockStack',
  'Block_01',
  'Block_02',
  'Block_03',
  'Block_04',
  'Block_05',
  'Block_06',
  'Block_07',
  'Block_08',
  'Block_09',
  'Block_10',
  'Block_11',
  'Block_12',
] as const

// Valid moods for Koba
export type KobaMood = 'idle' | 'wave' | 'celebrate' | 'thinking'

// Valid member colors for joint pot block towers
export const MEMBER_COLORS = [
  '#8B5CF6', // violet
  '#F5B83D', // gold
  '#2BD67B', // naira green
  '#F87171', // coral
  '#A5A3C4', // muted
] as const

// Block colors per member (for joint pot visualisation)
export const BLOCK_COLORS_PER_MEMBER = [
  '#F5B83D', // gold - member 1
  '#2BD67B', // green - member 2
  '#8B5CF6', // violet - member 3
  '#F87171', // coral - member 4
  '#EC4899', // pink - member 5
] as const