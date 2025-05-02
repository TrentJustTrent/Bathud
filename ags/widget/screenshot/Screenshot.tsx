import {App, Astal, Gdk, Gtk} from "astal/gtk4"
import {execAsync} from "astal/process"
import {bind, Variable, GLib} from "astal"
import Divider from "../common/Divider";
import Pango from "gi://Pango?version=1.0";
import {playCameraShutter} from "../utils/audio";
import RevealerRow from "../common/RevealerRow";
import {hideAllWindows} from "../utils/windows";
import {projectDir} from "../../config/config";

export const isRecording = Variable(false)

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

const audioOptions = Variable<AudioSource[]>([])
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
        print(error)
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

        audioOptions.set(result)
    })
}

function showScreenshotNotification(filePath: string) {
    showNotification(filePath, "Screenshot")
}

function showScreenRecordingNotification(filePath: string) {
    showNotification(filePath, "Screen Recording")
}

function showNotification(
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
        print(error)
    }).then((value) => {
        print(value)
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
        cssClasses={["primaryButton"]}
        marginStart={8}
        marginEnd={8}
        onClicked={onClicked}>
        <box
            vertical={true}>
            <label
                cssClasses={["screenShotLabel"]}
                label={icon}/>
            <label
                label={label}/>
        </box>
    </button>
}

function ScreenShots() {
    const delay = Variable(0)
    let delayRevealed: Variable<boolean> | null = null

    return <box
        vertical={true}>
        <label
            cssClasses={["labelLargeBold"]}
            marginBottom={8}
            label="Screenshot"/>
        <RevealerRow
            icon={"󰔛"}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                delayRevealed = revealed
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={delay().as((value) => {
                        if (value === 1) {
                            return `Delay: ${value} second`
                        }
                        return `Delay: ${value} seconds`
                    })}/>
            }
            revealedContent={
                <box
                    vertical={true}>
                    {delayOptions.map((value) => {
                        return <button
                            hexpand={true}
                            cssClasses={["iconButton"]}
                            onClicked={() => {
                                delay.set(value)
                                delayRevealed?.set(false)
                            }}>
                            <label
                                marginStart={8}
                                marginEnd={8}
                                halign={Gtk.Align.START}
                                cssClasses={["labelSmall"]}
                                ellipsize={Pango.EllipsizeMode.END}
                                label={`󰔛  ${value} seconds`}/>
                        </button>
                    })}
                </box>
            }/>
        <box
            marginTop={8}
            vertical={false}>
            <ScreenshotButton
                icon={""}
                label={"All"}
                onClicked={() => {
                    hideAllWindows()
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenshotDir}/${time}_screenshot.png`
                    execAsync(
                        [
                            "bash",
                            "-c",
                            `
                                    sleep ${delay.get()}
                                    grim ${path}
                            `
                        ]
                    ).catch((error) => {
                        print(error)
                    }).finally(() => {
                        playCameraShutter()
                        showScreenshotNotification(path)
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
                                    ${projectDir}/shellScripts/hyprshot -m output -o ${dir} -f ${fileName} -D ${delay.get()}
                            `
                        ]
                    ).catch((error) => {
                        const message = typeof error === "string" ? error : error?.toString?.() ?? "";
                        if (message.includes("selection cancelled")) {
                            canceled = true;
                        }
                        print(error)
                    }).finally(() => {
                        if (!canceled) {
                            playCameraShutter()
                            showScreenshotNotification(path)
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
                                    ${projectDir}/shellScripts/hyprshot -m window -o ${dir} -f ${fileName} -D ${delay.get()}
                            `
                        ]
                    ).catch((error) => {
                        const message = typeof error === "string" ? error : error?.toString?.() ?? "";
                        if (message.includes("selection cancelled")) {
                            canceled = true;
                        }
                        print(error)
                    }).finally(() => {
                        if (!canceled) {
                            playCameraShutter()
                            showScreenshotNotification(path)
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
                                    ${projectDir}/shellScripts/hyprshot -m region -o ${dir} -f ${fileName} -D ${delay.get()}
                            `
                        ]
                    ).catch((error) => {
                        const message = typeof error === "string" ? error : error?.toString?.() ?? "";
                        if (message.includes("selection cancelled")) {
                            canceled = true;
                        }
                        print(error)
                    }).finally(() => {
                        if (!canceled) {
                            playCameraShutter()
                            showScreenshotNotification(path)
                        }
                    })
                }}/>
        </box>
    </box>
}

