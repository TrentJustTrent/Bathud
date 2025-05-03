import {config, selectedBar} from "../../config/config";
import ScrimScrollWindow from "../common/ScrimScrollWindow";
import {BarWidget} from "../../config/configSchema";
import {Bar} from "../../config/bar";
import {bind, Variable} from "astal";
import {execAsync} from "astal/process";
import { App, Gtk } from "astal/gtk4";
import {hideAllWindows} from "../utils/windows";
import Divider from "../common/Divider";
import Pango from "gi://Pango?version=1.0";
import {insertNewlines} from "../utils/strings";

export const ClipboardManagerWindowName = "clipboardManagerWindow"

type Entry = {
    number: number;
    value: string;
};

const clipboardEntries = Variable<Entry[]>([])

function updateClipboardEntries() {
    execAsync(["bash", "-c", `CLIPHIST_PREVIEW_WIDTH=500 cliphist list`])
        .catch((error) => {
            print(error)
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
    execAsync(`cliphist decode ${entry.number}`)
        .catch((error) => {
            print(error)
        }).then((value) => {
            execAsync(`wl-copy ${value}`)
                .catch((error) => {
                    print(error)
                })
        })
}

function deleteEntry(entry: Entry) {
    execAsync(`cliphist delete-query ${entry.value}`)
        .catch((error) => {
            print(error)
        }).finally(() => {
            updateClipboardEntries()
        })
}

function wipeHistory() {
    execAsync(`cliphist wipe`)
        .catch((error) => {
            print(error)
        }).finally(() => {
        updateClipboardEntries()
    })
}

export default function () {
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
                            <button
                                marginBottom={16}
                                label="Delete all"
                                cssClasses={["primaryButton"]}
                                onClicked={() => {
                                    wipeHistory()
                                }}/>
                        }
                        {entries.map((entry) => {
                            return <box
                                vertical={true}>
                                <box
                                    vertical={false}>
                                    <label
                                        xalign={0}
                                        wrap={true}
                                        hexpand={true}
                                        label={insertNewlines(entry.value, 30)}/>
                                    <box
                                        vertical={false}
                                        vexpand={false}>
                                        <button
                                            valign={Gtk.Align.START}
                                            cssClasses={["iconButton"]}
                                            label=""
                                            onClicked={() => {
                                                copyEntry(entry)
                                                hideAllWindows()
                                            }}/>
                                        <button
                                            valign={Gtk.Align.START}
                                            cssClasses={["iconButton"]}
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