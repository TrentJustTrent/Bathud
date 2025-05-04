import {bind, Binding, Variable} from "astal"
import {Gtk} from "astal/gtk4"
import Pango from "gi://Pango?version=1.0";
import RevealerRow from "../common/RevealerRow";
import {SystemMenuWindowName} from "./SystemMenuWindow";
import PowerProfiles from "gi://AstalPowerProfiles"

const powerProfiles = PowerProfiles.get_default()

export default function () {
    powerProfiles.get_profiles().forEach((profile) => {
        print(profile.profile)
    })
    const profiles = powerProfiles.get_profiles()

    return <RevealerRow
        visible={profiles.length !== 0}
        icon={bind(powerProfiles, "activeProfile").as((profile) => {
            if (profile === "battery-saver") {
                return "s"
            } else if (profile === "balanced") {
                return "b"
            } else if (profile === "performance") {
                return "p"
            } else {
                return "e"
            }
        })}
        iconOffset={0}
        windowName={SystemMenuWindowName}
        content={
            <label
                cssClasses={["labelMediumBold"]}
                halign={Gtk.Align.START}
                hexpand={true}
                ellipsize={Pango.EllipsizeMode.END}
                label={bind(powerProfiles, "activeProfile").as((profile) => {
                    if (profile === "battery-saver") {
                        return "s"
                    } else if (profile === "balanced") {
                        return "b"
                    } else if (profile === "performance") {
                        return "p"
                    } else {
                        return "e"
                    }
                })}/>
        }
        revealedContent={
            <box
                marginTop={10}
                vertical={true}>

            </box>
        }
    />
}