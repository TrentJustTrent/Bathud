import {Player} from "../utils/mpris";
import VerticalLabel from "../common/VerticalLabel";
import {truncateString} from "../utils/strings";
import {variableConfig} from "../../config/config";
import {alignmentToGtk} from "../utils/configHelper";
import {Gtk} from "ags/gtk4";
import {Accessor, createComputed, With} from "ags";

export default function (
    {
        player,
        vertical,
        flipped,
        compact,
    }: {
        player: Player,
        vertical: boolean,
        flipped: Accessor<boolean>,
        compact: Accessor<boolean>,
    }
) {
    const title = createComputed([
        player.title[0],
        variableConfig.verticalBar.mpris_track_info.textLength.asAccessor(),
        variableConfig.horizontalBar.mpris_track_info.textLength.asAccessor(),
    ], (title, vLength, hLength) => {
        return title ? truncateString(
            title,
            vertical ? vLength : hLength
        ) : "Unknown Track"
    })

    const artist = createComputed([
        player.artist[0],
        variableConfig.verticalBar.mpris_track_info.textLength.asAccessor(),
        variableConfig.horizontalBar.mpris_track_info.textLength.asAccessor(),
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
                <With value={flipped}>
                    {(isFlipped) => {
                        const alignment = variableConfig.verticalBar.mpris_track_info.textAlignment.asAccessor().as((align) =>
                            alignmentToGtk(align)
                        )
                        if (isFlipped) {
                            return <box
                                hexpand={true}
                                halign={Gtk.Align.CENTER}
                                orientation={Gtk.Orientation.HORIZONTAL}
                                heightRequest={variableConfig.verticalBar.mpris_track_info.minimumLength.asAccessor()}>
                                <VerticalLabel
                                    text={artist}
                                    fontSize={14}
                                    flipped={isFlipped}
                                    bold={false}
                                    alignment={alignment}
                                    foregroundColor={variableConfig.theme.bars.mpris_track_info.foreground.asAccessor()}
                                />
                                <VerticalLabel
                                    text={title}
                                    fontSize={14}
                                    flipped={isFlipped}
                                    bold={true}
                                    alignment={alignment}
                                    foregroundColor={variableConfig.theme.bars.mpris_track_info.foreground.asAccessor()}
                                />
                            </box>
                        } else {
                            return <box
                                hexpand={true}
                                halign={Gtk.Align.CENTER}
                                orientation={Gtk.Orientation.HORIZONTAL}
                                heightRequest={variableConfig.verticalBar.mpris_track_info.minimumLength.asAccessor()}>
                                <VerticalLabel
                                    text={title}
                                    fontSize={14}
                                    flipped={isFlipped}
                                    bold={true}
                                    alignment={alignment}
                                    foregroundColor={variableConfig.theme.bars.mpris_track_info.foreground.asAccessor()}
                                />
                                <VerticalLabel
                                    text={artist}
                                    fontSize={14}
                                    flipped={isFlipped}
                                    bold={false}
                                    alignment={alignment}
                                    foregroundColor={variableConfig.theme.bars.mpris_track_info.foreground.asAccessor()}
                                />
                            </box>
                        }
                    }}
                </With>
            </box>
        }
        {!vertical &&
            <box
                orientation={Gtk.Orientation.VERTICAL}
                valign={Gtk.Align.CENTER}
                widthRequest={variableConfig.horizontalBar.mpris_track_info.minimumLength.asAccessor()}>
                <label
                    marginStart={8}
                    cssClasses={["labelSmallBold", "barMprisTrackInfoForeground", "lineHeightCompact"]}
                    halign={variableConfig.horizontalBar.mpris_track_info.textAlignment.asAccessor().as((a) => alignmentToGtk(a))}
                    label={title}/>
                <label
                    marginStart={8}
                    cssClasses={["labelSmall", "barMprisTrackInfoForeground", "lineHeightCompact"]}
                    halign={variableConfig.horizontalBar.mpris_track_info.textAlignment.asAccessor().as((a) => alignmentToGtk(a))}
                    label={artist}/>
            </box>
        }
    </box>
}