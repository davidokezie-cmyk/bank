import bpy
import os

def main():
    # Clear scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

    # Create body - UV sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(0, 0, 1.0))
    body = bpy.context.active_object
    body.name = 'Body'

    # Add modifiers to body
    mod_bevel = body.modifiers.new(name='Bevel', type='BEVEL')
    mod_bevel.width = 0.08
    mod_bevel.segments = 4

    mod_subdiv = body.modifiers.new(name='Subdiv', type='SUBSURF')
    mod_subdiv.levels = 2
    mod_subdiv.render_levels = 2

    # Create armature
    bpy.ops.object.armature_add(enter_editmode=False, align='WORLD', location=(0, 0, 0))
    armature = bpy.context.active_object
    armature.name = 'Armature'

    # --- Add bones in EDIT mode ---
    bpy.ops.object.mode_set(mode='EDIT')

    bones_data = [
        ('Root', (0, 0, 0)),
        ('Body', (0, 0, 1.0)),
        ('Head', (0, 0, 1.5)),
        ('Arm_L', (0.5, 0, 1.0)),
        ('Arm_R', (-0.5, 0, 1.0)),
        ('Brow', (0.2, 0, 1.3)),
        ('Bag', (0.0, 0.3, 1.2)),
    ]

    for bone_name, default_head in bones_data:
        bone = armature.data.edit_bones.new(name=bone_name)
        bone.head = default_head
        # Set tail based on head direction
        if bone_name == 'Root':
            bone.tail = (0.1, 0, 0)
        elif bone_name == 'Body':
            bone.tail = (0.1, 0, 1.0)
        elif bone_name == 'Head':
            bone.tail = (0.1, 0, 1.5)
        elif bone_name == 'Arm_L':
            bone.tail = (0.6, 0, 1.0)
        elif bone_name == 'Arm_R':
            bone.tail = (0.4, 0, 1.0)
        elif bone_name == 'Brow':
            bone.tail = (0.3, 0, 1.3)
        elif bone_name == 'Bag':
            bone.tail = (0.1, 0.3, 1.2)

    bpy.ops.object.mode_set(mode='OBJECT')

    # Create BlockStack empty (PLAIN_AXES works in Blender 5.3 Alpha)
    bpy.ops.object.empty_add(type='PLAIN_AXES', align='WORLD', location=(2, 0, 0.5))
    block_stack = bpy.context.active_object
    block_stack.name = 'BlockStack'

    # Create 12 blocks
    block_colors = [
        (0.85, 0.54, 0.35), (0.23, 0.68, 0.42), (0.41, 0.27, 0.68),
        (0.97, 0.45, 0.47), (0.64, 0.55, 0.78)
    ]

    for i in range(1, 13):
        bpy.ops.mesh.primitive_cube_add(size=0.15, location=(1.5 + (i % 5) * 0.2, 0, 0.5 + (i // 5) * 0.2))
        block = bpy.context.active_object
        block.name = f'Block_{i:02d}'
        block['is_kobo_block'] = True
        block.parent = block_stack

        mat_name = f'Block_{i-1}_Mat'
        block_mat = bpy.data.materials.new(name=mat_name)
        block_mat.use_nodes = True
        nodes = block_mat.node_tree.nodes
        bsdf = nodes.get('Principled BSDF')
        if bsdf:
            color_idx = (i - 1) % len(block_colors)
            color = block_colors[color_idx]
            bsdf.inputs['Base Color'].default_value = (*color, 1.0)
            bsdf.inputs['Metallic'].default_value = 0.3
            bsdf.inputs['Roughness'].default_value = 0.5
        if block.data.materials:
            block.data.materials.append(block_mat)
        else:
            block.data.materials.append(block_mat)

    # Create body material - gold (using node_tree API, only available inputs)
    body_mat = bpy.data.materials.new(name='Koba_Body_Mat')
    body_mat.use_nodes = True
    nodes = body_mat.node_tree.nodes
    bsdf = nodes.get('Principled BSDF')
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (0.855, 0.755, 0.37, 1.0)
        bsdf.inputs['Metallic'].default_value = 0.85
        bsdf.inputs['Roughness'].default_value = 0.15
    body.data.materials.append(body_mat)

    # Shape keys
    body.shape_key_add(name='Basis', from_mix=False)
    key_blink = body.shape_key_add(name='blink', from_mix=False)
    key_smile = body.shape_key_add(name='smile', from_mix=False)
    key_surprised = body.shape_key_add(name='surprised', from_mix=False)
    key_think = body.shape_key_add(name='think', from_mix=False)

    # World setup
    scene = bpy.context.scene
    world = bpy.data.worlds.new('Koba_World')
    world.use_nodes = True
    background = world.node_tree.nodes['Background']
    background.inputs['Color'].default_value = (0.01, 0.01, 0.03, 1)
    scene.world = world

    # Camera
    bpy.ops.object.camera_add(location=(3, -4, 3), rotation=(1.1, 0, 0.78))
    cam = bpy.context.active_object
    cam.name = 'Koba_Camera'

    # Lights
    bpy.ops.object.light_add(type='SUN', align='WORLD', location=(5, 5, 5))
    sun = bpy.context.active_object
    sun.name = 'Rim_Light'
    sun.data.energy = 3.0
    sun.color = (0.8, 0.5, 1.0, 1.0)

    bpy.ops.object.light_add(type='AREA', align='WORLD', location=(-3, 3, 3))
    moon = bpy.context.active_object
    moon.name = 'Fill_Light'
    moon.data.energy = 1.0
    moon.color = (0.95, 0.95, 0.98, 1.0)

    # Apply modifiers to body
    mesh_objects = [obj for obj in bpy.data.objects if obj.type == 'MESH']
    for obj in mesh_objects:
        for mod in obj.modifiers:
            if mod.type in ('SUBSURF', 'BEVEL', 'MIRROR'):
                bpy.ops.object.modifier_apply(modifier=mod.name)

    # Shade smooth
    for obj in mesh_objects:
        try:
            bpy.ops.object.shade_smooth()
        except Exception:
            pass

    # Save blend file
    blend_path = os.path.join('assets', 'mascot', 'kobo.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    # Use absolute path
    abs_blend_path = os.path.abspath(blend_path)
    bpy.ops.wm.save_as_mainfile(filepath=abs_blend_path)
    print(f'Blend saved to: {abs_blend_path}')

    # Print armature info for verification
    print(f'Armature bones count: {len(armature.data.bones)}')
    for b in armature.data.bones:
        print(f'  - Bone: {b.name}, head: {b.head}, tail: {b.tail}')

    print('Koba build complete!')

if __name__ == '__main__':
    main()