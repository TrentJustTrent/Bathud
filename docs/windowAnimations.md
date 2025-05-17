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

layerrule = blur, okpanel-system-menu
layerrule = ignorealpha 0.1, okpanel-system-menu
layerrule = blur, okpanel-calendar
layerrule = ignorealpha 0.1, okpanel-calendar
layerrule = blur, okpanel-app-launcher
layerrule = ignorealpha 0.1, okpanel-app-launcher
layerrule = blur, okpanel-screenshare
layerrule = ignorealpha 0.1, okpanel-screenshare
layerrule = blur, okpanel-screenshot
layerrule = ignorealpha 0.1, okpanel-screenshot
layerrule = blur, okpanel-notifications
layerrule = ignorealpha 0.1, okpanel-notifications
layerrule = blur, okpanel-notification-history
layerrule = ignorealpha 0.1, okpanel-notification-history
layerrule = blur, okpanel-clipboard-manager
layerrule = ignorealpha 0.1, okpanel-clipboard-manager
layerrule = blur, okpanel-alerts
layerrule = ignorealpha 0.1, okpanel-alerts

layerrule = animation slide top, okpanel-app-launcher
layerrule = animation slide left, okpanel-system-menu

```
