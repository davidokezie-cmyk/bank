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
    
    # Ensure we're in object mode
    if bpy.context.active_object and bpy.context.active_object.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')
    
    # ============================================================
    # Idle: Breathing + subtle sway (loops seamlessly at 24 fps)
    # ============================================================
    
    # Create NLA track if it doesn't exist
    if not bpy.context.active_object.animation_data:
        bpy.context.object.animation_data_create()
    
    # Idle action
    idle_action = bpy.data.actions.new(name="Idle")
    idle_action.use_fake_user = True
    
    # Set up F-curves for breathing (scale Y oscillation) and subtle sway (rotation Z)
    # We'll set keyframes on frame 1 and frame 25 (looping)
    frame_start = 1
    frame_end = 25  # 24 fps, 1 second + 1 frame for loop
    
    # Select the body object for animation
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
    else:
        obj = bpy.context.active_object
    
    # Set active action
    if bpy.context.object.animation_data:
        bpy.context.object.animation_data.action = idle_action
    
    # Keyframe 1: Normal size/pose
    obj.keyframe_insert(data_path="scale", frame=frame_start, value=(1.0, 1.0, 1.0))
    obj.keyframe_insert(data_path="rotation_euler", frame=frame_start, value=(0, 0, 0))
    
    # Keyframe 2: Slightly larger (breath in) + subtle sway
    obj.keyframe_insert(data_path="scale", frame=frame_start + 6, value=(1.05, 1.0, 1.05))
    obj.keyframe_insert(data_path="rotation_euler", frame=frame_start + 6, value=(0, 0, 0.1))
    
    # Keyframe 3: Back to normal (breath out)
    obj.keyframe_insert(data_path="scale", frame=frame_start + 12, value=(1.0, 1.0, 1.0))
    obj.keyframe_insert(data_path="rotation_euler", frame=frame_start + 12, value=(0, 0, 0))
    
    # Keyframe 4: Slightly smaller (breath out) + opposite sway
    obj.keyframe_insert(data_path="scale", frame=frame_start + 18, value=(0.95, 1.0, 0.95))
    obj.keyframe_insert(data_path="rotation_euler", frame=frame_start + 18, value=(0, 0, -0.1))
    
    # Keyframe 5: Back to normal (end of loop)
    obj.keyframe_insert(data_path="scale", frame=frame_end, value=(1.0, 1.0, 1.0))
    obj.keyframe_insert(data_path="rotation_euler", frame=frame_end, value=(0, 0, 0))
    
    # Make the action loop
    if idle_action:
        idle_action.frame_range = (frame_start, frame_end)
        # Set the action to loop
        idle_action.use_auto_predict_x = False
    
    # ============================================================
    # Wave: Hand wave + slight body lean
    # ============================================================
    
    wave_action = bpy.data.actions.new(name="Wave")
    wave_action.use_fake_user = True
    
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
    
    # Set active action
    if bpy.context.object.animation_data:
        bpy.context.object.animation_data.action = wave_action
    
    # Keyframes for wave
    # Frame 1: Neutral
    obj.keyframe_insert(data_path="rotation_euler", frame=1, value=(0, 0, 0))
    # Frame 8: Wave hand up
    obj.keyframe_insert(data_path="rotation_euler", frame=8, value=(0, 0, 1.5))
    obj.keyframe_insert(data_path="location", frame=8, value=(obj.location.x, obj.location.y + 0.2, obj.location.z))
    # Frame 14: Return to neutral
    obj.keyframe_insert(data_path="rotation_euler", frame=14, value=(0, 0, 0))
    obj.keyframe_insert(data_path="location", frame=14, value=(obj.location.x, obj.location.y - 0.2, obj.location.z))
    # Frame 21: Other direction wave
    obj.keyframe_insert(data_path="rotation_euler", frame=21, value=(0, 0, -1.5))
    obj.keyframe_insert(data_path="location", frame=21, value=(obj.location.x, obj.location.y + 0.2, obj.location.z))
    # Frame 25: Return to neutral (loop point)
    obj.keyframe_insert(data_path="rotation_euler", frame=25, value=(0, 0, 0))
    obj.keyframe_insert(data_path="location", frame=25, value=(obj.location.x, obj.location.y - 0.2, obj.location.z))
    
    wave_action.frame_range = (1, 25)
    wave_action.use_auto_predict_x = False
    
    # ============================================================
    # Celebrate: Hop + arms up + block stack jiggle
    # ============================================================
    
    celebrate_action = bpy.data.actions.new(name="Celebrate")
    celebrate_action.use_fake_user = True
    
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
    
    # Set active action
    if bpy.context.object.animation_data:
        bpy.context.object.animation_data.action = celebrate_action
    
    # Keyframes for celebrate hop
    obj.keyframe_insert(data_path="location", frame=1, value=obj.location)
    obj.keyframe_insert(data_path="rotation_euler", frame=1, value=(0, 0, 0))
    
    # Frame 4: Peak of hop
    obj.keyframe_insert(data_path="location", frame=4, value=(obj.location.x, obj.location.y + 0.5, obj.location.z))
    obj.keyframe_insert(data_path="rotation_euler", frame=4, value=(0.5, 0, 0))  # Tuck position
    
    # Frame 8: Land
    obj.keyframe_insert(data_path="location", frame=8, value=obj.location)
    obj.keyframe_insert(data_path="rotation_euler", frame=8, value=(0, 0, 0))
    
    # Frame 12: Arms up celebration
    # (In a full rig, arm bones would keyframe here)
    obj.keyframe_insert(data_path="scale", frame=8, value=(1.1, 1.1, 1.1))
    
    # Frame 16: Back to neutral
    obj.keyframe_insert(data_path="location", frame=16, value=obj.location)
    obj.keyframe_insert(data_path="rotation_euler", frame=16, value=(0, 0, 0))
    
    # Frame 20: Small celebration bounce
    obj.keyframe_insert(data_path="location", frame=20, value=(obj.location.x, obj.location.y + 0.2, obj.location.z))
    obj.keyframe_insert(data_path="rotation_euler", frame=20, value=(0, 0, 0.2))
    
    # Frame 25: Loop point
    obj.keyframe_insert(data_path="location", frame=25, value=obj.location)
    obj.keyframe_insert(data_path="rotation_euler", frame=25, value=(0, 0, 0))
    
    celebrate_action.frame_range = (1, 25)
    celebrate_action.use_auto_predict_x = False
    
    # ============================================================
    # Think: Head tilt, hand on chin
    # ============================================================
    
    think_action = bpy.data.actions.new(name="Think")
    think_action.use_fake_user = True
    
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
    
    # Set active action
    if bpy.context.object.animation_data:
        bpy.context.object.animation_data.action = think_action
    
    # Keyframes for thinking
    obj.keyframe_insert(data_path="rotation_euler", frame=1, value=(0, 0, 0))
    # Frame 6: Head tilt thought pose
    obj.keyframe_insert(data_path="rotation_euler", frame=6, value=(0.3, 0, 0.2))
    # Frame 12: Return to neutral
    obj.keyframe_insert(data_path="rotation_euler", frame=12, value=(0, 0, 0))
    # Frame 18: Deep thought pose
    obj.keyframe_insert(data_path="rotation_euler", frame=18, value=(0.5, 0, 0.3))
    # Frame 25: Loop point
    obj.keyframe_insert(data_path="rotation_euler", frame=25, value=(0, 0, 0))
    
    think_action.frame_range = (1, 25)
    think_action.use_auto_predict_x = False
    
    # ============================================================
    # HopIn: Entrance animation (Koba appears from nowhere)
    # ============================================================
    
    hopin_action = bpy.data.actions.new(name="HopIn")
    hopin_action.use_fake_user = True
    
    if 'Body' in bpy.data.objects:
        obj = bpy.data.objects['Body']
    
    # Set active action
    if bpy.context.object.animation_data:
        bpy.context.object.animation_data.action = hopin_action
    
    # Keyframes for hop-in
    # Frame 1: Small and distant
    obj.keyframe_insert(data_path="scale", frame=1, value=(0.5, 0.5, 0.5))
    obj.keyframe_insert(data_path="location", frame=1, value=(obj.location.x - 2, obj.location.y, obj.location.z))
    obj.keyframe_insert(data_path="rotation_euler", frame=1, value=(0, 0, 0))
    
    # Frame 4: Moving forward
    obj.keyframe_insert(data_path="scale", frame=4, value=(0.8, 0.8, 0.8))
    obj.keyframe_insert(data_path="location", frame=4, value=(obj.location.x - 0.5, obj.location.y, obj.location.z))
    obj.keyframe_insert(data_path="rotation_euler", frame=4, value=(0, 0, 0.1))
    
    # Frame 8: Almost there
    obj.keyframe_insert(data_path="scale", frame=8, value=(1.0, 1.0, 1.0))
    obj.keyframe_insert(data_path="location", frame=8, value=(obj.location.x + 0.2, obj.location.y, obj.location.z))
    obj.keyframe_insert(data_path="rotation_euler", frame=8, value=(0, 0, 0))
    
    # Frame 12: Land and settle
    obj.keyframe_insert(data_path="scale", frame=12, value=(1.0, 1.0, 1.0))
    obj.keyframe_insert(data_path="location", frame=12, value=obj.location)
    obj.keyframe_insert(data_path="rotation_euler", frame=12, value=(0, 0, 0))
    
    # Frame 16: Posture adjustment
    obj.keyframe_insert(data_path="rotation_euler", frame=16, value=(0, 0, -0.1))
    
    # Frame 25: Loop point / settled pose
    obj.keyframe_insert(data_path="scale", frame=25, value=(1.0, 1.0, 1.0))
    obj.keyframe_insert(data_path="location", frame=25, value=obj.location)
    obj.keyframe_insert(data_path="rotation_euler", frame=25, value=(0, 0, 0))
    
    hopin_action.frame_range = (1, 25)
    hopin_action.use_auto_predict_x = False
    
    # ============================================================
    # Assign all actions to the object's NLA track
    # ============================================================
    
    # Set the object's animation data
    if not bpy.context.object.animation_data:
        bpy.context.object.animation_data_create()
    
    action_dic = {
        "Idle": idle_action,
        "Wave": wave_action,
        "Celebrate": celebrate_action,
        "Think": think_action,
        "HopIn": hopin_action,
    }
    
    # Create NLA track and add all actions
    if not bpy.context.object.animation_data.nla_tracks:
        nla_track = bpy.context.object.animation_data.nla_tracks.new()
    
    for action_name, action in action_dic.items():
        if action:
            strip = nla_track.strips.new(action_name, 1, action)
            strip.frame_start = 1
            # Set strip duration to match action frame range
            strip.frame_end = action.frame_end
    
    # = Set the blendfile to use frame stepping for smoother playback
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