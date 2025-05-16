import {readFile} from "astal/file";
import {GLib, Variable} from "astal";
import {execAsync} from "astal/process";

export enum Bar {
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
    BOTTOM = "bottom",
}

export const selectedBar = Variable(Bar.LEFT)

export function setBarType(bar: Bar) {
    selectedBar.set(bar)
    saveBar()
}

export function restoreBar() {
    const details = readFile(`${GLib.get_home_dir()}/.cache/OkPanel/savedBar`).trim()

    if (details.trim() === "") {
        return
    }
    switch (details) {
        case Bar.LEFT:
            selectedBar.set(Bar.LEFT)
            break;
        case Bar.TOP:
            selectedBar.set(Bar.TOP)
            break;
        case Bar.RIGHT:
            selectedBar.set(Bar.RIGHT)
            break;
        case Bar.BOTTOM:
            selectedBar.set(Bar.BOTTOM)
            break;
    }
}

function saveBar() {
    execAsync(`bash -c '
mkdir -p ${GLib.get_home_dir()}/.cache/OkPanel
echo "${selectedBar.get()}" > ${GLib.get_home_dir()}/.cache/OkPanel/savedBar
    '`).catch((error) => {
        console.error(error)
    })
}