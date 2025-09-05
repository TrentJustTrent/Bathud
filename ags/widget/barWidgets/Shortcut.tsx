import OkButton from "../common/OkButton";
import {variableConfig} from "../../config/config";
import {Bar} from "../../config/bar";
import {Accessor, createBinding, createComputed} from "ags";
import {getHPadding, getVPadding} from "./BarWidgets";
import {Gtk} from "ags/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import {launchApp} from "../utils/launch";

function getIndicatorHAlign(bar: Bar) {
    switch (bar) {
        case Bar.LEFT:
            return Gtk.Align.START
        case Bar.RIGHT:
            return Gtk.Align.END
        case Bar.TOP:
        case Bar.BOTTOM:
            return Gtk.Align.CENTER
    }
}

function getIndicatorVAlign(bar: Bar) {
    switch (bar) {
        case Bar.LEFT:
        case Bar.RIGHT:
            return Gtk.Align.CENTER
        case Bar.TOP:
            return Gtk.Align.START
        case Bar.BOTTOM:
            return Gtk.Align.END
    }
}

export default function (
    {
        shortcutNumber,
        bar,
    }: {
        shortcutNumber: number
        bar: Bar,
    }
) {
    const hyprland = AstalHyprland.get_default()
    // @ts-ignore
    const label: Accessor<string> = variableConfig.barWidgets[`shortcut${shortcutNumber}`].icon.asAccessor()

    const indicatorVisible = createComputed([
        createBinding(hyprland, "clients"),
        // @ts-ignore
        variableConfig.barWidgets[`shortcut${shortcutNumber}`].class.asAccessor()
    ], (clients: AstalHyprland.Client[], clazz: string) => {
        return clients.filter((it) => it.class === clazz).length > 0
    })

    return <overlay
        $={(self) => {
            self.add_overlay(
                <box
                    canTarget={false}
                    canFocus={false}
                    hexpand={false}
                    vexpand={false}
                    visible={indicatorVisible}
                    cssClasses={[`barShortcut${shortcutNumber}Indicator`]}
                    halign={getIndicatorHAlign(bar)}
                    valign={getIndicatorVAlign(bar)}
                    widthRequest={4}
                    heightRequest={4}
                    marginStart={6}
                    marginBottom={4}
                    marginEnd={6}
                    marginTop={4}
                /> as Gtk.Box
            )
        }}>
        <OkButton
            hpadding={getHPadding(bar)}
            vpadding={getVPadding(bar)}
            labelCss={[`barShortcut${shortcutNumber}Foreground`]}
            backgroundCss={[`barShortcut${shortcutNumber}Background`]}
            label={label}
            onClicked={() => {
                // @ts-ignore
                launchApp([variableConfig.barWidgets[`shortcut${shortcutNumber}`].launch.get()])
            }}/>
    </overlay>
}