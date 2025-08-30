import {Mpris} from "../utils/mpris";
import {With} from "ags";
import MprisControlButtons from "../mpris/MprisControlButtons";
import {Bar} from "../../config/bar";
import {getHPadding, getVPadding} from "./BarWidgets";

export default function ({vertical, bar}: { vertical: boolean, bar: Bar }) {
    const mpris = Mpris.get_default()
    return <box
        cssClasses={["barMprisControlsBackground", "radiusSmall"]}>
        <With value={mpris.players[0]}>
            {(players) => {
                const player = players.find((player) => player.isPrimaryPlayer)

                if (player === undefined) {
                    return <box/>
                }

                return <MprisControlButtons
                    player={player}
                    vertical={vertical}
                    hpadding={getHPadding(bar)}
                    vpadding={getVPadding(bar)}
                    foregroundCss={["barMprisControlsForeground"]}
                    backgroundCss={["barMprisControlsButtonBackground"]}/>
            }}
        </With>
    </box>
}