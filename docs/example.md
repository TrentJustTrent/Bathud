# Example configs

## Example Global Config

An example global config placed at `~/.config/OkPanel/okpanel.yaml`
These are things that you probably want the same in all your config files (if you use multiple)

```
configUpdateScript: "/home/john/workspace/scripts/setTheme.sh"
wallpaperUpdateScript: "/home/john/workspace/scripts/setWallpaper.sh"

weather:
  latitude: "47.5432"
  longitude: "-89.9034"
  
systemCommands:
  logout: "uwsm stop"
  lock: "uwsm app -- hyprlock"
  restart: "systemctl reboot"
  shutdown: "systemctl poweroff"
```

## Example Simple Theme Config

![screenshot](https://raw.githubusercontent.com/JohnOberhauser/OkPanelScreenshots/refs/heads/main/examples/simple_frame.png)

```
icon: "󰚌"
iconOffset: 2
wallpaperDir: /home/john/workspace/Varda-Theme/themes/bloodrust/wallpaper

frame:
  leftThickness: 14
  bottomThickness: 14
  rightThickness: 14
  borderRadius: 20
  borderWidth: 4

topBar:
  leftWidgets:
    - menu
    - workspaces
  centerWidgets:
    - clock
  rightWidgets:
    - tray
    - clipboardManager
    - audioOut
    - audioIn
    - bluetooth
    - vpnIndicator
    - network
    - battery

theme:
  name: bloodrust
  colors:
    background: "#1F2932"
    foreground: "#AFB3BD"
    primary: "#7C545F"
    buttonPrimary: "#7C545F"
    warning: "#7C7C54"
    barBorder: "#7C545F"
    windowBorder: "#AFB3BD"
    alertBorder: "#7C545F"
```

## Example with no frame and just a top bar

![screenshot](https://raw.githubusercontent.com/JohnOberhauser/OkPanelScreenshots/refs/heads/main/examples/simple_bar.png)

```
icon: "󰚌"
iconOffset: 2
wallpaperDir: /home/john/workspace/Varda-Theme/themes/bloodrust/wallpaper

frame:
  leftThickness: 0
  bottomThickness: 0
  rightThickness: 0
  topThickness: 0
  borderRadius: 0
  borderWidth: 0

topBar:
  marginStart: 10
  marginEnd: 10
  marginTop: 10
  borderRadius: 8
  borderWidth: 2
  leftWidgets:
    - menu
    - workspaces
  centerWidgets:
    - clock
  rightWidgets:
    - tray
    - clipboardManager
    - audioOut
    - audioIn
    - bluetooth
    - vpnIndicator
    - network
    - battery

leftBar:
  topWidgets: []
  centerWidgets: []
  bottomWidgets: []

theme:
  name: bloodrust
  colors:
    background: "#1F2932"
    foreground: "#AFB3BD"
    primary: "#7C545F"
    buttonPrimary: "#7C545F"
    warning: "#7C7C54"
    barBorder: "#7C545F"
    windowBorder: "#AFB3BD"
    alertBorder: "#7C545F"
```

## Example nord theme with a simple left side vertical bar

![screenshot](https://raw.githubusercontent.com/JohnOberhauser/OkPanelScreenshots/refs/heads/main/examples/nord.png)

```
icon: ""
iconOffset: 2
wallpaperDir: /home/john/workspace/Varda-Theme/themes/nord/wallpaper

leftBar:
  topWidgets:
    - menu
    - workspaces
  centerWidgets: []
  bottomWidgets:
    - tray
    - clipboardManager
    - audioOut
    - audioIn
    - bluetooth
    - vpnIndicator
    - network
    - battery
    - clock

systemMenu:
  widgets:
    - clock
    - network
    - bluetooth
    - audioOut
    - audioIn
    - powerProfile
    - toolbox
    - lookAndFeel
    - mprisPlayers
    - powerOptions
    - notificationHistory
  clock:
    dayFont: "Anurati"
    dayAllCaps: true
    
theme:
  name: nord
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

## Example everforest theme

![screenshot](https://raw.githubusercontent.com/JohnOberhauser/OkPanelScreenshots/refs/heads/main/examples/everforest.png)

```
icon: "󰌪"
iconOffset: 1
wallpaperDir: /home/john/workspace/Varda-Theme/themes/everforest/wallpaper

topBar:
  leftWidgets:
    - workspaces
  topWidgets:
    - menu
    - workspaces
  centerWidgets:
    - menu
    - notificationHistory
    - clipboardManager
    - colorPicker
    - clock
    - logout
    - lock
    - restart
    - shutdown
  rightWidgets:
    - powerProfile
    - recordingIndicator
    - audioOut
    - audioIn
    - bluetooth
    - network
    - battery

systemMenu:
  widgets:
    - clock
    - network
    - bluetooth
    - audioOut
    - audioIn
    - powerProfile
    - lookAndFeel
    - mprisPlayers

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