# Window Animations and Blur

Animations and blur can be controlled via hyprland layer rules.
You can read about layer rules [here](https://wiki.hyprland.org/Configuring/Window-Rules/#layer-rules) and 
animations [here](https://wiki.hyprland.org/Configuring/Animations/#general)

You can also [change the way the blur looks](https://wiki.hyprland.org/Configuring/Variables/#blur).

## Window namespaces

These are the namespace names of the available windows and bars.

```
okpanel-frame
okpanel-notifications
okpanel-alerts
```

## Example rule set

```
layerrule = blur, okpanel-frame
layerrule = blur, okpanel-notifications
layerrule = blur, okpanel-alerts

layerrule = ignorezero, okpanel-frame
layerrule = ignorezero, okpanel-notifications
layerrule = ignorezero, okpanel-alerts

layerrule = animation slide left, okpanel-alerts

```
