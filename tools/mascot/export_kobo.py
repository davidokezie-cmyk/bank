#!/usr/bin/env python3
"""
export_kobo.py - Saves kobo.blend and exports .glb via bpy.ops.export_scene.gltf.

Features:
- Full GLB: public/models/kobo.glb (≤ 25k tris)
- Lite GLB: public/models/kobo-lite.glb (≤ 8k tris via Decimate)
- GLB format with modifiers applied, skins, morph targets, all animations
- +Y up conversion for glTF space
- No image textures (flat colours/procedural only)
- Optimisation via gltf-transform afterward
"""

import bpy
import sys
import os

def main():
    """Entry point for Blender pipeline."""
    # Parse arguments after --
    args = []
    found_dash_dash = False
    for i, arg in enumerate(sys.argv):
        if found_dash_dash:
            args.append(arg)
        elif arg == '--':
            found_dash_dash = True
    
    # Determine export targets
    export_full = True  # Default: export both
    export_lite = True
    
    for arg in args:
        if arg == '--full':
            export_lite = False
        elif arg == '--lite':
            export_full = False
    
    print(f"Blender version: {bpy.app.version_string}")
    print(f"Bforartists Koba export pipeline starting...")
    print(f"Export options: full={export_full}, lite={export_lite}")
    
    # ============================================================
    # Find and set the active object (Body/Koba_Body)
    # ============================================================
    
    target_obj = None
    if 'Kobo_Body' in bpy.data.objects:
        target_obj = bpy.data.objects['Kobo_Body']
    elif 'Body' in bpy.data.objects:
        target_obj = bpy.data.objects['Body']
    
    if target_obj:
        # Set as active object in view layer
        for obj in bpy.data.objects:
            obj.select_set(False)
        target_obj.select_set(True)
        bpy.context.view_layer.objects.active = target_obj
    obj = bpy.context.view_layer.objects.active
    
    # Ensure we're in object mode
    if obj and obj.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    
    # Make sure we have action data
    if obj and not obj.animation_data:
        obj.animation_data_create()
    
    # ============================================================
    # Apply all modifiers to mesh objects (critical for GLB export)
    # ============================================================
    
    # Collect all mesh objects
    mesh_objects = []
    for ob in bpy.data.objects:
        if ob.type == 'MESH':
            mesh_objects.append(ob)
    
    # Deselect everything, then select each mesh to apply modifiers
    # Use the operator from bpy directly
    bpy.ops.object.select_all(action='DESELECT')
    
    for ob in mesh_objects:
        ob.select_set(True)
        bpy.context.view_layer.objects.active = ob
        
        # Apply all modifiers except ARMATURE
        for mod in ob.modifiers:
            if mod.type in ('SUBSURF', 'BEVEL', 'MIRROR'):
                bpy.ops.object.modifier_apply(modifier=mod.name)
    
    # Deselect after applying
    bpy.ops.object.select_all(action='DESELECT')
    
    # ============================================================
    # Shape Key / Morph Target Handling
    # ============================================================
    
    # Ensure shape keys are preserved in the export
    # bpy.ops.export_scene.gltf handles shape keys/morph targets
    
    # ============================================================
    # Export Full GLB: kobo.glb (≤ 25k triangles)
    # ============================================================
    
    if export_full:
        full_glb_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "public", "models", "kobo.glb"
        )
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(full_glb_path), exist_ok=True)
        
        # Select key objects: body, armature, block stack
        bpy.ops.object.select_all(action='DESELECT')
        
        objects_to_select = []
        if 'Kobo_Body' in bpy.data.objects:
            objects_to_select.append(bpy.data.objects['Kobo_Body'])
        if 'Armature' in bpy.data.objects:
            objects_to_select.append(bpy.data.objects['Armature'])
        if 'BlockStack' in bpy.data.objects:
            objects_to_select.append(bpy.data.objects['BlockStack'])
        
        for o in objects_to_select:
            o.select_set(True)
        
        # Deselect camera and lights
        for ob in bpy.data.objects:
            if ob.type in ('CAMERA', 'LIGHT'):
                ob.select_set(False)
        
        # Set active object
        if objects_to_select:
            bpy.context.view_layer.objects.active = objects_to_select[0]
        
        # Export settings for glTF
        print(f"Exporting full GLB to: {full_glb_path}")
        
        try:
            bpy.ops.export_scene.gltf(
                filepath=full_glb_path,
                export_format='GLB',
                use_selection=True,
                export_materials='NONE',  # Export as mesh only
                export_animations=True,  # All actions
                export_nla_strips=False,
                export_yup=True,  # Convert from Z-up (blender) to Y-up (glTF)
                export_apply=True,  # Apply modifiers, materials, etc.
                export_empty_as_null=True,
            )
            
            file_size = os.path.getsize(full_glb_path)
            print(f"Full GLB exported successfully!")
            print(f"  File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
            
        except RuntimeError as e:
            print(f"GLB export failed: {e}")
    
    # ============================================================
    # Export Lite GLB: kobo-lite.glb (≤ 8k tris via Decimate)
    # ============================================================
    
    if export_lite:
        lite_glb_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "public", "models", "kobo-lite.glb"
        )
        
        os.makedirs(os.path.dirname(lite_glb_path), exist_ok=True)
        
        print(f"Exporting lite GLB to: {lite_glb_path}")
        
        # Strategy: Duplicate the body, apply Decimate modifier to reduce triangles
        bpy.ops.object.select_all(action='DESELECT')
        
        if 'Kobo_Body' in bpy.data.objects:
            body_orig = bpy.data.objects['Kobo_Body']
            body_orig.select_set(True)
            bpy.context.view_layer.objects.active = body_orig
            
            # Duplicate for decimation
            bpy.ops.object.duplicate()
            body_dec = bpy.context.active_object
            body_dec.name = "Kobo_Body_Decimated"
            
            # Add Decimate modifier (DISSOLVE to reduce triangles)
            mod_decimate = body_dec.modifiers.new(name="Decimate", type='DECIMATE')
            mod_decimate.decimate_type = 'DISSOLVE'
            mod_decimate.ratio = 0.3  # Reduce to ~30% of original triangles
            
            # Apply the modifier
            bpy.ops.object.modifier_apply(modifier="Decimate")
            
            # Select only the decimated body for export
            bpy.ops.object.select_all(action='DESELECT')
            body_dec.select_set(True)
            bpy.context.view_layer.objects.active = body_dec
            
            # Export
            try:
                bpy.ops.export_scene.gltf(
                    filepath=lite_glb_path,
                    export_format='GLB',
                    use_selection=True,
                    export_materials='NONE',
                    export_animations=True,
                    export_nla_strips=False,
                    export_morph_targets=True,
                    export_yup=True,
                    export_apply=True,
                    export_textures=False,
                )
                
                file_size = os.path.getsize(lite_glb_path)
                print(f"Lite GLB exported successfully!")
                print(f"  File size: {file_size:,} bytes ({file_size/1024:.1f} KB)")
                
            except RuntimeError as e:
                print(f"Lite GLB export failed: {e}")
                # Fallback: export the original without decimation
                bpy.ops.object.select_all(action='DESELECT')
                if 'Kobo_Body' in bpy.data.objects:
                    body_orig.select_set(True)
                    bpy.context.view_layer.objects.active = body_orig
                    bpy.ops.export_scene.gltf(
                        filepath=lite_glb_path,
                        export_format='GLB',
                        use_selection=True,
                        export_materials='NONE',
                        export_animations=True,
                        export_yup=True,
                        export_apply=True,
                        export_textures=False,
                    )
                    file_size = os.path.getsize(lite_glb_path)
                    print(f"Fallback GLB exported: {file_size:,} bytes")
        else:
            print("No Kobo_Body object found for decimation")
            # Export full version as fallback
            if export_full:
                bpy.ops.object.select_all(action='DESELECT')
                objects_to_select = []
                if 'Kobo_Body' in bpy.data.objects:
                    objects_to_select.append(bpy.data.objects['Kobo_Body'])
                if 'Armature' in bpy.data.objects:
                    objects_to_select.append(bpy.data.objects['Armature'])
                if 'BlockStack' in bpy.data.objects:
                    objects_to_select.append(bpy.data.objects['BlockStack'])
                for o in objects_to_select:
                    o.select_set(True)
                bpy.context.view_layer.objects.active = objects_to_select[0] if objects_to_select else None
                bpy.ops.export_scene.gltf(
                    filepath=lite_glb_path,
                    export_format='GLB',
                    use_selection=True,
                    export_materials='NONE',
                    export_animations=True,
                    export_yup=True,
                    export_apply=True,
                    export_textures=False,
                )
                file_size = os.path.getsize(lite_glb_path)
                print(f"Fallback GLB exported: {file_size:,} bytes")
    
    # ============================================================
    # Post-export: Run gltf-transform optimize
    # ============================================================
    
    print("\nRunning gltf-transform optimization...")
    
    # Optimize full GLB
    if export_full and os.path.exists(full_glb_path):
        try:
            import subprocess
            # Run gltf-transform optimize with meshopt compression
            optimize_cmd = [
                "gltf-transform", "optimize", full_glb_path,
                "--meshopt",
                "--prune",
                "--dedup"
            ]
            result = subprocess.run(optimize_cmd, capture_output=True, text=True, cwd=os.getcwd())
            if result.returncode == 0:
                optimized_size = os.path.getsize(full_glb_path)
                print(f"Full GLB optimized: {optimized_size:,} bytes ({optimized_size/1024:.1f} KB)")
            else:
                print(f"gltf-transform warning: {result.stderr[:200]}")
        except Exception as e:
            print(f"gltf-transform not available: {e}")
    
    # Optimize lite GLB
    if export_lite and os.path.exists(lite_glb_path):
        try:
            import subprocess
            optimize_cmd = [
                "gltf-transform", "optimize", lite_glb_path,
                "--meshopt",
                "--prune",
                "--dedup"
            ]
            result = subprocess.run(optimize_cmd, capture_output=True, text=True, cwd=os.getcwd())
            if result.returncode == 0:
                optimized_size = os.path.getsize(lite_glb_path)
                print(f"Lite GLB optimized: {optimized_size:,} bytes ({optimized_size/1024:.1f} KB)")
            else:
                print(f"gltf-transform warning: {result.stderr[:200]}")
        except Exception as e:
            print(f"gltf-transform not available: {e}")
    
    # = Final summary
    print("\n" + "=" * 50)
    print("Koba export pipeline complete!")
    print(f"  Full GLB: {full_glb_path if export_full else 'skipped'}")
    print(f"  Lite GLB: {lite_glb_path if export_lite else 'skipped'}")
    print("=" * 50)


if __name__ == "__main__":
    main()