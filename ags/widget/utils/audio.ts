import Wp from "gi://AstalWp"
import {execAsync} from "astal/process";
import {config, projectDir} from "../../config/config";

export function getVolumeIcon(speaker?: Wp.Endpoint) {
    let volume = speaker?.volume
    let muted = speaker?.mute
    let speakerIcon = speaker?.icon
    if (volume == null || speakerIcon == null) return ""

    if (speakerIcon.includes("bluetooth")) {
        if (volume === 0 || muted) {
            return "󰟎"
        } else {
            return "󰥰"
        }
    } else if (speakerIcon.includes("headset")) {
        if (volume === 0 || muted) {
            return "󰟎"
        } else {
            return "󰋋"
        }
    } else {
        if (volume === 0 || muted) {
            return "󰝟"
        } else if (volume < 0.33) {
            return ""
        } else if (volume < 0.66) {
            return ""
        } else {
            return "󰕾"
        }
    }
}

export function getMicrophoneIcon(mic?: Wp.Endpoint): string {
    let volume = mic?.volume
    let muted = mic?.mute
    let micIcon = mic?.icon

    if (micIcon != null && micIcon.includes("bluetooth")) {
        if (volume === 0 || muted) {
            return "󰟎"
        } else {
            return "󰥰"
        }
    } else if (micIcon != null && micIcon.includes("headset")) {
        if (volume === 0 || muted) {
            return "󰋐"
        } else {
            return "󰋎"
        }
    } else {
        if (volume === 0 || muted) {
            return "󰍭"
        } else {
            return ""
        }
    }
}

export function toggleMuteEndpoint(endpoint?: Wp.Endpoint) {
    endpoint?.set_mute(!endpoint?.mute)
}

export function muteVolume() {
    const defaultSpeaker = Wp.get_default()!.audio.default_speaker
    defaultSpeaker?.set_mute(!defaultSpeaker?.mute)
    playVolumeTick()
}

export function increaseVolume() {
    const defaultSpeaker = Wp.get_default()!.audio.default_speaker
    const currentVolume = defaultSpeaker.volume
    if (currentVolume < 0.95) {
        defaultSpeaker.volume = currentVolume + 0.05
    } else {
        defaultSpeaker.volume = 1
    }
    playVolumeTick()
}

export function decreaseVolume() {
    const defaultSpeaker = Wp.get_default()!.audio.default_speaker
    const currentVolume = defaultSpeaker.volume
    if (currentVolume > 0.05) {
        defaultSpeaker.volume = currentVolume - 0.05
    } else {
        defaultSpeaker.volume = 0
    }
    playVolumeTick()
}

export function playVolumeTick() {
    if (config.sounds.playVolumeChangingSound) {
        let path = config.sounds.volumeChangingSoundPath !== ""
            ? config.sounds.volumeChangingSoundPath
            : `${projectDir}/sounds/audio-volume-change.oga`
        execAsync(`bash -c "play ${path}"`)
            .catch((error) => {
                console.error(error)
            })
    }
}

export function playCameraShutter() {
    if (config.sounds.playScreenshotSound) {
        let path = config.sounds.screenshotSoundPath !== ""
            ? config.sounds.screenshotSoundPath
            : `${projectDir}/sounds/camera-shutter.ogg`
        execAsync(`bash -c "play ${path}"`)
            .catch((error) => {
                console.error(error)
            })
    }
}

export function playBatteryWarning() {
    if (config.sounds.playLowBatteryWarningSound) {
        let path = config.sounds.lowBatteryWarningSoundPath !== ""
            ? config.sounds.lowBatteryWarningSoundPath
            : `${projectDir}/sounds/battery-low.ogg`
        execAsync(`bash -c "play ${path}"`)
            .catch((error) => {
                console.error(error)
            })
    }
}

export function playPowerPlug() {
    if (config.sounds.playChargingSound) {
        let path = config.sounds.chargingPlugInSoundPath !== ""
            ? config.sounds.chargingPlugInSoundPath
            : `${projectDir}/sounds/power-plug.ogg`
        execAsync(`bash -c "play ${path}"`)
            .catch((error) => {
                console.error(error)
            })
    }
}

export function playPowerUnplug() {
    if (config.sounds.playChargingSound) {
        let path = config.sounds.chargingUnplugSoundPath !== ""
            ? config.sounds.chargingUnplugSoundPath
            : `${projectDir}/sounds/power-unplug.ogg`
        execAsync(`bash -c "play ${path}"`)
            .catch((error) => {
                console.error(error)
            })
    }
}
