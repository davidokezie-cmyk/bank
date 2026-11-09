#!/usr/bin/env python3
"""
animate_kobo.py - Creates looping 24 fps actions: Idle, Wave, Celebrate, Think, HopIn.

Blender version: Compatible with Bforartists 5.2.x / Blender 3.x
Usage: blender --background --factory-startup --python-exit-code 1 --python tools/mascot/animate_kobo.py -- <args>
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
    
    print(f"Blender version: {bpy.app.version_string}")
    print(f"Starting animation pipeline...")
    
    # ============================================================
    # Find and select the Body object for animation
    # ============================================================
    
    target_obj = None
    if 'Body' in bpy.data.objects:
        target_obj = bpy.data.objects['Body']
    elif 'Koba_Body' in bpy.data.objects:
        target_obj = bpy.data.objects['Koba_Body']
    
    if target_obj:
        bpy.context.view_layer.objects.active = target_obj
        obj = target_obj
        obj.select_set(True)
    else:
        obj = bpy.context.active_object
    
    # Ensure we're in object mode
    if obj and obj.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    
    # ============================================================
    # Idle: Breathing + subtle sway (loops seamlessly at 24 fps)
    # ============================================================
    
    # Create NLA track if it doesn't exist
    if obj and not obj.animation_data:
        obj.animation_data_create()
    
    # Idle action
    idle_action = bpy.data.actions.new(name="Idle")
    idle_action.use_fake_user = True
    
    # Set up F-curves for breathing (scale Y oscillation) and subtle sway (rotation Z)
    # We'll set keyframes on frame 1 and frame 25 (looping)
    frame_start = 1
    frame_end = 25  # 24 fps, 1 second + 1 frame for loop
    
    # Set active action
    if obj and obj.animation_data:
        obj.animation_data.action = idle_action
    
    # Keyframe 1: Normal size/pose
    if obj:
        obj.keyframe_insert(data_path="scale", frame=frame_start, value=(1.0, 1.0, 1.0))
        obj.keyframe_insert(data_path="rotation_euler", frame=frame_start, value=(0, 0, 0))
    
    # Keyframe 2: Slightly larger (breath in) + subtle sway
    if obj:
        obj.keyframe_insert(data_path="scale", frame=frame_start + 6, value=(1.05, 1.0, 1.05))
        obj.keyframe_insert(data_path="rotation_euler", frame=frame_start + 6, value=(0, 0, 0.1))
    
    # Keyframe 3: Back to normal (breath out)
    if obj:
        obj.keyframe_insert(data_path="scale", frame=frame_start + 12, value=(1.0, 1.0, 1.0))
        obj.keyframe_insert(data_path="rotation_euler", frame=frame_start + 12, value=(0, 0, 0))
    
    # Keyframe 4: Slightly smaller (breath out) + opposite sway
    if obj:
        obj.keyframe_insert(data_path="scale", frame=frame_start + 18, value=(0.95, 1.0, 0.95))
        obj.keyframe_insert(data_path="rotation_euler", frame=frame_start + 18, value=(0, 0, -0.1))
    
    # Keyframe 5: Back to normal (end of loop)
    if obj:
        obj.keyframe_insert(data_path="scale", frame=frame_end, value=(1.0, 1.0, 1.0))
        obj.keyframe_insert(data_path="rotation_euler", frame=frame_end, value=(0, 0, 0))
    
    # Make the action loop
    if idle_action:
        idle_action.frame_range = (frame_start, frame_end)
    
    # ============================================================
    # Wave: Hand wave + slight body lean
    # ============================================================
    
    wave_action = bpy.data.actions.new(name="Wave")
    wave_action.use_fake_user = True
    
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
        bpy.context.view_layer.objects.active = obj
    
    # Set active action
    if obj and obj.animation_data:
        obj.animation_data.action = wave_action
    
    # Keyframes for wave
    # Frame 1: Neutral
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=1, value=(0, 0, 0))
    # Frame 8: Wave hand up
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=8, value=(0, 0, 1.5))
        obj.keyframe_insert(data_path="location", frame=8, value=(obj.location.x, obj.location.y + 0.2, obj.location.z))
    # Frame 14: Return to neutral
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=14, value=(0, 0, 0))
        obj.keyframe_insert(data_path="location", frame=14, value=(obj.location.x, obj.location.y - 0.2, obj.location.z))
    # Frame 21: Other direction wave
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=21, value=(0, 0, -1.5))
        obj.keyframe_insert(data_path="location", frame=21, value=(obj.location.x, obj.location.y + 0.2, obj.location.z))
    # Frame 25: Return to neutral (loop point)
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=25, value=(0, 0, 0))
        obj.keyframe_insert(data_path="location", frame=25, value=(obj.location.x, obj.location.y - 0.2, obj.location.z))
    
    wave_action.frame_range = (1, 25)
    
    # ============================================================
    # Celebrate: Hop + arms up + block stack jiggle
    # ============================================================
    
    celebrate_action = bpy.data.actions.new(name="Celebrate")
    celebrate_action.use_fake_user = True
    
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
        bpy.context.view_layer.objects.active = obj
    
    # Set active action
    if obj and obj.animation_data:
        obj.animation_data.action = celebrate_action
    
    # Keyframes for celebrate hop
    if obj:
        obj.keyframe_insert(data_path="location", frame=1, value=obj.location)
        obj.keyframe_insert(data_path="rotation_euler", frame=1, value=(0, 0, 0))
    
    # Frame 4: Peak of hop
    if obj:
        obj.keyframe_insert(data_path="location", frame=4, value=(obj.location.x, obj.location.y + 0.5, obj.location.z))
        obj.keyframe_insert(data_path="rotation_euler", frame=4, value=(0.5, 0, 0))  # Tuck position
    
    # Frame 8: Land
    if obj:
        obj.keyframe_insert(data_path="location", frame=8, value=obj.location)
        obj.keyframe_insert(data_path="rotation_euler", frame=8, value=(0, 0, 0))
    
    # Frame 12: Arms up celebration
    # (In a full rig, arm bones would keyframe here)
    if obj:
        obj.keyframe_insert(data_path="scale", frame=8, value=(1.1, 1.1, 1.1))
    
    # Frame 16: Back to neutral
    if obj:
        obj.keyframe_insert(data_path="location", frame=16, value=obj.location)
        obj.keyframe_insert(data_path="rotation_euler", frame=16, value=(0, 0, 0))
    
    # Frame 20: Small celebration bounce
    if obj:
        obj.keyframe_insert(data_path="location", frame=20, value=(obj.location.x, obj.location.y + 0.2, obj.location.z))
        obj.keyframe_insert(data_path="rotation_euler", frame=20, value=(0, 0, 0.2))
    
    # Frame 25: Loop point
    if obj:
        obj.keyframe_insert(data_path="location", frame=25, value=obj.location)
        obj.keyframe_insert(data_path="rotation_euler", frame=25, value=(0, 0, 0))
    
    celebrate_action.frame_range = (1, 25)
    
    # ============================================================
    # Think: Head tilt, hand on chin
    # ============================================================
    
    think_action = bpy.data.actions.new(name="Think")
    think_action.use_fake_user = True
    
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
        bpy.context.view_layer.objects.active = obj
    
    # Set active action
    if obj and obj.animation_data:
        obj.animation_data.action = think_action
    
    # Keyframes for thinking
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=1, value=(0, 0, 0))
    # Frame 6: Head tilt thought pose
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=6, value=(0.3, 0, 0.2))
    # Frame 12: Return to neutral
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=12, value=(0, 0, 0))
    # Frame 18: Deep thought pose
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=18, value=(0.5, 0, 0.3))
    # Frame 25: Loop point
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=25, value=(0, 0, 0))
    
    think_action.frame_range = (1, 25)
    
    # ============================================================
    # HopIn: Entrance animation (Koba appears from nowhere)
    # ============================================================
    
    hopin_action = bpy.data.actions.new(name="HopIn")
    hopin_action.use_fake_user = True
    
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
        bpy.context.view_layer.objects.active = obj
    
    # Set active action
    if obj and obj.animation_data:
        obj.animation_data.action = hopin_action
    
    # Keyframes for hop-in
    # Frame 1: Small and distant
    if obj:
        obj.keyframe_insert(data_path="scale", frame=1, value=(0.5, 0.5, 0.5))
        obj.keyframe_insert(data_path="location", frame=1, value=(obj.location.x - 2, obj.location.y, obj.location.z))
        obj.keyframe_insert(data_path="rotation_euler", frame=1, value=(0, 0, 0))
    
    # Frame 4: Moving forward
    if obj:
        obj.keyframe_insert(data_path="scale", frame=4, value=(0.8, 0.8, 0.8))
        obj.keyframe_insert(data_path="location", frame=4, value=(obj.location.x - 0.5, obj.location.y, obj.location.z))
        obj.keyframe_insert(data_path="rotation_euler", frame=4, value=(0, 0, 0.1))
    
    # Frame 8: Almost there
    if obj:
        obj.keyframe_insert(data_path="scale", frame=8, value=(1.0, 1.0, 1.0))
        obj.keyframe_insert(data_path="location", frame=8, value=(obj.location.x + 0.2, obj.location.y, obj.location.z))
        obj.keyframe_insert(data_path="rotation_euler", frame=8, value=(0, 0, 0))
    
    # Frame 12: Land and settle
    if obj:
        obj.keyframe_insert(data_path="scale", frame=12, value=(1.0, 1.0, 1.0))
        obj.keyframe_insert(data_path="location", frame=12, value=obj.location)
        obj.keyframe_insert(data_path="rotation_euler", frame=12, value=(0, 0, 0))
    
    # Frame 16: Posture adjustment
    if obj:
        obj.keyframe_insert(data_path="rotation_euler", frame=16, value=(0, 0, -0.1))
    
    # Frame 25: Loop point / settled pose
    if obj:
        obj.keyframe_insert(data_path="scale", frame=25, value=(1.0, 1.0, 1.0))
        obj.keyframe_insert(data_path="location", frame=25, value=obj.location)
        obj.keyframe_insert(data_path="rotation_euler", frame=25, value=(0, 0, 0))
    
    hopin_action.frame_range = (1, 25)
    
    # ============================================================
    # Assign all actions to the object's NLA track
    # ============================================================
    
    # Set the object's animation data
    if obj and not obj.animation_data:
        obj.animation_data_create()
    
    action_dic = {
        "Idle": idle_action,
        "Wave": wave_action,
        "Celebrate": celebrate_action,
        "Think": think_action,
        "HopIn": hopin_action,
    }
    
# Create NLA track and add all actions
    nla_track = None
    if obj and obj.animation_data:
        nla_track = obj.animation_data.nla_tracks.new()
    
    for action_name, action in action_dic.items():
        if action and nla_track:
            strip = nla_track.strips.new(action_name, 1, action)
            strip.frame_start = 1
            # Set strip duration to match action frame range
            strip.frame_end = action.frame_end
    
    # = Set the blendfile to use frame stepping for smoother playback
    if bpy.context.scene:
        bpy.context.scene.render.fps = 24
    bpy.context.scene.frame_start = 1
    
    print("=" * 50)
    print("Koba animation complete!")
    print(f"Actions created: {list(action_dic.keys())}")
    for name, action in action_dic.items():
        if action:
            print(f"  {name}: frames {action.frame_start}-{action.frame_end}")
    print("=" * 50)


if __name__ == "__main__":
    main()