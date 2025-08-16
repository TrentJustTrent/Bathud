import {Astal, Gtk} from "ags/gtk4"
import App from "ags/gtk4/app"
import {execAsync} from "ags/process"
import Divider from "../common/Divider";
import Pango from "gi://Pango?version=1.0";
import {playCameraShutter} from "../utils/audio";
import RevealerRow from "../common/RevealerRow";
import {hideAllWindows} from "../utils/windows";
import {variableConfig} from "../../config/config";
import ScrimScrollWindow from "../common/ScrimScrollWindow";
import OkButton from "../common/OkButton";
import {projectDir} from "../../app";
import {createState, Setter, createBinding, For} from "ags";
import GLib from "gi://GLib?version=2.0";

export const [isRecording, isRecordingSetter] = createState(false)

export const ScreenshotWindowName = "screenshotWindow"

type AudioSource = {
    name: string;
    description: string;
    isMonitor: boolean;
};

type Codec = {
    display: string;
    lib: string;
}

enum SaveType {
    BOTH = 0,
    CLIPBOARD = 1,
    FILE = 2,
}

const saveTypeValues = (Object.values(SaveType) as SaveType[]).filter((v): v is SaveType => typeof v === "number")

const [audioOptions, audioOptionsSetter] = createState<AudioSource[]>([])
const codecs: Codec[] = [
    {
        display: "H264",
        lib: "libx264"
    },
    {
        display: "H265",
        lib: "libx265"
    },
]
const h264EncodingPresets = [
    "ultrafast",
    "superfast",
    "veryfast",
    "faster",
    "fast",
    "medium",
    "slow",
    "slower",
    "veryslow"
]
const crfQualityValues = [
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26
]

const delayOptions = [
    0,
    1,
    2,
    3,
    5,
    10
]

let screenshotDir = ""
let screenRecordingDir = ""

function getEncodingPresetIcon(value: string) {
    if (value.includes("fast")) {
        return "󰓅"
    } else if (value.includes("medium")) {
        return "󰾅"
    } else {
        return "󰾆"
    }
}

function getCrfQualityIcon(value: number) {
    if (value > 23) {
        return "󰨌"
    } else if (value > 20) {
        return "󰨍"
    } else {
        return "󰐵"
    }
}

function getSaveTypeLabel(value: SaveType) {
    switch (value) {
        case SaveType.BOTH:
            return "Save to file and clipboard"
        case SaveType.CLIPBOARD:
            return "Save to clipboard"
        case SaveType.FILE:
            return "Save to file"
    }
}

function getSaveTypeIcon(value: SaveType) {
    switch (value) {
        case SaveType.BOTH:
            return ""
        case SaveType.CLIPBOARD:
            return "󱉨"
        case SaveType.FILE:
            return ""
    }
}

function setDirectories() {
    execAsync([
        "bash",
        "-c",
        `
    mkdir -p $(xdg-user-dir PICTURES)/Screenshots
    echo $(xdg-user-dir PICTURES)/Screenshots
    `
    ]).then((value) => {
        screenshotDir = value
    })

    execAsync([
        "bash",
        "-c",
        `
        mkdir -p $(xdg-user-dir VIDEOS)/ScreenRecordings
        echo $(xdg-user-dir VIDEOS)/ScreenRecordings
        `
    ]).then((value) => {
        screenRecordingDir = value
    })
}

function updateAudioOptions() {
    execAsync([
        "bash",
        "-c",
        `pactl list sources | grep -E "Name:|Description"`
    ]).catch((error) => {
        console.error(error)
    }).then((value) => {
        if (typeof value !== "string") {
            return
        }

        // Split the input into lines
        const lines = value.split('\n');

        // Initialize an empty array to hold the result
        const result: AudioSource[] = [];

        // Iterate through the lines in pairs (Name, Description)
        for (let i = 0; i < lines.length; i += 2) {
            // Ensure the line is not empty and follows the expected format
            const nameLine = lines[i].trim();
            const descriptionLine = lines[i + 1]?.trim();

            // Match the "Name" prefix
            if (nameLine.startsWith("Name: ") && descriptionLine?.startsWith("Description: ")) {
                // Extract the name and description values
                const name = nameLine.replace("Name: ", "");
                const description = descriptionLine.replace("Description: ", "");
                const isMonitor = nameLine.includes("monitor")

                // Add to the result array
                result.push({ name, description, isMonitor });
            }
        }

        audioOptionsSetter(result)
    })
}

