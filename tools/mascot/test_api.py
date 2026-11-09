import bpy
import os

def test_api():
    # Clear scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    
    # Create armature
    bpy.ops.object.armature_add(enter_editmode=False, align='WORLD', location=(0, 0, 0))
    armature = bpy.context.active_object
    armature.name = 'Test_Armature'
    
    # List all bones collection methods/properties
    bones = armature.data.bones
    print("Bones collection RNA type:", bones.rna_type)
    print("\nAll bones methods/properties:")
    for attr in dir(bones):
        if not attr.startswith('__'):
            print(f"  - {attr}")
    
    # Try using get() to access by name
    print("\n--- Testing bones.get() ---")
    for name in ['Root', 'Body', 'Head']:
        bone = bones.get(name)
        print(f"  get('{name}': {bone}")
    
    # Try using keys() and values()
    print("\n--- Testing bones.keys() ---")
    keys = list(bones.keys())[:3]
    print(f"  First 3 keys: {keys}")
    
    # Try foreach methods
    print("\n--- Testing bones.foreach_get ---")
    try:
        locations = []
        bones.foreach_get('matrix', locations)
        print(f"  foreach_get matrix: got {len(locations)} values")
    except Exception as e:
        print(f"  foreach_get error: {e}")
    
    # Try to add bone via operator - enter edit mode first
    print("\n--- Testing edit_bones ---")
    try:
        bpy.ops.object.mode_set(mode='EDIT')
        edit_bones = armature.data.edit_bones
        print(f"  edit_bones type: {type(edit_bones)}")
        print(f"  edit_bones dir: {[x for x in dir(edit_bones) if not x.startswith('__')][:10]}")
        
        # Try edit_bones.new
        try:
            bone = edit_bones.new(name='EditBone_Test')
            print(f"  edit_bones.new: SUCCESS - {bone.name}")
        except AttributeError as e:
            print(f"  edit_bones.new: FAILED - {e}")
        
        # Try adding bone with location
        if hasattr(edit_bones, 'new'):
            bone2 = edit_bones.new(name='EditBone_Test2')
            bone2.head = (0, 0, 0)
            bone2.tail = (0, 0, 1)
            print(f"  Set head/tail: OK")
        
        bpy.ops.object.mode_set(mode='OBJECT')
    except Exception as e:
        print(f"  edit_bones test error: {e}")
    
    # Save blend
    blend_path = os.path.join(os.path.dirname('test_api.py'), '..', 'test_api.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'\nBlend saved to: {blend_path}')

if __name__ == '__main__':
    test_api()