import {Mpris} from "../utils/mpris";
import {With} from "ags";
import MprisControlButtons from "../mpris/MprisControlButtons";

export default function ({vertical}: { vertical: boolean }) {
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
                    foregroundCss={["barMprisControlsForeground"]}
                    backgroundCss={["barMprisControlsButtonBackground"]}/>
            }}
        </With>
    </box>
}