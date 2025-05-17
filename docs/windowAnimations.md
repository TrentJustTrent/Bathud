# Window Animations and Blur

Animations and blur can be controlled via hyprland layer rules.
You can read about layer rules [here](https://wiki.hyprland.org/Configuring/Window-Rules/#layer-rules) and 
animations [here](https://wiki.hyprland.org/Configuring/Animations/#general)

## Window namespaces

These are the namespace names of the available windows and bars.

```
okpanel-vertical-bar
okpanel-horizontal-bar
okpanel-system-menu
okpanel-calendar
okpanel-app-launcher
okpanel-screenshare
okpanel-screenshot
okpanel-notifications
okpanel-notification-history
okpanel-clipboard-manager
okpanel-alerts
```

The scrim (transparent background when opening a window that absorbs clicks and closes opened windows when clicking)

```
okpanel-scrim
```

Note: some windows have a built-in scrim, which can be ignored by using the `ignorezero` rule.

```
layerrule = ignorezero, okpanel-system-menu
```

## Example rule set

```
layerrule = blur, okpanel-horizontal-bar
layerrule = blur, okpanel-vertical-bar
layerrule = blur, okpanel-system-menu
layerrule = blur, okpanel-calendar
layerrule = blur, okpanel-app-launcher
layerrule = blur, okpanel-screenshare
layerrule = blur, okpanel-screenshot
layerrule = blur, okpanel-notifications
layerrule = blur, okpanel-notification-history
layerrule = blur, okpanel-clipboard-manager
layerrule = blur, okpanel-alerts

layerrule = ignorezero, okpanel-system-menu
layerrule = ignorezero, okpanel-calendar
layerrule = ignorezero, okpanel-notification-history
layerrule = ignorezero, okpanel-clipboard-manager
layerrule = ignorezero, okpanel-screenshot
layerrule = ignorezero, okpanel-screenshare

layerrule = animation slide top, okpanel-app-launcher
layerrule = animation slide left, okpanel-system-menu

```
