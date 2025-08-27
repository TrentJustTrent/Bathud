# Window Animations and Blur

Animations and blur can be controlled via hyprland layer rules.
You can read about layer rules [here](https://wiki.hyprland.org/Configuring/Window-Rules/#layer-rules) and 
animations [here](https://wiki.hyprland.org/Configuring/Animations/#general)

You can also [change the way the blur looks](https://wiki.hyprland.org/Configuring/Variables/#blur).

## Window namespaces

These are the namespace names of the available windows and bars.

```
okpanel-frame
okpanel-app-launcher
okpanel-screenshare
okpanel-screenshot
okpanel-notifications
okpanel-alerts
```

The scrim (transparent background when opening a window that absorbs clicks and closes opened windows when clicking)

```
okpanel-scrim
```

Note: windows that anchor to the bar have a built-in scrim, which can be ignored by using the `ignorezero` rule.
This also means you probably shouldn't use a fully transparent background if you want to blur.

```
layerrule = ignorezero, okpanel-frame
```

## Example rule set

```
layerrule = blur, okpanel-frame
layerrule = blur, okpanel-app-launcher
layerrule = blur, okpanel-screenshare
layerrule = blur, okpanel-screenshot
layerrule = blur, okpanel-notifications
layerrule = blur, okpanel-alerts

layerrule = ignorezero, okpanel-frame
layerrule = ignorezero, okpanel-app-launcher
layerrule = ignorezero, okpanel-screenshot
layerrule = ignorezero, okpanel-screenshare
layerrule = ignorezero, okpanel-notifications
layerrule = ignorezero, okpanel-alerts

layerrule = animation slide top, okpanel-app-launcher
layerrule = animation slide left, okpanel-alerts

```
