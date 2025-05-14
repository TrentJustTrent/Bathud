import {Player} from "../utils/mpris";
import {Gtk} from "astal/gtk4";
import VerticalLabel from "../common/VerticalLabel";
import {Binding, Variable} from "astal";
import {truncateString} from "../utils/strings";
import {variableConfig} from "../../config/config";

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
    const title = Variable.derive([
        player.title,
        variableConfig.verticalBar.mpris_track_info.textLength,
        variableConfig.horizontalBar.mpris_track_info.textLength,
    ], (title, vLength, hLength) => {
        return title ? truncateString(
            title,
            vertical ? vLength : hLength
        ) : "Unknown Track"
    })

    const artist = Variable.derive([
        player.artist,
        variableConfig.verticalBar.mpris_track_info.textLength,
        variableConfig.horizontalBar.mpris_track_info.textLength,
    ], (artist, vLength, hLength) => {
        return artist ?  truncateString(
            artist,
            vertical ? vLength : hLength
        ) : "Unknown Artist"
    })

    return <box>
        {vertical &&
            <box
                hexpand={true}>
                {flipped.as((isFlipped) => {
                    const alignment: Binding<Gtk.Align> = variableConfig.verticalBar.mpris_track_info.textAlignment().as((align) =>
                        alignmentToGtk(align)
                    )
                    if (isFlipped) {
                        return <box
                            hexpand={true}
                            halign={Gtk.Align.CENTER}
                            vertical={false}
                            heightRequest={variableConfig.verticalBar.mpris_track_info.minimumLength()}>
                            <VerticalLabel
                                text={artist()}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={false}
                                alignment={alignment}
                            />
                            <VerticalLabel
                                text={title()}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={true}
                                alignment={alignment}
                            />
                        </box>
                    } else {
                        return <box
                            hexpand={true}
                            halign={Gtk.Align.CENTER}
                            vertical={false}
                            heightRequest={variableConfig.verticalBar.mpris_track_info.minimumLength()}>
                            <VerticalLabel
                                text={title()}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={true}
                                alignment={alignment}
                            />
                            <VerticalLabel
                                text={artist()}
                                fontSize={14}
                                flipped={isFlipped}
                                bold={false}
                                alignment={alignment}
                            />
                        </box>
                    }
                })}
            </box>
        }
        {!vertical &&
            <box
                vertical={true}
                widthRequest={variableConfig.horizontalBar.mpris_track_info.minimumLength()}>
                <label
                    cssClasses={["labelSmallBold"]}
                    halign={variableConfig.horizontalBar.mpris_track_info.textAlignment().as((a) => alignmentToGtk(a))}
                    label={title()}/>
                <label
                    cssClasses={["labelSmall"]}
                    halign={variableConfig.horizontalBar.mpris_track_info.textAlignment().as((a) => alignmentToGtk(a))}
                    label={artist()}/>
            </box>
        }
    </box>
}