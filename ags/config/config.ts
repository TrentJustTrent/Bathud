import {GLib, Variable} from "astal";
import {loadConfig} from "./parser/configLoader";
import {Bar} from "./bar";
import {Config, VariableConfig} from "./types/derivedTypes";
import {updateVariablesFromConfig, wrapConfigInVariables} from "./parser/variableWrapper";
import {CONFIG_SCHEMA} from "./schema/definitions/root";
import {listFilenamesInDir} from "../widget/utils/files";
import {monitorFile, readFile} from "astal/file";
import Gio from "gi://Gio?version=2.0";
import {saveConfig, setTheme} from "./cachedStates";
import {ConfigFile} from "./configFile";

const homePath = GLib.get_home_dir()

// Order matters for these variables.  No touchy
export const availableConfigs = Variable(getAvailableConfigs())
export const selectedConfig = Variable(getSelectedConfig())
export let config: Config = (() => {
    return loadConfig(`${homePath}/.config/OkPanel/${selectedConfig.get().fileName}`)
})()
export const variableConfig: VariableConfig = (() => {
    return wrapConfigInVariables(CONFIG_SCHEMA, config)
})()
export const selectedBar = Variable(Bar.LEFT)
export let projectDir = ""

console.log(`selected config: ${selectedConfig.get().fileName}`)

function monitorAvailableConfigs() {
    monitorFile(`${homePath}/.config/OkPanel`, (file, event) => {
        const fileName = GLib.path_get_basename(file)
        if (fileName.split(".").pop() !== "conf") {
            return
        }
        switch (event) {
            case Gio.FileMonitorEvent.CREATED:
                console.log(`config file created: ${fileName}`)
                const newConfig = loadConfig(`${homePath}/.config/OkPanel/${fileName}`)
                availableConfigs.set(availableConfigs.get().concat({
                    fileName: fileName,
                    icon: newConfig.icon,
                    pixelOffset: newConfig.iconOffset
                }))
                break
            case Gio.FileMonitorEvent.DELETED:
                console.log(`config file deleted: ${fileName}`)
                availableConfigs.set(availableConfigs.get().filter((conf) => conf.fileName === fileName))
                break
        }
    })
}

monitorAvailableConfigs()

let selectedMonitor: Gio.FileMonitor | null = null

function monitorSelectedConfig() {
    if (selectedMonitor !== null) {
        selectedMonitor.cancel()
    }
    selectedMonitor = monitorFile(`${homePath}/.config/OkPanel/${selectedConfig.get().fileName}`, (file, event) => {
        const fileName = GLib.path_get_basename(file)
        switch (event) {
            case Gio.FileMonitorEvent.CHANGED:
                console.log(`config file changed`)
                config = loadConfig(`${homePath}/.config/OkPanel/${fileName}`)
                updateVariablesFromConfig(CONFIG_SCHEMA, variableConfig, config)
                break
        }
    })
}

monitorSelectedConfig()

function getAvailableConfigs(): ConfigFile[] {
    const files = listFilenamesInDir(`${homePath}/.config/OkPanel`)
        .filter((name) => name.includes(".conf"))
    const configs: ConfigFile[] = []
    files.forEach((file) => {
        console.log(`Found config: ${file}`)
        const config = loadConfig(`${homePath}/.config/OkPanel/${file}`)
        configs.push({
            fileName: file,
            icon: config.icon,
            pixelOffset: config.iconOffset
        })
    })
    return configs
}

function getSelectedConfig(): ConfigFile {
    const savedConfigString = readFile(`${GLib.get_home_dir()}/.cache/OkPanel/config`).trim()
    const savedConfig = availableConfigs.get().find((config) => config.fileName === savedConfigString)
    if (savedConfig !== undefined) {
        return savedConfig
    }
    //TODO if there are no available configs, use default values?
    saveConfig(availableConfigs.get()[0].fileName)
    return availableConfigs.get()[0]
}

export function setNewConfig(configFile: ConfigFile, onFinished: () => void) {
    config = loadConfig(`${homePath}/.config/OkPanel/${configFile.fileName}`)
    updateVariablesFromConfig(CONFIG_SCHEMA, variableConfig, config)
    saveConfig(configFile.fileName)
    selectedConfig.set(configFile)
    monitorSelectedConfig()
    setTheme(variableConfig.theme, onFinished)
}

export function setProjectDir(dir: string) {
    projectDir = dir
}
