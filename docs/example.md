# Example configs

## Example Global Config

An example global config placed at `~/.config/OkPanel/okpanel.yaml`
These are things that you probably want the same in all your config files (if you use multiple)

```
themeUpdateScript: "/home/john/workspace/scripts/setTheme.sh"
wallpaperUpdateScript: "/home/john/workspace/scripts/setWallpaper.sh"

systemCommands:
  logout: "uwsm stop"
  lock: "uwsm app -- hyprlock"
  restart: "systemctl reboot"
  shutdown: "systemctl poweroff"
```

## Example Simple Theme Config

```
# ───────────── General settings ─────────────
icon: ""
iconOffset: 1

wallpaperDir: /home/john/Pictures/wallpaper/nord

# ───────────── Theme ─────────────
theme:
  name: nord
  largeButtonBorderRadius: 16
  colors:
    background: "#2e3440"
    foreground: "#d8dee9"
    primary: "#81a1c1"
    buttonPrimary: "#5e81ac"
    warning: "#BF616A"
    barBorder: "#81a1c1"
    windowBorder: "#d8dee9"
    alertBorder: "#81a1c1"
```

## Example Config With Custom Bar Widget Layout

```
# ───────────── General settings ─────────────
icon: "󰌪"
iconOffset: 1

wallpaperDir: /home/john/Pictures/wallpaper/nord

# ───────────── Horizontal bar ─────────────
horizontalBar:
  leftWidgets:
    - menu
    - workspaces
  centerWidgets:
    - mpris_track_info
    - mpris_controls
  rightWidgets:
    - recording_indicator
    - tray
    - clipboard_manager
    - power_profile
    - audio_out
    - audio_in
    - bluetooth
    - vpn_indicator
    - network
    - battery
    - tray
    - clock

# ───────────── Vertical bar ─────────────
verticalBar:
  topWidgets:
    - menu
    - workspaces
  centerWidgets:
    - mpris_track_info
    - mpris_controls
  bottomWidgets:
    - recording_indicator
    - tray
    - clipboard_manager
    - power_profile
    - audio_out
    - audio_in
    - bluetooth
    - vpn_indicator
    - network
    - battery
    - clock

# ───────────── Theme ─────────────
theme:
  name: everforest
  colors:
    background: "#1E2326"
    foreground: "#D3C6AA"
    primary: "#7A8478"
    buttonPrimary: "#384B55"
    warning: "#E67E80"
    barBorder: "#7A8478"
    windowBorder: "#D3C6AA"
    alertBorder: "#7A8478"
```