import {Player} from "../utils/mpris";
import {Gtk} from "astal/gtk4";
import VerticalLabel from "../common/VerticalLabel";
import {Binding} from "astal";
import {truncateString} from "../utils/strings";

export default function (
    {
        player,
        vertical,
        flipped,
    }: {
        player: Player,
        vertical: boolean,
        flipped?: Binding<boolean>,
    }
) {
    const title = player.title(t =>
        t ? truncateString(t, 30) : "Unknown Track")

    const artist = player.artist(a =>
        a ?  truncateString(a, 30) : "Unknown Artist")

    return <box>
        {vertical &&
            <box
                hexpand={true}
                halign={Gtk.Align.CENTER}
                vertical={false}>
                {flipped !== undefined && flipped.as((isFlipped) => {
                    if (isFlipped) {
                        return <box
                            hexpand={true}
                            halign={Gtk.Align.CENTER}
                            vertical={false}>
                            <VerticalLabel
                                text={artist}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={false}
                            />
                            <VerticalLabel
                                text={title}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={true}
                            />
                        </box>
                    } else {
                        return <box
                            hexpand={true}
                            halign={Gtk.Align.CENTER}
                            vertical={false}>
                            <VerticalLabel
                                text={title}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={true}
                            />
                            <VerticalLabel
                                text={artist}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={false}
                            />
                        </box>
                    }
                })}
                {flipped === undefined &&
                    <box
                    hexpand={true}
                    halign={Gtk.Align.CENTER}
                    vertical={false}>
                        <VerticalLabel
                            text={title}
                            fontSize={14}
                            flipped={false}
                            bold={true}
                        />
                        <VerticalLabel
                            text={artist}
                            fontSize={14}
                            flipped={false}
                            bold={false}
                        />
                    </box>
                }
            </box>
        }
        {!vertical &&
            <box
                vertical={true}>
                <label
                    cssClasses={["labelSmallBold"]}
                    halign={Gtk.Align.CENTER}
                    label={title}/>
                <label
                    cssClasses={["labelSmall"]}
                    halign={Gtk.Align.CENTER}
                    label={artist}/>
            </box>
        }
    </box>
}