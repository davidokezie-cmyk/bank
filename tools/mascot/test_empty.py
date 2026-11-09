import bpy
import os

def test_empty():
    # Clear scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    
    # Try different empty types
    empty_types = ['PLAIN_AXES', 'ARROWS', 'SINGLE_ARROW', 'CIRCLE', 'CUBE', 'SPHERE', 'CONE', 'IMAGE']
    
    for etype in empty_types:
        try:
            bpy.ops.object.empty_add(type=etype, align='WORLD', location=(0, 0, 0))
            print(f"  {etype}: SUCCESS")
            # Rename and get
            obj = bpy.context.active_object
            obj.name = f'Empty_Test_{etype}'
        except Exception as e:
            print(f"  {etype}: FAILED - {e}")
    
    # Also try via data API
    try:
        empty = bpy.data.objects.new('Empty_Data', None)
        empty.empty_type = 'SPHERE'
        bpy.context.collection.objects.link(empty)
        print("Data API empty: SUCCESS")
    except Exception as e:
        print(f"Data API empty: FAILED - {e}")
    
    # Save
    blend_path = os.path.join(os.path.dirname('test_empty.py'), '..', 'test_empty.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Blend saved to: {blend_path}')

if __name__ == '__main__':
    test_empty()