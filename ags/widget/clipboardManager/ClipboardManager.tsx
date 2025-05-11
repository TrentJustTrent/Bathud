import {config, projectDir, selectedBar} from "../../config/config";
import ScrimScrollWindow from "../common/ScrimScrollWindow";
import {Bar} from "../../config/bar";
import {bind, Variable} from "astal";
import {execAsync} from "astal/process";
import {App, Gtk} from "astal/gtk4";
import {hideAllWindows} from "../utils/windows";
import Divider from "../common/Divider";
import {insertNewlines} from "../utils/strings";
import {BarWidget} from "../../config/schema/definitions/barWidgets";
import OkButton, {OkButtonHorizontalPadding} from "../common/OkButton";
import AsyncClipboardPicture from "./AsyncClipboardPicture";
import AsyncClipboardLabel from "./AsyncClipboardLabel";

export const ClipboardManagerWindowName = "clipboardManagerWindow"

type Entry = {
    number: number;
    value: string;
};

const clipboardEntries = Variable<Entry[]>([])

function getImageType(entry: Entry): string | null {
    const pattern = /^\[\[ binary data (\d+(?:\.\d+)?) ([A-Za-z]+) ([a-z0-9]+) (\d+)x(\d+) \]\]$/;

    const match = entry.value.match(pattern);

    if (match) {
        return match[3].toLowerCase()
    } else {
        return null
    }
}

function startCliphist() {
    // If the widget isn't on the bar, don't start cliphist
    if (
        !config.horizontalBar.leftWidgets.includes(BarWidget.CLIPBOARD_MANAGER) &&
        !config.horizontalBar.centerWidgets.includes(BarWidget.CLIPBOARD_MANAGER) &&
        !config.horizontalBar.rightWidgets.includes(BarWidget.CLIPBOARD_MANAGER) &&
        !config.verticalBar.topWidgets.includes(BarWidget.CLIPBOARD_MANAGER) &&
        !config.verticalBar.centerWidgets.includes(BarWidget.CLIPBOARD_MANAGER) &&
        !config.verticalBar.bottomWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
    ) {
        return
    }

    console.log("Starting cliphist...")

    execAsync(`${projectDir}/shellScripts/cliphistStore.sh`)
        .catch((error) => {
            console.error(error)
        })

    execAsync(["bash", "-c", `wl-paste --type image --watch cliphist store`])
        .catch((error) => {
            console.error(error)
        })
}

function updateClipboardEntries() {
    execAsync(["bash", "-c", `CLIPHIST_PREVIEW_WIDTH=500 cliphist list`])
        .catch((error) => {
            console.error(error)
        }).then((value) => {
            if (typeof value !== "string") {
                return
            }

            if (value.trim() === "") {
                clipboardEntries.set([])
                return
            }

            const entries: Entry[] = value
                .split("\n")
                .map(line => {
                    const [numStr, ...textParts] = line.split("\t");
                    return {
                        number: parseInt(numStr, 10),
                        value: textParts.join("\t").trim()
                    };
                });

            clipboardEntries.set(entries)
    })
}

function copyEntry(entry: Entry) {
    const imageType = getImageType(entry)
    if (imageType !== null) {
        execAsync(["bash", "-c", `cliphist decode ${entry.number} | wl-copy --type image/${imageType}`])
            .catch((error) => {
                console.error(error)
            })
    } else {
        execAsync(["bash", "-c", `cliphist decode ${entry.number} | wl-copy`])
            .catch((error) => {
                console.error(error)
            })
    }
}

function deleteEntry(entry: Entry) {
    execAsync(`cliphist delete-query ${entry.value}`)
        .catch((error) => {
            console.error(error)
        }).finally(() => {
            updateClipboardEntries()
        })
}

function wipeHistory() {
    execAsync(`cliphist wipe`)
        .catch((error) => {
            console.error(error)
        }).finally(() => {
        updateClipboardEntries()
    })
}

export default function () {
    startCliphist()
    updateClipboardEntries()

    setTimeout(() => {
        bind(App.get_window(ClipboardManagerWindowName)!, "visible").subscribe((visible) => {
            if (visible) {
                updateClipboardEntries()
            }
        })
    }, 1_000)

    return <ScrimScrollWindow
        monitor={config.mainMonitor}
        windowName={ClipboardManagerWindowName}
        topExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.BOTTOM:
                    return true
                case Bar.LEFT:
                case Bar.RIGHT:
                    return config.verticalBar.centerWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
                        || config.verticalBar.bottomWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
                default: return false
            }
        })}
        bottomExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.TOP:
                    return true
                case Bar.LEFT:
                case Bar.RIGHT:
                    return config.verticalBar.centerWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
                        || config.verticalBar.topWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
                default: return false
            }
        })}
        leftExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.RIGHT:
                    return true
                case Bar.TOP:
                case Bar.BOTTOM:
                    return config.horizontalBar.centerWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
                        || config.horizontalBar.rightWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
                default: return false
            }
        })}
        rightExpand={selectedBar((bar) => {
            switch (bar) {
                case Bar.LEFT:
                    return true
                case Bar.TOP:
                case Bar.BOTTOM:
                    return config.horizontalBar.centerWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
                        || config.horizontalBar.leftWidgets.includes(BarWidget.CLIPBOARD_MANAGER)
                default: return false
            }
        })}
        contentWidth={400}
        width={config.horizontalBar.minimumWidth}
        height={config.verticalBar.minimumHeight}
        content={
            <box
                cssClasses={["clipboardBox"]}
                vertical={true}>
                <label
                    marginBottom={16}
                    cssClasses={["labelMedium"]}
                    label="Clipboard History"/>
                {clipboardEntries((entries) => {
                    return <box
                        vertical={true}>
                        {entries.length === 0 &&
                            <label
                                label="Empty"
                                cssClasses={["labelMedium"]}/>
                        }
                        {entries.length > 0 &&
                            <box
                                marginBottom={16}>
                                <OkButton
                                    hexpand={true}
                                    label="Delete all"
                                    primary={true}
                                    onClicked={() => {
                                        wipeHistory()
                                    }}/>
                            </box>
                        }
                        {entries.map((entry) => {
                            const imageType = getImageType(entry)
                            const isImage = imageType !== null

                            let content

                            if (isImage) {
                                content = <AsyncClipboardPicture
                                    cliphistId={entry.number}/>
                            } else {
                                content = <AsyncClipboardLabel
                                    cliphistId={entry.number}/>
                            }

                            return <box
                                vertical={true}>
                                <box
                                    vertical={false}>
                                    {content}
                                    <box
                                        vertical={false}
                                        vexpand={false}>
                                        <OkButton
                                            hpadding={OkButtonHorizontalPadding.THIN}
                                            valign={Gtk.Align.START}
                                            label=""
                                            onClicked={() => {
                                                copyEntry(entry)
                                                hideAllWindows()
                                            }}/>
                                        <OkButton
                                            hpadding={OkButtonHorizontalPadding.THIN}
                                            valign={Gtk.Align.START}
                                            label=""
                                            onClicked={() => {
                                                deleteEntry(entry)
                                            }}/>
                                    </box>
                                </box>
                                <box marginTop={10}/>
                                {entries[entries.length - 1] !== entry && <Divider marginBottom={10}/>}
                            </box>
                        })}
                    </box>
                })}
            </box>
        }/>
}