function ScreenRecording() {
    const selectedAudio = Variable<AudioSource | null>(null)
    const selectedCodec = Variable(codecs[0])
    const selectedEncodingPreset = Variable("medium")
    const selectedCrfQuality = Variable(20)

    let audioRevealed: Variable<boolean> | null = null
    let codecRevealed: Variable<boolean> | null = null
    let encodingRevealed: Variable<boolean> | null = null
    let crfRevealed: Variable<boolean> | null = null

    setTimeout(() => {
        bind(App.get_window(ScreenshotWindowName)!, "visible").subscribe((visible) => {
            if (!visible) {
                selectedAudio.set(null)
                selectedCodec.set(codecs[0])
                selectedEncodingPreset.set("medium")
                selectedCrfQuality.set(20)
            } else {
                updateAudioOptions()
            }
        })
    }, 1_000)


    return <box
        vertical={true}>
        <label
            cssClasses={["labelLargeBold"]}
            marginBottom={8}
            label="Screen Record"/>
        <RevealerRow
            icon={selectedAudio().as((value) => {
                if (value === null) {
                    return "󰝟"
                } else {
                    return value.isMonitor ? "󰕾" : ""
                }
            })}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                audioRevealed = revealed
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={selectedAudio().as((value) => {
                        if (value === null) {
                            return "No Audio"
                        } else {
                            return value.description
                        }
                    })}/>
            }
            revealedContent={
                <box
                    vertical={true}>
                    <button
                        hexpand={true}
                        cssClasses={["iconButton"]}
                        onClicked={() => {
                            selectedAudio.set(null)
                            audioRevealed?.set(false)
                        }}>
                        <label
                            marginStart={8}
                            marginEnd={8}
                            halign={Gtk.Align.START}
                            cssClasses={["labelSmall"]}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={`󰝟  No Audio`}/>
                    </button>
                    {audioOptions().as((options) => {
                        return options.map((option) => {
                            return <button
                                hexpand={true}
                                cssClasses={["iconButton"]}
                                onClicked={() => {
                                    selectedAudio.set(option)
                                    audioRevealed?.set(false)
                                }}>
                                <label
                                    marginStart={8}
                                    marginEnd={8}
                                    halign={Gtk.Align.START}
                                    cssClasses={["labelSmall"]}
                                    ellipsize={Pango.EllipsizeMode.END}
                                    label={`${option.isMonitor ? "󰕾" : ""}  ${option.description}`}/>
                            </button>
                        })
                    })}
                </box>
            }
        />
        <RevealerRow
            icon="󰕧"
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                codecRevealed = revealed
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={selectedCodec().as((value) => {
                        return `${value.display} codec`
                    })}/>
            }
            revealedContent={
                <box
                    vertical={true}>
                    {codecs.map((value) => {
                        return <button
                            hexpand={true}
                            cssClasses={["iconButton"]}
                            onClicked={() => {
                                selectedCodec.set(value)
                                codecRevealed?.set(false)
                            }}>
                            <label
                                marginStart={8}
                                marginEnd={8}
                                halign={Gtk.Align.START}
                                cssClasses={["labelSmall"]}
                                ellipsize={Pango.EllipsizeMode.END}
                                label={`󰕧  ${value.display}`}/>
                        </button>
                    })}
                </box>
            }
        />
        <RevealerRow
            icon={selectedEncodingPreset().as((value) => {
                return getEncodingPresetIcon(value)
            })}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                encodingRevealed = revealed
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={selectedEncodingPreset().as((value) => {
                        return `${value.charAt(0).toUpperCase() + value.slice(1)} encoding speed`
                    })}/>
            }
            revealedContent={
                <box
                    vertical={true}>
                    {h264EncodingPresets.map((value) => {
                        return <button
                            hexpand={true}
                            cssClasses={["iconButton"]}
                            onClicked={() => {
                                selectedEncodingPreset.set(value)
                                encodingRevealed?.set(false)
                            }}>
                            <label
                                marginStart={8}
                                marginEnd={8}
                                halign={Gtk.Align.START}
                                cssClasses={["labelSmall"]}
                                ellipsize={Pango.EllipsizeMode.END}
                                label={`${getEncodingPresetIcon(value)}  ${value.charAt(0).toUpperCase() + value.slice(1)}`}/>
                        </button>
                    })}
                </box>
            }
        />
        <RevealerRow
            icon={selectedCrfQuality().as((value) => {
                return getCrfQualityIcon(value)
            })}
            iconOffset={0}
            windowName={ScreenshotWindowName}
            setup={(revealed) => {
                crfRevealed = revealed
            }}
            content={
                <label
                    cssClasses={["labelMediumBold"]}
                    halign={Gtk.Align.START}
                    hexpand={true}
                    ellipsize={Pango.EllipsizeMode.END}
                    label={selectedCrfQuality().as((value) => {
                        return `${value} CRF`
                    })}/>
            }
            revealedContent={
                <box
                    vertical={true}>
                    {crfQualityValues.map((value) => {
                        return <button
                            hexpand={true}
                            cssClasses={["iconButton"]}
                            onClicked={() => {
                                selectedCrfQuality.set(value)
                                crfRevealed?.set(false)
                            }}>
                            <label
                                marginStart={8}
                                marginEnd={8}
                                halign={Gtk.Align.START}
                                cssClasses={["labelSmall"]}
                                ellipsize={Pango.EllipsizeMode.END}
                                label={`${getCrfQualityIcon(value)}  ${value}`}/>
                        </button>
                    })}
                </box>
            }
        />
        <box
            vertical={false}
            marginTop={8}>
            <ScreenshotButton
                icon={""}
                label={"All"}
                onClicked={() => {
                    isRecording.set(true)
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenRecordingDir}/${time}_record.mp4`
                    const audioParam = selectedAudio.get() !== null ? `--audio=${selectedAudio.get()!.name}` : ""
                    const command = `wf-recorder --file=${path} ${audioParam} -p preset=${selectedEncodingPreset.get()} -p crf=${selectedCrfQuality.get()} -c ${selectedCodec.get().lib}`
                    print(command)
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
                        print(error)
                    }).finally(() => {
                        isRecording.set(false)
                        showScreenRecordingNotification(path)
                    })
                }}/>
            <ScreenshotButton
                icon={"󰹑"}
                label={"Monitor"}
                onClicked={() => {
                    isRecording.set(true)
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenRecordingDir}/${time}_record.mp4`
                    const audioParam = selectedAudio.get() !== null ? `--audio=${selectedAudio.get()!.name}` : ""
                    const command = `wf-recorder --file=${path} -g "$(slurp -o)" ${audioParam} -p preset=${selectedEncodingPreset.get()} -p crf=${selectedCrfQuality.get()} -c ${selectedCodec.get().lib}`
                    print(command)
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
                        print(error)
                    }).finally(() => {
                        isRecording.set(false)
                        showScreenRecordingNotification(path)
                    })
                }}/>
            <ScreenshotButton
                icon={""}
                label={"Window"}
                onClicked={() => {
                    isRecording.set(true)
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenRecordingDir}/${time}_record.mp4`
                    const audioParam = selectedAudio.get() !== null ? `--audio=${selectedAudio.get()!.name}` : ""
                    const command = `wf-recorder --file=${path} -g "$(${projectDir}/shellScripts/grabWindow)" ${audioParam} -p preset=${selectedEncodingPreset.get()} -p crf=${selectedCrfQuality.get()} -c ${selectedCodec.get().lib}`
                    print(command)
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
                        print(error)
                    }).finally(() => {
                        isRecording.set(false)
                        showScreenRecordingNotification(path)
                    })
                }}/>
            <ScreenshotButton
                icon={""}
                label={"Area"}
                onClicked={() => {
                    isRecording.set(true)
                    const time = GLib.DateTime.new_now_local().format("%Y_%m_%d_%H_%M_%S")!
                    const path = `${screenRecordingDir}/${time}_record.mp4`
                    const audioParam = selectedAudio.get() !== null ? `--audio=${selectedAudio.get()!.name}` : ""
                    const command = `wf-recorder --file=${path} -g "$(slurp)" ${audioParam} -p preset=${selectedEncodingPreset.get()} -p crf=${selectedCrfQuality.get()} -c ${selectedCodec.get().lib}`
                    print(command)
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
                        print(error)
                    }).finally(() => {
                        isRecording.set(false)
                        showScreenRecordingNotification(path)
                    })
                }}/>
        </box>
    </box>
}

export default function () {
    setDirectories()
    updateAudioOptions()

    return <window
        cssClasses={["transparentBackground"]}
        name={ScreenshotWindowName}
        application={App}
        layer={Astal.Layer.OVERLAY}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        keymode={Astal.Keymode.EXCLUSIVE}
        margin={5}
        visible={false}
        onKeyPressed={function (_, key) {
            if (key === Gdk.KEY_Escape) {
                hideAllWindows()
            }
        }}>
        <box
            vertical={true}
            marginTop={2}
            marginBottom={2}
            marginStart={2}
            marginEnd={2}>
            <box
                vexpand={true}/>
            <box
                cssClasses={["window"]}>
                <Gtk.ScrolledWindow
                    widthRequest={560}
                    cssClasses={["scrollWindow"]}
                    vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                    propagateNaturalHeight={true}>
                    <box
                        vertical={true}
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
                </Gtk.ScrolledWindow>
            </box>
            <box
                vexpand={true}/>
        </box>
    </window>
}