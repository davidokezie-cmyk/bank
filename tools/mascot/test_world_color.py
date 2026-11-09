import bpy
import os

def test_world_color():
    # Create a world
    world = bpy.data.worlds.new('Test_World')
    scene = bpy.context.scene
    scene.world = world
    
    # Set up node tree
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    
    # Get Background node
    background = nodes.get('Background')
    if background:
        # Set the Color socket directly
        color_socket = background.inputs['Color']
        # Try different ways to set color
        try:
            color_socket.default_value = (0.01, 0.01, 0.03, 1.0)
            print(f"  Set Color socket default_value: {color_socket.default_value}")
        except Exception as e:
            print(f"  Color socket default_value: FAILED - {e}")
        
        # Try setting via float values
        try:
            color_socket.inputs[0].default_value = 0.01  # R
            color_socket.inputs[1].default_value = 0.01  # G
            color_socket.inputs[2].default_value = 0.03  # B
            color_socket.inputs[3].default_value = 1.0   # A
            print("  Set Color socket inputs: OK")
        except Exception as e:
            print(f"  Color socket inputs: FAILED - {e}")
    
    # Save
    blend_path = os.path.join(os.path.dirname('test_world_color.py'), '..', 'test_world_color.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Blend saved to: {blend_path}')

if __name__ == '__main__':
    test_world_color()