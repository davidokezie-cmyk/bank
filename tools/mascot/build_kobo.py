#!/usr/bin/env python3
"""
build_kobo.py - Builds Kobo from primitives in Bforartists.

Kobo: a rounded gold coin body, dark glossy eyes, coral cheeks, a U-shaped
smile, a slate backpack strap pulling a tiny bag, and a tower of 12 building
blocks (goal progress) next to him. Origin at the feet, faces -Y in Blender
(which exports as +Z in glTF space with export_yup).

Pipeline order: build_kobo.py -> animate_kobo.py -> export_kobo.py
Usage: bforartists --background --factory-startup --python-exit-code 1 --python tools/mascot/build_kobo.py
"""

import bpy
import bmesh
import os
import math


def make_material(name, base_color, metallic, roughness):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get('Principled BSDF')
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*base_color, 1.0)
        bsdf.inputs['Metallic'].default_value = metallic
        bsdf.inputs['Roughness'].default_value = roughness
    return mat


def main():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for block in list(bpy.data.objects):
        if block.type == 'MESH':
            bpy.data.objects.remove(block, do_unlink=True)

    gold_mat = make_material('Kobo_Gold', (0.89, 0.71, 0.32), 0.85, 0.22)
    eye_mat = make_material('Kobo_Eye', (0.04, 0.03, 0.02), 0.0, 0.1)
    cheek_mat = make_material('Kobo_Cheek', (0.88, 0.38, 0.37), 0.0, 0.6)
    slate_mat = make_material('Kobo_Slate', (0.274, 0.325, 0.428), 0.1, 0.75)

    # Block palette: gold, naira green, steel, coral, sand
    block_palette = [
        (0.89, 0.71, 0.32),
        (0.2, 0.82, 0.48),
        (0.36, 0.42, 0.55),
        (0.88, 0.38, 0.37),
        (0.79, 0.54, 0.17),
    ]

    # ============================================================
    # Body - gold coin sphere at feet origin
    # ============================================================
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, segments=48, ring_count=24, location=(0, 0, 0.5))
    body = bpy.context.active_object
    body.name = 'Body'
    bevel = body.modifiers.new(name='Bevel', type='BEVEL')
    bevel.width = 0.06
    bevel.segments = 3
    subdiv = body.modifiers.new(name='Subdiv', type='SUBSURF')
    subdiv.levels = 2
    subdiv.render_levels = 2
    body.data.materials.append(gold_mat)

    # ============================================================
    # Face - eyes, cheeks, smile (the U-arc)
    # ============================================================
    for side in (1, -1):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06, segments=24, ring_count=12, location=(0.17 * side, -0.43, 0.62))
        eye = bpy.context.active_object
        eye.name = 'Eye_L' if side == 1 else 'Eye_R'
        eye.scale = (1.0, 0.45, 1.25)
        eye.data.materials.append(eye_mat)

    for side in (1, -1):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.055, segments=16, ring_count=8, location=(0.29 * side, -0.41, 0.44))
        cheek = bpy.context.active_object
        cheek.name = 'Cheek_L' if side == 1 else 'Cheek_R'
        cheek.scale = (1.0, 0.4, 0.6)
        cheek.data.materials.append(cheek_mat)

    # Smile: torus arc, upper half deleted -> U shape
    bpy.ops.mesh.primitive_torus_add(
        major_segments=24,
        minor_segments=8,
        mode='MAJOR_MINOR',
        major_radius=0.16,
        minor_radius=0.028,
        location=(0, -0.42, 0.4),
        rotation=(math.radians(90), 0, 0),
    )
    smile = bpy.context.active_object
    smile.name = 'Smile'
    smile.data.materials.append(eye_mat)

    bm = bmesh.new()
    bm.from_mesh(smile.data)
    bm.verts.ensure_lookup_table()
    # In torus local space (before rotation), the circle lies in XY.
    # Delete y > 0 to keep the lower arc = a smile.
    to_delete = [v for v in bm.verts if v.co.y > 0.001]
    bmesh.ops.delete(bm, geom=to_delete, context='VERTS')
    bm.to_mesh(smile.data)
    bm.free()

    # ============================================================
    # Strap + bag - slate, diagonal over the shoulder
    # ============================================================
    bpy.ops.mesh.primitive_torus_add(
        major_segments=32,
        minor_segments=10,
        mode='MAJOR_MINOR',
        major_radius=0.37,
        minor_radius=0.05,
        location=(0.06, 0, 0.5),
        rotation=(math.radians(90), 0, math.radians(32)),
    )
    strap = bpy.context.active_object
    strap.name = 'Strap'
    strap.scale = (1.0, 1.0, 1.25)
    strap.data.materials.append(slate_mat)

    bpy.ops.mesh.primitive_cube_add(size=0.22, location=(0.33, 0.02, 0.3))
    bag = bpy.context.active_object
    bag.name = 'Bag'
    bevel = bag.modifiers.new(name='Bevel', type='BEVEL')
    bevel.width = 0.04
    bevel.segments = 2
    bag.data.materials.append(slate_mat)

    # ============================================================
    # Armature - Kobo_Root with Root/Body/Head bones
    # ============================================================
    bpy.ops.object.armature_add(enter_editmode=False, align='WORLD', location=(0, 0, 0))
    armature = bpy.context.active_object
    armature.name = 'Kobo_Root'

    # Remove the default bone, then add ours
    bpy.ops.object.mode_set(mode='EDIT')
    edit_bones = armature.data.edit_bones
    for bone in list(edit_bones):
        edit_bones.remove(bone)

    bones_data = [
        ('Root', (0, 0, 0), (0, 0, 0.15)),
        ('Body', (0, 0, 0.15), (0, 0, 0.55)),
        ('Head', (0, 0, 0.55), (0, 0, 0.95)),
        ('Arm_L', (0.42, 0, 0.5), (0.55, 0, 0.5)),
        ('Arm_R', (-0.42, 0, 0.5), (-0.55, 0, 0.5)),
    ]
    for bone_name, head, tail in bones_data:
        bone = edit_bones.new(name=bone_name)
        bone.head = head
        bone.tail = tail

    bpy.ops.object.mode_set(mode='OBJECT')

    # Empty named 'Head' (contract requires the node)
    bpy.ops.object.empty_add(type='PLAIN_AXES', align='WORLD', location=(0, 0, 0.85))
    head_empty = bpy.context.active_object
    head_empty.name = 'Head'
    head_empty.parent = armature

    # ============================================================
    # BlockStack - 12 blocks in a wobbly tower (goal progress)
    # ============================================================
    bpy.ops.object.empty_add(type='PLAIN_AXES', align='WORLD', location=(0.72, 0, 0.0))
    block_stack = bpy.context.active_object
    block_stack.name = 'BlockStack'

    import random
    rng = random.Random(42)
    block_size = 0.15

    cols = 2
    rows = 6
    for index in range(rows * cols):
        row = index // cols
        col = index % cols
        x = (col - 0.5) * (block_size + 0.02)
        x += rng.uniform(-0.012, 0.012)
        z = block_size / 2 + row * (block_size + 0.008)
        bpy.ops.mesh.primitive_cube_add(size=block_size, location=(x, rng.uniform(-0.01, 0.01), z))
        block = bpy.context.active_object
        block.name = f'Block_{index + 1:02d}'
        block['is_kobo_block'] = True
        block.parent = block_stack
        mat = make_material(f'Block_{index + 1}_Mat', block_palette[index % len(block_palette)], 0.2, 0.55)
        block.data.materials.append(mat)

    # ============================================================
    # Shape keys (morph targets required by the contract)
    # ============================================================
    body.shape_key_add(name='Basis', from_mix=False)
    body.shape_key_add(name='blink', from_mix=False)
    body.shape_key_add(name='smile', from_mix=False)
    body.shape_key_add(name='surprised', from_mix=False)
    body.shape_key_add(name='think', from_mix=False)

    # ============================================================
    # World, camera, lights
    # ============================================================
    scene = bpy.context.scene
    world = bpy.data.worlds.new('Kobo_World')
    world.use_nodes = True
    background = world.node_tree.nodes['Background']
    background.inputs['Color'].default_value = (0.008, 0.01, 0.025, 1)
    scene.world = world

    bpy.ops.object.camera_add(location=(2.6, -3.2, 1.35), rotation=(math.radians(78), 0, math.radians(38)))
    cam = bpy.context.active_object
    cam.name = 'Kobo_Camera'

    bpy.ops.object.light_add(type='SUN', align='WORLD', location=(5, -6, 7))
    sun = bpy.context.active_object
    sun.name = 'Rim_Light'
    sun.data.energy = 3.5
    sun.color = (1.0, 0.87, 0.62, 1.0)  # warm gold rim

    bpy.ops.object.light_add(type='AREA', align='WORLD', location=(-4, -3, 4))
    area = bpy.context.active_object
    area.name = 'Fill_Light'
    area.data.energy = 250.0
    area.color = (0.9, 0.93, 1.0, 1.0)

    # ============================================================
    # Apply modifiers, shade smooth, save
    # ============================================================
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']
    for obj in mesh_objects:
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        try:
            bpy.ops.object.shade_smooth()
        except Exception:
            pass

    blend_path = os.path.join('assets', 'mascot', 'kobo.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    abs_blend_path = os.path.abspath(blend_path)
    bpy.ops.wm.save_as_mainfile(filepath=abs_blend_path)
    print(f'Blend saved to: {abs_blend_path}')
    print(f'Armature bones: {[b.name for b in armature.data.bones]}')
    print('Kobo build complete!')


if __name__ == '__main__':
    main()
