import {Gtk} from "ags/gtk4"
import Pango from "gi://Pango?version=1.0";
import {Mpris, Player} from "../../utils/mpris"
import MprisControlButtons from "../../mpris/MprisControlButtons";
import {For} from "ags";

const mpris = Mpris.get_default()
const STREAMING_TRACK_LENGTH = 9999999999

function lengthStr(length: number) {
    const min = Math.floor(length / 60)
    const sec = Math.floor(length % 60)
    const sec0 = sec < 10 ? "0" : ""
    return `${min}:${sec0}${sec}`
}

function MediaPlayer({ player }: { player: Player }) {
    const { START, END, CENTER } = Gtk.Align

    const title = player.title[0](t =>
        t || "Unknown Track")

    const artist = player.artist[0](a =>
        a || "Unknown Artist")

    return <box
        cssClasses={["mediaPlayer"]}
        orientation={Gtk.Orientation.VERTICAL}>
        <label
            cssClasses={["labelSmallBold"]}
            ellipsize={Pango.EllipsizeMode.END}
            halign={CENTER}
            label={title}/>
        <label
            cssClasses={["labelSmall"]}
            ellipsize={Pango.EllipsizeMode.END}
            halign={CENTER}
            label={artist}/>
        <box
            cssClasses={["seekContainer"]}
            orientation={Gtk.Orientation.HORIZONTAL}>
            <label
                cssClasses={["labelSmall"]}
                halign={START}
                visible={player.trackLength[0](l => l > 0)}
                label={player.position[0](lengthStr)}
            />
            <slider
                cssClasses={["seek"]}
                hexpand={true}
                visible={player.trackLength[0](l => l > 0)}
                onChangeValue={({value}) => {
                    if (player.trackLength[0].get() > STREAMING_TRACK_LENGTH) {
                        return
                    }
                    player.setPosition(value * player.trackLength[0].get())
                }}
                value={player.position[0]((position) => {
                    return player.trackLength[0].get() > 0 ? position / player.trackLength[0].get() : 0
                })}
            />
            <label
                cssClasses={["labelSmall"]}
                halign={END}
                visible={player.trackLength[0](l => l > 0)}
                label={player.trackLength[0]((l) => {
                    if (l > STREAMING_TRACK_LENGTH) {
                        return " "
                    } else if (l > 0) {
                        return lengthStr(l)
                    } else {
                        return "0:00"
                    }
                })}
            />
        </box>
        <MprisControlButtons player={player} vertical={false}/>
    </box>
}

export default function () {
    return <box
        orientation={Gtk.Orientation.VERTICAL}>
        <For each={mpris.players[0]}>
            {(player) => (
                <MediaPlayer player={player}/>
            )}
        </For>
    </box>
}