function showScreenshotNotification(filePath: string, saveType: SaveType) {
    const appName = "Screenshot"
    switch (saveType) {
        case SaveType.FILE:
            showSavedNotification(filePath, appName)
            break
        case SaveType.CLIPBOARD:
            showCopiedNotification(appName)
            break
        case SaveType.BOTH:
            showSavedAndCopiedNotification(filePath, appName)
            break
    }

}

function showScreenRecordingNotification(filePath: string) {
    showSavedNotification(filePath, "Screen Recording")
}

function showSavedNotification(
    filePath: string,
    appName: string
) {
    execAsync([
        "bash",
        "-c",
        `
        ACTION_VIEW="viewScreenshot"
        ACTION_OPEN_DIR="openDir"
        # Send a notification with an action to view the file
        notify-send "File saved at ${filePath}" \
            --app-name="${appName}" \
            --action=$ACTION_VIEW="View" \
            --action=$ACTION_OPEN_DIR="Show in Files" |
        while read -r action; do
            if [[ "$action" == $ACTION_OPEN_DIR ]]; then
                xdg-open "$(dirname "${filePath}")"
            fi
            if [[ "$action" == $ACTION_VIEW ]]; then
                xdg-open ${filePath}
            fi
        done
    `
    ]).catch((error) => {
        console.error(error)
    }).then((value) => {
        console.log(value)
    })
}

function showSavedAndCopiedNotification(
    filePath: string,
    appName: string
) {
    execAsync([
        "bash",
        "-c",
        `
        ACTION_VIEW="viewScreenshot"
        ACTION_OPEN_DIR="openDir"
        # Send a notification with an action to view the file
        notify-send "Image copied to clipboard and file saved at ${filePath}" \
            --app-name="${appName}" \
            --action=$ACTION_VIEW="View" \
            --action=$ACTION_OPEN_DIR="Show in Files" |
        while read -r action; do
            if [[ "$action" == $ACTION_OPEN_DIR ]]; then
                xdg-open "$(dirname "${filePath}")"
            fi
            if [[ "$action" == $ACTION_VIEW ]]; then
                xdg-open ${filePath}
            fi
        done
    `
    ]).catch((error) => {
        console.error(error)
    }).then((value) => {
        console.log(value)
    })
}

function showCopiedNotification(
    appName: string
) {
    execAsync([
        "bash",
        "-c",
        `
        ACTION_VIEW="viewScreenshot"
        ACTION_OPEN_DIR="openDir"
        # Send a notification with an action to view the file
        notify-send "Image copied to clipboard" \
            --app-name="${appName}"
    `
    ]).catch((error) => {
        console.error(error)
    }).then((value) => {
        console.log(value)
    })
}

function generateFileName(): string {
    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
    return `${time}_screenshot.png`
}

function ScreenshotButton(
    {
        icon,
        label,
        onClicked
    } : {
        icon: string,
        label: string,
        onClicked: () => void
    }
) {
    return <button
        widthRequest={115}
        cssClasses={["screenshotButton"]}
        marginStart={8}
        marginEnd={8}
        onClicked={onClicked}>
        <box
            orientation={Gtk.Orientation.VERTICAL}>
            <label
                cssClasses={["screenShotLabel"]}
                label={icon}/>
            <label
                label={label}/>
        </box>
    </button>
}

