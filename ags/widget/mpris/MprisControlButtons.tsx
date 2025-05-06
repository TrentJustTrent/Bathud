import {LoopStatus, PlaybackStatus, Player, ShuffleStatus} from "../utils/mpris";
import {Gtk} from "astal/gtk4";

export default function ({ player, vertical }: { player: Player, vertical: boolean }) {
    const playIcon = player.playbackStatus(s =>
        s === PlaybackStatus.Playing
            ? ""
            : ""
    )

    return <box
        halign={Gtk.Align.CENTER}
        vertical={vertical}>
        <button
            cssClasses={["iconButton"]}
            onClicked={() => {
                if (player.shuffleStatus.get() === ShuffleStatus.Enabled) {
                    player.setShuffleStatus(ShuffleStatus.Disabled)
                } else {
                    player.setShuffleStatus(ShuffleStatus.Enabled)
                }
            }}
            visible={player.shuffleStatus((shuffle) => shuffle !== ShuffleStatus.Unsupported)}
            label={player.shuffleStatus((shuffle) => {
                if (shuffle === ShuffleStatus.Enabled) {
                    return ""
                } else {
                    return "󰒞"
                }
            })}/>
        <button
            cssClasses={["iconButton"]}
            onClicked={() => {
                player.previousTrack()
            }}
            visible={player.canGoPrevious()}
            label=""/>
        <button
            cssClasses={["iconButton"]}
            onClicked={() => {
                player.playPause()
            }}
            visible={player.canControl()}
            label={playIcon}/>
        <button
            cssClasses={["iconButton"]}
            onClicked={() => {
                player.nextTrack()
            }}
            visible={player.canGoNext()}
            label=""/>
        <button
            cssClasses={["iconButton"]}
            onClicked={() => {
                if (player.loopStatus.get() === LoopStatus.None) {
                    player.setLoopStatus(LoopStatus.Playlist)
                } else if (player.loopStatus.get() === LoopStatus.Playlist) {
                    player.setLoopStatus(LoopStatus.Track)
                } else {
                    player.setLoopStatus(LoopStatus.None)
                }
            }}
            visible={player.loopStatus((status) => status !== LoopStatus.Unsupported)}
            label={player.loopStatus((status) => {
                if (status === LoopStatus.None) {
                    return "󰑗"
                } else if (status === LoopStatus.Playlist) {
                    return "󰑖"
                } else {
                    return "󰑘"
                }
            })}/>
    </box>
}