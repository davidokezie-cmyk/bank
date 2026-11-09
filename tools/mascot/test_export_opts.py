import bpy
import os

def test_export_opts():
    # Create a simple object with a shape key
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 0, 0))
    obj = bpy.context.active_object
    obj.name = 'Test_Object'
    
    # Add a shape key
    obj.shape_key_add(name='Basis')
    obj.shape_key_add(name='blink')
    obj.shape_key_add(name='smile')
    
    # Test export with different option names
    test_path = os.path.join(os.path.dirname('test_export_opts.py'), '..', 'test_opts.glb')
    
    # Try export with export_shape_keys
    try:
        bpy.ops.export_scene.gltf(
            filepath=test_path,
            export_format='GLB',
            use_selection=True,
            export_materials='NONE',
            export_animations=False,
            export_shape_keys=True,  # Try this name
            export_yup=True,
            export_apply=True,
            export_textures=False,
        )
        print(f"export_shape_keys: SUCCESS - file size: {os.path.getsize(test_path)} bytes")
    except Exception as e:
        print(f"export_shape_keys: FAILED - {e}")
    
    # Try export with export_morph_targets
    try:
        bpy.ops.export_scene.gltf(
            filepath=test_path,
            export_format='GLB',
            use_selection=True,
            export_materials='NONE',
            export_animations=False,
            export_morph_targets=True,
            export_yup=True,
            export_apply=True,
            export_textures=False,
        )
        print(f"export_morph_targets: SUCCESS - file size: {os.path.getsize(test_path)} bytes")
    except Exception as e:
        print(f"export_morph_targets: FAILED - {e}")
    
    # List available export options
    print("\nTrying to list glTF export properties...")
    try:
        # Get the glTF exporter property table
        prop = bpy.types.OBJECT_PT_gltf_prop
        print("glTF properties available")
    except:
        print("Could not list properties")
    
    # Save blend
    blend_path = os.path.join(os.path.dirname('test_export_opts.py'), '..', 'test_export_opts.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Blend saved to: {blend_path}')

if __name__ == '__main__':
    test_export_opts()