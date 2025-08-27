import {Mpris} from "../utils/mpris";
import {Bar} from "../../config/bar";
import {With} from "ags";
import {variableConfig} from "../../config/config";
import MprisTrackInfo from "../mpris/MprisTrackInfo";

export default function ({vertical, bar}: { vertical: boolean, bar: Bar }) {
    const mpris = Mpris.get_default()
    return <box
        cssClasses={["barMprisTrackInfoBackground", "radiusSmall"]}>
        <With value={mpris.players[0]}>
            {(players) => {
                const player = players.find((player) => player.isPrimaryPlayer)

                if (player === undefined) {
                    return <box/>
                }

                let textLength
                let textAlignment
                let minimumLength
                let flipped

                switch (bar) {
                    case Bar.TOP:
                        textLength = variableConfig.topBar.mpris_track_info.textLength.asAccessor()
                        textAlignment = variableConfig.topBar.mpris_track_info.textAlignment.asAccessor()
                        minimumLength = variableConfig.topBar.mpris_track_info.minimumLength.asAccessor()
                        flipped = false
                        break
                    case Bar.BOTTOM:
                        textLength = variableConfig.bottomBar.mpris_track_info.textLength.asAccessor()
                        textAlignment = variableConfig.bottomBar.mpris_track_info.textAlignment.asAccessor()
                        minimumLength = variableConfig.bottomBar.mpris_track_info.minimumLength.asAccessor()
                        flipped = false
                        break
                    case Bar.LEFT:
                        textLength = variableConfig.leftBar.mpris_track_info.textLength.asAccessor()
                        textAlignment = variableConfig.leftBar.mpris_track_info.textAlignment.asAccessor()
                        minimumLength = variableConfig.leftBar.mpris_track_info.minimumLength.asAccessor()
                        flipped = false
                        break
                    case Bar.RIGHT:
                        textLength = variableConfig.rightBar.mpris_track_info.textLength.asAccessor()
                        textAlignment = variableConfig.rightBar.mpris_track_info.textAlignment.asAccessor()
                        minimumLength = variableConfig.rightBar.mpris_track_info.minimumLength.asAccessor()
                        flipped = true
                        break
                }

                return <MprisTrackInfo
                    player={player}
                    vertical={vertical}
                    isFlipped={flipped}
                    textLength={textLength}
                    textAlignment={textAlignment}
                    minimumLength={minimumLength}/>
            }}
        </With>
    </box>
}