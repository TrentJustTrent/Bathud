# Example config

```
# ───────────── General settings ─────────────
icon            = 󰌪
iconOffset      = 1

largeButtonBorderRadius = 16

themeUpdateScript      = "/home/john/workspace/scripts/setTheme.sh"
wallpaperUpdateScript  = "/home/john/workspace/scripts/setWallpaper.sh"

# ───────────── Horizontal bar ─────────────
horizontalBar {
    leftWidgets [
        menu
        workspaces
    ]
    centerWidgets [
        mpris_track_info
        mpris_controls
    ]
    rightWidgets [
        recording_indicator
        tray
        clipboard_manager
        power_profile
        audio_out
        audio_in
        bluetooth
        vpn_indicator
        network
        battery
        tray
        clock
    ]
}

# ───────────── Vertical bar ─────────────
verticalBar {
    topWidgets [
        menu
        workspaces
    ]
    centerWidgets [
        mpris_track_info
        mpris_controls
    ]
    bottomWidgets [
        recording_indicator
        tray
        clipboard_manager
        power_profile
        audio_out
        audio_in
        bluetooth
        vpn_indicator
        network
        battery
        clock
    ]
}

# ───────────── Power commands ─────────────
systemCommands {
    logout   = uwsm stop
    lock     = uwsm app -- hyprlock
    restart  = systemctl reboot
    shutdown = systemctl poweroff
}

# ───────────── Theme ─────────────
theme {
    name         = nord
    wallpaperDir = /home/john/workspace/Varda-Theme/themes/nord/wallpaper

    colors {
        background    = #2e3440
        foreground    = #d8dee9
        primary       = #81a1c1
        buttonPrimary = #5e81ac
        warning       = #BF616A
        barBorder     = #81a1c1
        windowBorder  = #d8dee9
        alertBorder   = #81a1c1
    }
}
```