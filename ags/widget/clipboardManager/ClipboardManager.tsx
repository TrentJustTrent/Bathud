import {variableConfig} from "../../config/config";
import ScrimScrollWindow from "../common/ScrimScrollWindow";
import {Bar, selectedBar} from "../../config/bar";
import {execAsync} from "ags/process";
import {Gtk} from "ags/gtk4";
import App from "ags/gtk4/app"
import {hideAllWindows} from "../utils/windows";
import Divider from "../common/Divider";
import {BarWidget} from "../../config/schema/definitions/barWidgets";
import OkButton, {OkButtonHorizontalPadding} from "../common/OkButton";
import AsyncClipboardPicture from "./AsyncClipboardPicture";
import AsyncClipboardLabel from "./AsyncClipboardLabel";

import {projectDir} from "../../app";
import {createBinding, createComputed, createState, For, With} from "ags";

export const ClipboardManagerWindowName = "clipboardManagerWindow"
let cliphistStarted = false

type Entry = {
    number: number;
    value: string;
};

const [clipboardEntries, clipboardEntriesSetting] = createState<Entry[]>([])

function getImageType(entry: Entry): string | null {
    const pattern = /^\[\[ binary data (\d+(?:\.\d+)?) ([A-Za-z]+) ([a-z0-9]+) (\d+)x(\d+) \]\]$/;

    const match = entry.value.match(pattern);

    if (match) {
        return match[3].toLowerCase()
    } else {
        return null
    }
}

// starts cliphist.  Defaults are from the ~/.config/cliphist/config file which is
// created by the okpanel run command.
export function startCliphist() {
    if (cliphistStarted) {
        return
    }
    cliphistStarted = true
    console.log("Starting cliphist...")

    // text
    execAsync(`${projectDir}/shellScripts/cliphistStore.sh`)
        .catch((error) => {
            console.error(error)
        })

    // images
    execAsync(["bash", "-c", `wl-paste --type image --watch cliphist store`])
        .catch((error) => {
            console.error(error)
        })
}

export function updateClipboardEntries() {
    execAsync(["bash", "-c", `cliphist list`])
        .catch((error) => {
            console.error(error)
        }).then((value) => {
            if (typeof value !== "string") {
                return
            }

            if (value.trim() === "") {
                clipboardEntriesSetting([])
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

            clipboardEntriesSetting(entries)
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

export function ClipboardManagerContent() {
    return <box
        orientation={Gtk.Orientation.VERTICAL}>
        <With value={clipboardEntries}>
            {(entries) => {
                return <box
                    orientation={Gtk.Orientation.VERTICAL}>
                    {entries.length === 0 &&
                        <label
                            hexpand={true}
                            halign={Gtk.Align.CENTER}
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
                </box>
            }}
        </With>
        <For each={clipboardEntries}>
            {(entry) => {
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
                    orientation={Gtk.Orientation.VERTICAL}>
                    <box
                        orientation={Gtk.Orientation.HORIZONTAL}>
                        {content}
                        <box
                            orientation={Gtk.Orientation.HORIZONTAL}
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
                    {clipboardEntries.get()[clipboardEntries.get().length - 1] !== entry && <Divider marginBottom={10}/>}
                </box>
            }}
        </For>
    </box>
}

export default function () {
    updateClipboardEntries()

    return <box
        cssClasses={["clipboardBox"]}
        orientation={Gtk.Orientation.VERTICAL}>
        <label
            marginBottom={16}
            cssClasses={["labelMedium"]}
            label="Clipboard History"/>
        <ClipboardManagerContent/>
    </box>
}