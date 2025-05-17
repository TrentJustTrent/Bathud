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

## Example rule set

```
layerrule = blur, okpanel-horizontal-bar
layerrule = blur, okpanel-vertical-bar
layerrule = animation slide top, okpanel-app-launcher
layerrule = animation slide left, okpanel-system-menu
layerrule = animation popin, okpanel-alerts
```
