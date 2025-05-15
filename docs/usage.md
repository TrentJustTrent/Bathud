# Usage

---

### Starting the panel

```
okpanel run
```

---

### Stopping the panel

```
okpanel quit
```

---

### Showing the app launcher

Bind this command to whatever keybind you want

```
okpanel launcher
```

---

### Taking a screenshot or recording the screen

```
okpanel screenshot
```

To stop screen recording, click the recording button that appears in your bar.

---

### Changing volume

If you want your system to make a clicking sound when adjusting volume, bind these.  It is not required though.

```
okpanel volume-up
okpanel volume-down
okpanel mute
```

---

### Using the Hyprland share picker for [XDPH](https://wiki.hyprland.org/Hypr-Ecosystem/xdg-desktop-portal-hyprland/)

Create the file `xdph.conf` in your `~/.config/hypr/` directory and apply this config

```
screencopy {
    custom_picker_binary = okpanel-share
}
```
