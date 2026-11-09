import bpy
import os

def test_material():
    # Create a material with node tree (Blender 4+/5.x style)
    mat = bpy.data.materials.new(name='Test_Mat')
    mat.use_nodes = True
    
    # Access via node_tree
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    print(f"Material: {mat.name}")
    print(f"  use_nodes: {mat.use_nodes}")
    print(f"  node_tree type: {type(nodes)}")
    
    # Check available node types
    for n in nodes:
        print(f"    Node: {n.name} ({n.type})")
    
    # Try to get Principled BSDF
    bsdf = nodes.get('Principled BSDF')
    if bsdf:
        print(f"  Found Principled BSDF: {bsdf}")
        bsdf.inputs['Base Color'].default_value = (1.0, 0.5, 0.25, 1.0)
        bsdf.inputs['Metallic'].default_value = 0.85
        bsdf.inputs['Roughness'].default_value = 0.15
    else:
        print("  No Principled BSDF found")
        # Try to add one
        try:
            bsdf = nodes.new(type='ShaderNodeBsdfPrincipled')
            bsdf.name = 'Principled_BSDF'
            print(f"  Created Principled BSDF: {bsdf.name}")
            bsdf.inputs['Base Color'].default_value = (1.0, 0.5, 0.25, 1.0)
            bsdf.inputs['Metallic'].default_value = 0.85
            bsdf.inputs['Roughness'].default_value = 0.15
        except Exception as e:
            print(f"  Could not create BSDF: {e}")
    
    # Output node
    output_node = nodes.get('Material Output')
    if output_node:
        print(f"  Found Material Output: {output_node.name}")
        links.new(bsdf.outputs['BSDF'], output_node.inputs['Surface'])
    
    # Save
    blend_path = os.path.join(os.path.dirname('test_material2.py'), '..', 'test_material2.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Blend saved to: {blend_path}')

if __name__ == '__main__':
    test_material()