function ScreenShots() {
    const [delay, delaySetter] = createState(0)
    const [saveType, saveTypeSetter] = createState(SaveType.BOTH)
    let delayRevealedSetter: Setter<boolean> | null = null
    let saveTypeRevealedSetter: Setter<boolean> | null = null

    return <box
        orientation={Gtk.Orientation.VERTICAL}>
        <label
            cssClasses={["labelLargeBold"]}
            marginBottom={8}
            label="Screenshot"/>
        <RevealerRow
            icon={"󰔛"}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                delayRevealedSetter = revealed[1]
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={delay.as((value) => {
                        if (value === 1) {
                            return `Delay: ${value} second`
                        }
                        return `Delay: ${value} seconds`
                    })}/>
            }
            revealedContent={
                <box
                    orientation={Gtk.Orientation.VERTICAL}>
                    {delayOptions.map((value) => {
                        return <OkButton
                            hexpand={true}
                            labelHalign={Gtk.Align.START}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={`󰔛  ${value} seconds`}
                            onClicked={() => {
                                delaySetter(value)
                                if (delayRevealedSetter !== null) {
                                    delayRevealedSetter(false)
                                }
                            }}/>
                    })}
                </box>
            }/>
        <RevealerRow
            icon={saveType.as((value) => {
                return getSaveTypeIcon(value)
            })}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                saveTypeRevealedSetter = revealed[1]
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={saveType.as((value) => {
                        return getSaveTypeLabel(value)
                    })}/>
            }
            revealedContent={
                <box
                    orientation={Gtk.Orientation.VERTICAL}>
                    {saveTypeValues.map((value) => {
                        let label = `${getSaveTypeIcon(value)}  ${getSaveTypeLabel(value)}`
                        return <OkButton
                            hexpand={true}
                            labelHalign={Gtk.Align.START}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={label}
                            onClicked={() => {
                                saveTypeSetter(value)
                                if (saveTypeRevealedSetter !== null) {
                                    saveTypeRevealedSetter(false)
                                }
                            }}/>
                    })}
                </box>
            }/>
        <box
            marginTop={8}
            orientation={Gtk.Orientation.HORIZONTAL}>
            <ScreenshotButton
                icon={""}
                label={"All"}
                onClicked={() => {
                    hideAllWindows()
                    const dir = screenshotDir
                    const fileName = generateFileName()
                    const path = `${dir}/${fileName}`
                    const allDelay = Math.max(1, delay.get())
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                                    ${projectDir}/shellScripts/hyprshot -m all -o ${dir} -f ${fileName} -D ${allDelay} --save-type ${saveType.get()}
                            `
                        ]
                    ).catch((error) => {
                        console.error(error)
                    }).finally(() => {
                        playCameraShutter()
                        showScreenshotNotification(path, saveType.get())
                    })
                }}/>
            <ScreenshotButton
                icon={"󰹑"}
                label={"Monitor"}
                onClicked={() => {
                    hideAllWindows()
                    const dir = screenshotDir
                    const fileName = generateFileName()
                    const path = `${dir}/${fileName}`
                    let canceled = false
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                                    ${projectDir}/shellScripts/hyprshot -m output -o ${dir} -f ${fileName} -D ${delay.get()} --save-type ${saveType.get().valueOf()}
                            `
                        ]
                    ).catch((error) => {
                        const message = typeof error === "string" ? error : error?.toString?.() ?? "";
                        if (message.includes("selection cancelled")) {
                            canceled = true;
                        }
                        console.error(error)
                    }).finally(() => {
                        if (!canceled) {
                            playCameraShutter()
                            showScreenshotNotification(path, saveType.get())
                        }
                    })
                }}/>
            <ScreenshotButton
                icon={""}
                label={"Window"}
                onClicked={() => {
                    hideAllWindows()
                    const dir = screenshotDir
                    const fileName = generateFileName()
                    const path = `${dir}/${fileName}`
                    let canceled = false
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                                    ${projectDir}/shellScripts/hyprshot -m window -o ${dir} -f ${fileName} -D ${delay.get()} --save-type ${saveType.get().valueOf()}
                            `
                        ]
                    ).catch((error) => {
                        const message = typeof error === "string" ? error : error?.toString?.() ?? "";
                        if (message.includes("selection cancelled")) {
                            canceled = true;
                        }
                        console.error(error)
                    }).finally(() => {
                        if (!canceled) {
                            playCameraShutter()
                            showScreenshotNotification(path, saveType.get())
                        }
                    })
                }}/>
            <ScreenshotButton
                icon={""}
                label={"Area"}
                onClicked={() => {
                    hideAllWindows()
                    const dir = screenshotDir
                    const fileName = generateFileName()
                    const path = `${dir}/${fileName}`
                    let canceled = false
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                                    ${projectDir}/shellScripts/hyprshot -m region -o ${dir} -f ${fileName} -D ${delay.get()} --save-type ${saveType.get().valueOf()}
                            `
                        ]
                    ).catch((error) => {
                        const message = typeof error === "string" ? error : error?.toString?.() ?? "";
                        if (message.includes("selection cancelled")) {
                            canceled = true;
                        }
                        console.error(error)
                    }).finally(() => {
                        if (!canceled) {
                            playCameraShutter()
                            showScreenshotNotification(path, saveType.get())
                        }
                    })
                }}/>
        </box>
    </box>
}

