import bpy
import os

def test_world():
    # Create a world
    world = bpy.data.worlds.new('Test_World')
    scene = bpy.context.scene
    scene.world = world
    
    # Set up node tree
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    
    print("World nodes:")
    for n in nodes:
        print(f"  {n.name}: {n.type}")
    
    # Get Background node
    background = nodes.get('Background')
    if background:
        print(f"\nBackground node: {background}")
        print(f"  Type: {type(background)}")
        # Try to set color
        try:
            # Method 1: input_color
            background.input_color = (0.1, 0.1, 0.2, 1.0)
            print("  input_color: SET")
        except AttributeError as e:
            print(f"  input_color: FAILED - {e}")
        
        # Method 2: try input_socket
        try:
            socket = background.inputs['Color']
            print(f"  Color socket type: {type(socket)}")
        except:
            pass
        
        # Method 3: try setting via output
        try:
            output = nodes.get('World Output')
            if output:
                print(f"  World Output found")
                # Try connecting
                links.new(background.outputs[0], output.inputs[0])
                print("  Linked Background -> World Output")
        except Exception as e:
            print(f"  Link error: {e}")
    
    # Save
    blend_path = os.path.join(os.path.dirname('test_world.py'), '..', 'test_world.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Blend saved to: {blend_path}')

if __name__ == '__main__':
    test_world()