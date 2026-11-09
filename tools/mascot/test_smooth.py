import bpy
import os

def test_smooth():
    # Create a UV sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = 'Test_Sphere'
    
    print(f"Object name: {obj.name}")
    print(f"Object type: {obj.type}")
    print(f"Data name: {obj.data.name}")
    
    # Try different ways to smooth shade
    try:
        obj.shade_smooth()
        print("  obj.shade_smooth(): SUCCESS")
    except AttributeError as e:
        print(f"  obj.shade_smooth(): FAILED - {e}")
    
    try:
        bpy.ops.object.shade_smooth()
        print("  bpy.ops.object.shade_smooth(): SUCCESS")
    except Exception as e:
        print(f"  bpy.ops.object.shade_smooth(): FAILED - {e}")
    
    try:
        obj.data.use_smooth = True
        print("  obj.data.use_smooth = True: SUCCESS")
    except Exception as e:
        print(f"  obj.data.use_smooth = True: FAILED - {e}")
    
    # Save
    blend_path = os.path.join(os.path.dirname('test_smooth.py'), '..', 'test_smooth.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Blend saved to: {blend_path}')

if __name__ == '__main__':
    test_smooth()