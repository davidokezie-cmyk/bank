import { describe, it, expect } from 'vitest'
import { readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  MASCOT_ANIMATIONS,
  MASCOT_MORPH_TARGETS,
  MASCOT_NODES,
} from '@/lib/mascot-contract'

const MODELS = ['kobo.glb', 'kobo-lite.glb'] as const
const BUDGET_BYTES: Record<(typeof MODELS)[number], number> = {
  'kobo.glb': 1_200_000,
  'kobo-lite.glb': 500_000,
}

type GltfJson = {
  asset?: { version?: string }
  nodes?: Array<{ name?: string; mesh?: number }>
  meshes?: Array<{
    primitives: Array<{ targets?: unknown[]; extras?: { targetNames?: string[] } }>
    extras?: { targetNames?: string[] }
  }>
  animations?: Array<{ name?: string }>
  images?: unknown[]
  materials?: unknown[]
}

function readGlbJson(file: string): GltfJson {
  const buffer = readFileSync(file)
  expect(buffer.readUInt32LE(0), 'glTF magic number').toBe(0x46546c67)
  const jsonLength = buffer.readUInt32LE(12)
  expect(buffer.readUInt32LE(16), 'first chunk must be JSON').toBe(0x4e4f534a)
  return JSON.parse(buffer.toString('utf8', 20, 20 + jsonLength))
}

describe('Kobo GLB mascot asset contract', () => {
  for (const name of MODELS) {
    describe(name, () => {
      const file = join(process.cwd(), 'public', 'models', name)
      const gltf = readGlbJson(file)

      it('declares glTF 2.0 and stays within the size budget', () => {
        expect(gltf.asset?.version).toBe('2.0')
        expect(statSync(file).size).toBeLessThanOrEqual(BUDGET_BYTES[name])
      })

      it('uses no image textures (procedural flat materials only)', () => {
        expect((gltf.images ?? []).length).toBe(0)
      })

      it('exports every required animation', () => {
        const names = (gltf.animations ?? []).map((animation) => animation.name)
        for (const required of MASCOT_ANIMATIONS) {
          expect(names).toContain(required)
        }
      })

      it('exports every required morph target on the body mesh', () => {
        const nodeToMesh = new Map<number, string>()
        for (const node of gltf.nodes ?? []) {
          if (node.mesh !== undefined && node.name) nodeToMesh.set(node.mesh, node.name)
        }
        const bodyNode = gltf.nodes?.find((node) => node.name === 'Body' && node.mesh !== undefined)
        const body = bodyNode?.mesh === undefined ? undefined : gltf.meshes?.[bodyNode.mesh]
        expect(body, 'Body mesh must exist').toBeDefined()
        const targetNames = body?.extras?.targetNames
          ?? body?.primitives?.flatMap((primitive) => primitive.extras?.targetNames ?? [])
        expect(targetNames).toBeDefined()
        for (const required of MASCOT_MORPH_TARGETS) {
          expect(targetNames).toContain(required)
        }
        // sanity: keep the node->mesh mapping meaningful elsewhere
        expect(nodeToMesh.size).toBeGreaterThan(0)
      })

      it('contains every required node (root, head, block tower)', () => {
        const names = (gltf.nodes ?? []).map((node) => node.name)
        for (const required of MASCOT_NODES) {
          expect(names).toContain(required)
        }
      })
    })
  }
})
