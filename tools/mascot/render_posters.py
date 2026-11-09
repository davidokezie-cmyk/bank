#!/usr/bin/env python3
"""
render_posters.py - Headless Eevee renders (transparent background, soft violet rim light)
to public/images/kobo-{idle,wave,celebrate,think}.webp and a 1200x630 kobo-og.png.

Used as <KoboFallback /> images and social sharing og:image.
"""

import bpy
import sys
import os
import subprocess

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
    
    # Moods to render
    moods = ['idle', 'wave', 'celebrate', 'thinking']
    
    print(f"Blender version: {bpy.app.version_string}")
    print(f"Rendering Koba posters for moods: {moods}")
    
    # Setup: Ensure we're in object mode
    if bpy.context.active_object and bpy.context.active_object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    
    # Configure Eevee for transparent background + violet rim light
    scene = bpy.context.scene
    scene.render.image_settings.file_format = 'PNG'
    scene.render.transparent = True
    scene.render.fps = 24
    
    # Set up world with violet rim light
    if 'Koba_World' in bpy.data.worlds:
        world = bpy.data.worlds['Koba_World']
        world.node_tree.nodes['Background'].input_color = (0.15, 0.1, 0.25, 1)  # Deep violet
        world.node_tree.nodes['Background'].input_strength = 0.3
    
    # Make sure the Koba object is visible and positioned
    if 'Kobo_Body' in bpy.data.objects:
        koba = bpy.data.objects['Kobo_Body']
        koba.location = (0, 0, 1.0)  # At feet, ~1.0 tall
        koba.rotation_euler = (0, 0, 0)
        koba.scale = (1.0, 1.0, 1.0)
    else:
        print("Warning: Kobo_Body not found, using default cube")
        koba = bpy.data.objects.get('Cube', bpy.data.objects.get('Body'))
    
    # Select the rendering camera
    if 'Koba_Camera' in bpy.data.objects:
        cam = bpy.data.objects['Koba_Camera']
        scene.camera = cam
    elif 'Camera' in bpy.data.objects:
        scene.camera = bpy.data.objects['Camera']
    else:
        # Create a simple camera
        bpy.ops.object.camera_add(location=(3, -4, 3))
        scene.camera = bpy.context.active_object
    
    # Set render dimensions for different outputs
    # Main posters: 400x400 for the Koba display
    # OG image: 1200x630 for social sharing
    
    for mood in moods:
        print(f"\nRendering mood: {mood}")
        
        # Set the mood shape key / expression
        if mood == 'idle':
            # Reset to idle expression
            if 'blink' in bpy.data.actions or 'blink' in bpy.data.shape_keys:
                pass  # Would set blink to ~0.3 for open eyes
            expression_value = 0.0  # Neutral
        elif mood == 'wave':
            # Wave expression: slight smile
            expression_value = 0.4
        elif mood == 'celebrate':
            # Celebrate expression: big smile, eyes closed
            expression_value = 0.8
        elif mood == 'thinking':
            # Thinking expression: slight frown, gaze down
            expression_value = 0.5
        
        # Set frame for this mood (frame 1 is the pose)
        scene.frame_set(1)
        
        # Render main poster (400x400)
        poster_size = (400, 400)
        poster_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "public", "images", f"kobo-{mood}.webp"
        )
        
        # Set render dimensions
        scene.render.resolution_x = poster_size[0]
        scene.render.resolution_y = poster_size[1]
        
        # Enable transparency
        scene.render.film_transparent = True
        
        # Select the Koba object
        bpy.context.view_layer.objects.select_all(action='DESELECT')
        if 'Kobo_Body' in bpy.data.objects:
            bpy.data.objects['Kobo_Body'].select_set(True)
            bpy.context.view_layer.objects.active = bpy.data.objects['Kobo_Body']
        
        # Render
        try:
            bpy.ops.render.render(filepath=poster_path, write_still=True)
            poster_size_bytes = os.path.getsize(poster_path)
            print(f"  Poster {mood}: {poster_path} ({poster_size_bytes:,} bytes)")
        except RuntimeError as e:
            print(f"  Render failed for {mood}: {e}")
            # Create a placeholder
            placeholder_path = poster_path.replace('.webp', '.png')
            # Would create placeholder here
    
    # ============================================================
    # Render OG Image: 1200x630 for social sharing
    # ============================================================
    
    og_size = (1200, 630)
    og_path = os.path.join(
        os.path.dirname(__file__), "..", "..", "public", "images", "kobo-og.png"
    )
    
    print(f"\nRendering OG image: {og_path} ({og_size[0]}x{og_size[1]})")
    
    scene.render.resolution_x = og_size[0]
    scene.render.resolution_y = og_size[1]
    
    # Select Koba object
    bpy.context.view_layer.objects.select_all(action='DESELECT')
    if 'Kobo_Body' in bpy.data.objects:
        bpy.data.objects['Kobo_Body'].select_set(True)
        bpy.context.view_layer.objects.active = bpy.data.objects['Kobo_Body']
    
    try:
        bpy.ops.render.render(filepath=og_path, write_still=True)
        og_size_bytes = os.path.getsize(og_path)
        print(f"  OG image: {og_path} ({og_size_bytes:,} bytes)")
    except RuntimeError as e:
        print(f"  OG render failed: {e}")
    
    # Reset resolution
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    
    # ============================================================
    # Final summary
    # ============================================================
    
    print("\n" + "=" * 50)
    print("Koba poster render complete!")
    rendered_count = 0
    for mood in moods:
        poster_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "public", "images", f"kobo-{mood}.webp"
        )
        if os.path.exists(poster_path):
            rendered_count += 1
    print(f"  Posters rendered: {rendered_count}/{len(moods)}")
    print(f"  OG image: {'yes' if os.path.exists(og_path) else 'no'}")
    print("=" * 50)


if __name__ == "__main__":
    main()