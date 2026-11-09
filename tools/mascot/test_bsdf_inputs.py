import bpy
import os

def test_bsdf_inputs():
    # Create material with nodes
    mat = bpy.data.materials.new(name='Test_Mat')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    
    # Get Principled BSDF
    bsdf = nodes.get('Principled BSDF')
    if bsdf:
        print("Principled BSDF inputs (by string key):")
        # Try common input names
        test_keys = ['Base Color', 'Metallic', 'Roughness', 'IOR', 'Alpha', 'Emission', 
                     'Normal', 'Subsurface', 'Sheen', 'Clearcoat', 'Sheen Weight',
                     'Coat Weight', 'Anisotropic', 'Transmission', 'Roughness']
        
        for key in test_keys:
            try:
                val = bsdf.inputs[key].default_value
                print(f"  {key}: {val}")
            except (KeyError, TypeError) as e:
                print(f"  {key}: NOT FOUND - {e}")
        
        # Also try iterating through inputs collection
        print("\n  Available via .inputs collection:")
        for inp in bsdf.inputs:
            try:
                print(f"    {inp.name}: {inp.default_value}")
            except:
                print(f"    {inp}: (no name/value)")
    else:
        print("No Principled BSDF found")
    
    # Save
    blend_path = os.path.join(os.path.dirname('test_bsdf_inputs.py'), '..', 'test_bsdf_inputs.blend')
    os.makedirs(os.path.dirname(blend_path), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f'Blend saved to: {blend_path}')

if __name__ == '__main__':
    test_bsdf_inputs()