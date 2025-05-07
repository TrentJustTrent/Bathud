import {Player} from "../utils/mpris";
import {Gtk} from "astal/gtk4";
import VerticalLabel from "../common/VerticalLabel";
import {Binding} from "astal";
import {truncateString} from "../utils/strings";
import {config} from "../../config/config";

import {alignmentToGtk} from "../utils/configHelper";

export default function (
    {
        player,
        vertical,
        flipped,
    }: {
        player: Player,
        vertical: boolean,
        flipped: Binding<boolean>,
    }
) {
    const title = player.title(t =>
        t ? truncateString(
            t,
            vertical ? config.verticalBar.mpris_track_info.textLength : config.horizontalBar.mpris_track_info.textLength
        ) : "Unknown Track")

    const artist = player.artist(a =>
        a ?  truncateString(
            a,
            vertical ? config.verticalBar.mpris_track_info.textLength : config.horizontalBar.mpris_track_info.textLength
        ) : "Unknown Artist")

    return <box>
        {vertical &&
            <box
                hexpand={true}>
                {flipped.as((isFlipped) => {
                    if (isFlipped) {
                        return <box
                            hexpand={true}
                            halign={Gtk.Align.CENTER}
                            vertical={false}
                            heightRequest={config.verticalBar.mpris_track_info.minimumLength}>
                            <VerticalLabel
                                text={artist}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={false}
                                alignment={alignmentToGtk(config.verticalBar.mpris_track_info.textAlignment)}
                            />
                            <VerticalLabel
                                text={title}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={true}
                                alignment={alignmentToGtk(config.verticalBar.mpris_track_info.textAlignment)}
                            />
                        </box>
                    } else {
                        return <box
                            hexpand={true}
                            halign={Gtk.Align.CENTER}
                            vertical={false}
                            heightRequest={config.verticalBar.mpris_track_info.minimumLength}>
                            <VerticalLabel
                                text={title}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={true}
                                alignment={alignmentToGtk(config.verticalBar.mpris_track_info.textAlignment)}
                            />
                            <VerticalLabel
                                text={artist}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={false}
                                alignment={alignmentToGtk(config.verticalBar.mpris_track_info.textAlignment)}
                            />
                        </box>
                    }
                })}
            </box>
        }
        {!vertical &&
            <box
                vertical={true}
                widthRequest={config.horizontalBar.mpris_track_info.minimumLength}>
                <label
                    cssClasses={["labelSmallBold"]}
                    halign={alignmentToGtk(config.horizontalBar.mpris_track_info.textAlignment)}
                    label={title}/>
                <label
                    cssClasses={["labelSmall"]}
                    halign={alignmentToGtk(config.horizontalBar.mpris_track_info.textAlignment)}
                    label={artist}/>
            </box>
        }
    </box>
}