function ScreenRecording() {
    const [selectedAudio, selectedAudioSetter] = createState<AudioSource | null>(null)
    const [selectedCodec, selectedCodecSetter] = createState(codecs[0])
    const [selectedEncodingPreset, selectedEncodingPresetSetter] = createState("medium")
    const [selectedCrfQuality, selectedCrfQualitySetter] = createState(20)

    let audioRevealedSetter: Setter<boolean> | null = null
    let codecRevealedSetter: Setter<boolean> | null = null
    let encodingRevealedSetter: Setter<boolean> | null = null
    let crfRevealedSetter: Setter<boolean> | null = null

    setTimeout(() => {
        createBinding(App.get_window(ScreenshotWindowName)!, "visible").subscribe(() => {
            if (!App.get_window(ScreenshotWindowName)?.visible) {
                selectedAudioSetter(null)
                selectedCodecSetter(codecs[0])
                selectedEncodingPresetSetter("medium")
                selectedCrfQualitySetter(20)
            } else {
                updateAudioOptions()
            }
        })
    }, 1_000)


    return <box
        orientation={Gtk.Orientation.VERTICAL}>
        <label
            cssClasses={["labelLargeBold"]}
            marginBottom={8}
            label="Screen Record"/>
        <RevealerRow
            icon={selectedAudio.as((value) => {
                if (value === null) {
                    return "󰝟"
                } else {
                    return value.isMonitor ? "󰕾" : ""
                }
            })}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                audioRevealedSetter = revealed[1]
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={selectedAudio.as((value) => {
                        if (value === null) {
                            return "No Audio"
                        } else {
                            return value.description
                        }
                    })}/>
            }
            revealedContent={
                <box
                    orientation={Gtk.Orientation.VERTICAL}>
                    <OkButton
                        hexpand={true}
                        labelHalign={Gtk.Align.START}
                        ellipsize={Pango.EllipsizeMode.END}
                        label={`󰝟  No Audio`}
                        onClicked={() => {
                            selectedAudioSetter(null)
                            if (audioRevealedSetter !== null) {
                                audioRevealedSetter(false)
                            }
                        }}/>
                    <For each={audioOptions}>
                        {(option) => {
                            return <OkButton
                                hexpand={true}
                                labelHalign={Gtk.Align.START}
                                ellipsize={Pango.EllipsizeMode.END}
                                label={`${option.isMonitor ? "󰕾" : ""}  ${option.description}`}
                                onClicked={() => {
                                    selectedAudioSetter(option)
                                    if (audioRevealedSetter !== null) {
                                        audioRevealedSetter(false)
                                    }
                                }}/>
                        }}
                    </For>
                </box>
            }
        />
        <RevealerRow
            icon="󰕧"
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                codecRevealedSetter = revealed[1]
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={selectedCodec.as((value) => {
                        return `${value.display} codec`
                    })}/>
            }
            revealedContent={
                <box
                    orientation={Gtk.Orientation.VERTICAL}>
                    {codecs.map((value) => {
                        return <OkButton
                            hexpand={true}
                            labelHalign={Gtk.Align.START}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={`󰕧  ${value.display}`}
                            onClicked={() => {
                                selectedCodecSetter(value)
                                if (codecRevealedSetter !== null) {
                                    codecRevealedSetter(false)
                                }
                            }}/>
                    })}
                </box>
            }
        />
        <RevealerRow
            icon={selectedEncodingPreset.as((value) => {
                return getEncodingPresetIcon(value)
            })}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                encodingRevealedSetter = revealed[1]
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={selectedEncodingPreset.as((value) => {
                        return `${value.charAt(0).toUpperCase() + value.slice(1)} encoding speed`
                    })}/>
            }
            revealedContent={
                <box
                    orientation={Gtk.Orientation.VERTICAL}>
                    {h264EncodingPresets.map((value) => {
                        return <OkButton
                            hexpand={true}
                            labelHalign={Gtk.Align.START}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={`${getEncodingPresetIcon(value)}  ${value.charAt(0).toUpperCase() + value.slice(1)}`}
                            onClicked={() => {
                                selectedEncodingPresetSetter(value)
                                if (encodingRevealedSetter !== null) {
                                    encodingRevealedSetter(false)
                                }
                            }}/>
                    })}
                </box>
            }
        />
        <RevealerRow
            icon={selectedCrfQuality.as((value) => {
                return getCrfQualityIcon(value)
            })}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                crfRevealedSetter = revealed[1]
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={selectedCrfQuality.as((value) => {
                        return `${value} CRF`
                    })}/>
            }
            revealedContent={
                <box
                    orientation={Gtk.Orientation.VERTICAL}>
                    {crfQualityValues.map((value) => {
                        return <OkButton
                            hexpand={true}
                            labelHalign={Gtk.Align.START}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={`${getCrfQualityIcon(value)}  ${value}`}
                            onClicked={() => {
                                selectedCrfQualitySetter(value)
                                if (crfRevealedSetter !== null) {
                                    crfRevealedSetter(false)
                                }
                            }}/>
                    })}
                </box>
            }
        />
        <box
            orientation={Gtk.Orientation.HORIZONTAL}
            marginTop={8}>
            <ScreenshotButton
                icon={""}
                label={"All"}
                onClicked={() => {
                    isRecordingSetter(true)
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenRecordingDir}/${time}_record.mp4`
                    const audioParam = selectedAudio.get() !== null ? `--audio=${selectedAudio.get()!.name}` : ""
                    const command = `wf-recorder --file=${path} ${audioParam} -p preset=${selectedEncodingPreset.get()} -p crf=${selectedCrfQuality.get()} -c ${selectedCodec.get().lib}`
                    console.log(command)
                    hideAllWindows()
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                            sleep 0.7
                            ${command}
                            `
                        ]
                    ).catch((error) => {
                        console.error(error)
                    }).finally(() => {
                        isRecordingSetter(false)
                        showScreenRecordingNotification(path)
                    })
                }}/>
            <ScreenshotButton
                icon={"󰹑"}
                label={"Monitor"}
                onClicked={() => {
                    isRecordingSetter(true)
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenRecordingDir}/${time}_record.mp4`
                    const audioParam = selectedAudio.get() !== null ? `--audio=${selectedAudio.get()!.name}` : ""
                    const command = `wf-recorder --file=${path} -g "$(slurp -o)" ${audioParam} -p preset=${selectedEncodingPreset.get()} -p crf=${selectedCrfQuality.get()} -c ${selectedCodec.get().lib}`
                    console.log(command)
                    hideAllWindows()
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                            ${command}
                            `
                        ]
                    ).catch((error) => {
                        console.error(error)
                    }).finally(() => {
                        isRecordingSetter(false)
                        showScreenRecordingNotification(path)
                    })
                }}/>
            <ScreenshotButton
                icon={""}
                label={"Window"}
                onClicked={() => {
                    isRecordingSetter(true)
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenRecordingDir}/${time}_record.mp4`
                    const audioParam = selectedAudio.get() !== null ? `--audio=${selectedAudio.get()!.name}` : ""
                    const command = `wf-recorder --file=${path} -g "$(${projectDir}/shellScripts/grabWindow)" ${audioParam} -p preset=${selectedEncodingPreset.get()} -p crf=${selectedCrfQuality.get()} -c ${selectedCodec.get().lib}`
                    console.log(command)
                    hideAllWindows()
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                            ${command}
                            `
                        ]
                    ).catch((error) => {
                        console.error(error)
                    }).finally(() => {
                        isRecordingSetter(false)
                        showScreenRecordingNotification(path)
                    })
                }}/>
            <ScreenshotButton
                icon={""}
                label={"Area"}
                onClicked={() => {
                    isRecordingSetter(true)
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenRecordingDir}/${time}_record.mp4`
                    const audioParam = selectedAudio.get() !== null ? `--audio=${selectedAudio.get()!.name}` : ""
                    const command = `wf-recorder --file=${path} -g "$(slurp)" ${audioParam} -p preset=${selectedEncodingPreset.get()} -p crf=${selectedCrfQuality.get()} -c ${selectedCodec.get().lib}`
                    console.log(command)
                    hideAllWindows()
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                            ${command}
                            `
                        ]
                    ).catch((error) => {
                        console.error(error)
                    }).finally(() => {
                        isRecordingSetter(false)
                        showScreenRecordingNotification(path)
                    })
                }}/>
        </box>
    </box>
}

export default function () {
    setDirectories()
    updateAudioOptions()

    return <ScrimScrollWindow
        namespace={"okpanel-screenshot"}
        monitor={variableConfig.mainMonitor.asAccessor()}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        windowName={ScreenshotWindowName}
        topExpand={true}
        bottomExpand={true}
        leftExpand={false}
        rightExpand={false}
        contentWidth={560}
        content={
            <box
                orientation={Gtk.Orientation.VERTICAL}
                marginTop={20}
                marginBottom={20}
                marginStart={20}
                marginEnd={20}>
                <ScreenShots/>
                <box marginTop={20}/>
                <Divider/>
                <box marginTop={10}/>
                <ScreenRecording/>
            </box>
        }/>
}