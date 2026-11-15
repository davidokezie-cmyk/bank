#!/usr/bin/env python3
"""
animate_kobo.py - Creates looping actions: Idle, Wave, Celebrate, Think, HopIn.

Compatible with Bforartists 5.2.x (Blender 5.3 Alpha API).
Pattern: set the property, then call keyframe_insert(data_path, frame).

Usage:
  bforartists --background <path/to/kobo.blend> --factory-startup --python-exit-code 1 --python tools/mascot/animate_kobo.py
"""

import bpy


def kf(obj, data_path, value, frame):
    """Assign value to data_path, then insert the keyframe at frame."""
    setattr(obj, data_path, value)
    obj.keyframe_insert(data_path=data_path, frame=frame)


def main():
    print(f"Blender version: {bpy.app.version_string}")
    print("Starting animation pipeline...")

    obj = bpy.data.objects.get('Body') or bpy.data.objects.get('Koba_Body')
    if obj is None:
        raise RuntimeError("Could not find 'Body' object in the scene. Run build_kobo.py first.")

    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    if obj.mode != 'OBJECT':
        bpy.ops.object.mode_set(mode='OBJECT')

    if not obj.animation_data:
        obj.animation_data_create()

    def new_action(name):
        action = bpy.data.actions.new(name=name)
        action.use_fake_user = True
        return action

    home_location = tuple(obj.location)

    # ============================================================
    # Idle: Breathing + subtle sway (loops seamlessly at 24 fps)
    # ============================================================
    idle_action = new_action("Idle")
    obj.animation_data.action = idle_action

    kf(obj, "scale", (1.0, 1.0, 1.0), 1)
    kf(obj, "rotation_euler", (0, 0, 0), 1)
    kf(obj, "scale", (1.05, 1.0, 1.05), 7)
    kf(obj, "rotation_euler", (0, 0, 0.1), 7)
    kf(obj, "scale", (1.0, 1.0, 1.0), 12)
    kf(obj, "rotation_euler", (0, 0, 0.0), 12)
    kf(obj, "scale", (0.95, 1.0, 0.95), 18)
    kf(obj, "rotation_euler", (0, 0, -0.1), 18)
    kf(obj, "scale", (1.0, 1.0, 1.0), 25)
    kf(obj, "rotation_euler", (0, 0, 0), 25)

    # ============================================================
    # Wave: Hand-wave lean + slight rise
    # ============================================================
    wave_action = new_action("Wave")
    obj.animation_data.action = wave_action

    away_y = home_location[1]
    kf(obj, "rotation_euler", (0, 0, 0), 1)
    kf(obj, "location", home_location, 1)
    kf(obj, "rotation_euler", (0, 0, 1.5), 8)
    kf(obj, "location", (home_location[0], away_y + 0.2, home_location[2]), 8)
    kf(obj, "rotation_euler", (0, 0, 0), 14)
    kf(obj, "location", home_location, 14)
    kf(obj, "rotation_euler", (0, 0, -1.5), 21)
    kf(obj, "location", (home_location[0], away_y + 0.2, home_location[2]), 21)
    kf(obj, "rotation_euler", (0, 0, 0), 25)
    kf(obj, "location", home_location, 25)

    # ============================================================
    # Celebrate: Hop + arms-up shake
    # ============================================================
    celebrate_action = new_action("Celebrate")
    obj.animation_data.action = celebrate_action

    kf(obj, "location", home_location, 1)
    kf(obj, "rotation_euler", (0, 0, 0), 1)
    kf(obj, "location", (home_location[0], away_y + 0.5, home_location[2]), 4)
    kf(obj, "rotation_euler", (0.5, 0, 0), 4)
    kf(obj, "location", home_location, 8)
    kf(obj, "rotation_euler", (0, 0, 0), 8)
    kf(obj, "scale", (1.1, 1.1, 1.1), 8)
    kf(obj, "location", home_location, 16)
    kf(obj, "rotation_euler", (0, 0, 0), 16)
    kf(obj, "scale", (1.0, 1.0, 1.0), 16)
    kf(obj, "location", (home_location[0], away_y + 0.2, home_location[2]), 20)
    kf(obj, "rotation_euler", (0, 0, 0.2), 20)
    kf(obj, "location", home_location, 25)
    kf(obj, "rotation_euler", (0, 0, 0), 25)

    # ============================================================
    # Think: Thought poses with settle
    # ============================================================
    think_action = new_action("Think")
    obj.animation_data.action = think_action

    kf(obj, "rotation_euler", (0, 0, 0), 1)
    kf(obj, "rotation_euler", (0.3, 0, 0.2), 6)
    kf(obj, "rotation_euler", (0, 0, 0), 12)
    kf(obj, "rotation_euler", (0.5, 0, 0.3), 18)
    kf(obj, "rotation_euler", (0, 0, 0), 25)

    # ============================================================
    # HopIn: Entrance — small and distant, settle at frame 12
    # ============================================================
    hopin_action = new_action("HopIn")
    obj.animation_data.action = hopin_action

    kf(obj, "scale", (0.5, 0.5, 0.5), 1)
    kf(obj, "location", (home_location[0] - 2, away_y, home_location[2]), 1)
    kf(obj, "rotation_euler", (0, 0, 0), 1)
    kf(obj, "scale", (0.8, 0.8, 0.8), 4)
    kf(obj, "location", (home_location[0] - 0.5, away_y, home_location[2]), 4)
    kf(obj, "rotation_euler", (0, 0, 0.1), 4)
    kf(obj, "scale", (1.0, 1.0, 1.0), 8)
    kf(obj, "location", (home_location[0] + 0.2, away_y, home_location[2]), 8)
    kf(obj, "rotation_euler", (0, 0, 0), 8)
    kf(obj, "scale", (1.0, 1.0, 1.0), 12)
    kf(obj, "location", home_location, 12)
    kf(obj, "rotation_euler", (0, 0, 0), 12)
    kf(obj, "rotation_euler", (0, 0, -0.1), 16)
    kf(obj, "scale", (1.0, 1.0, 1.0), 25)
    kf(obj, "location", home_location, 25)
    kf(obj, "rotation_euler", (0, 0, 0), 25)

    # ============================================================
    # Push all actions into one NLA track each so they export
    # ============================================================
    action_dic = {
        "Idle": idle_action,
        "Wave": wave_action,
        "Celebrate": celebrate_action,
        "Think": think_action,
        "HopIn": hopin_action,
    }

    for action_name, action in action_dic.items():
        track = obj.animation_data.nla_tracks.new()
        track.name = action_name
        strip = track.strips.new(action_name, 1, action)
        strip.frame_start = 1

    bpy.context.scene.render.fps = 24
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = 25

    # Persist the animation into the blend file without popping dialogs
    bpy.ops.wm.save_mainfile()

    print("=" * 50)
    print("Kobo animation complete!")
    for name, action in action_dic.items():
        print(f"  {name}: frames {action.frame_range[0]:.0f}-{action.frame_range[1]:.0f}")
    print("=" * 50)


if __name__ == "__main__":
    main()
