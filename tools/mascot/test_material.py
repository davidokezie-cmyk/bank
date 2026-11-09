import bpy
import os

def test_material():
    # Create a simple material without nodes
    mat = bpy.data.materials.new(name='Test_Mat')
    mat.use_nodes = False  # Disable nodes
    
    # Try setting colors directly
    mat.diffuse_color = (1.0, 0.5, 0.25, 1.0)
    mat.diffuse_shader = 'LAMBERT'
    mat.diffuse_intensity = 1.0
    
    # Add to an object
    bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.data.materials.append(mat)
    
    print(f"Material created: {mat.name}")
    print(f"  use_nodes: {mat.use_nodes}")
    print(f"  diffuse_color: {mat.diffuse_color}")
    
    # Try with use_nodes = True but old API
    try:
        mat2 = bpy.data.materials.new(name='Test_Mat2')
        mat2.use_nodes = True
        # Try old node access
        nodes = mat2.node_tree.nodes
        print(f"  node_tree nodes type: {type(nodes)}")
        for n in nodes:
            print(f"    - {n.name}: {type(n)}")
    except Exception as e:
        print(f"  Node setup error: {e}")
    
    # Save
    blend_path = os.path.join(os.path.dirname('test_material.py'), '..', 'test_material.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Blend saved to: {blend_path}')

if __name__ == '__main__':
    test_material()