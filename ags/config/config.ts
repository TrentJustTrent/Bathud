import {GLib, Variable} from "astal";
import {loadConfig, validateAndApplyDefaults} from "./parser/configLoader";
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
let defaultConfigValues: Config | undefined = ((): Config | undefined => {
    if (GLib.file_test(`${homePath}/.config/OkPanel/okpanel.conf`, GLib.FileTest.EXISTS)) {
        return loadConfig(`${homePath}/.config/OkPanel/okpanel.conf`)
    } else {
        return undefined
    }
})()
export let config: Config = ((): Config => {
    if (selectedConfig.get() === undefined) {
        return validateAndApplyDefaults({}, CONFIG_SCHEMA)
    }
    return loadConfig(`${homePath}/.config/OkPanel/${selectedConfig.get()?.fileName}`, defaultConfigValues)
})()
export const variableConfig: VariableConfig = ((): VariableConfig => {
    return wrapConfigInVariables(CONFIG_SCHEMA, config)
})()
export const selectedBar = Variable(Bar.LEFT)
export let projectDir = ""

console.log(`selected config: ${selectedConfig?.get()?.fileName}`)

function monitorAvailableConfigs() {
    monitorFile(`${homePath}/.config/OkPanel`, (file, event) => {
        const fileName = GLib.path_get_basename(file)
        if (fileName.split(".").pop() !== "conf") {
            return
        }
        switch (event) {
            case Gio.FileMonitorEvent.CREATED:
                console.log(`config file created: ${fileName}`)
                if (fileName === "okpanel.conf") {
                    updateDefaultValues()
                    monitorDefaultsConfig()
                    break
                }
                const newConfig = loadConfig(`${homePath}/.config/OkPanel/${fileName}`)
                availableConfigs.set(availableConfigs.get().concat({
                    fileName: fileName,
                    icon: newConfig.icon,
                    pixelOffset: newConfig.iconOffset
                }))
                break
            case Gio.FileMonitorEvent.DELETED:
                console.log(`config file deleted: ${fileName}`)
                if (fileName === "okpanel.conf") {
                    updateDefaultValues()
                    disableDefaultsConfigMonitor()
                    break
                }
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
    if (selectedConfig === undefined) {
        return
    }
    selectedMonitor = monitorFile(`${homePath}/.config/OkPanel/${selectedConfig.get()?.fileName}`, (file, event) => {
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

let defaultsMonitor: Gio.FileMonitor | null = null

function monitorDefaultsConfig() {
    if (defaultsMonitor !== null) {
        defaultsMonitor.cancel()
    }
    if (!GLib.file_test(`${homePath}/.config/OkPanel/okpanel.conf`, GLib.FileTest.EXISTS)) {
        return
    }
    defaultsMonitor = monitorFile(`${homePath}/.config/OkPanel/okpanel.conf`, (file, event) => {
        switch (event) {
            case Gio.FileMonitorEvent.CHANGED:
                console.log(`defaults config file changed`)
                updateDefaultValues()
                break
        }
    })
}

monitorDefaultsConfig()

function disableDefaultsConfigMonitor() {
    if (defaultsMonitor !== null) {
        defaultsMonitor.cancel()
        defaultsMonitor = null
    }
}

function getAvailableConfigs(): ConfigFile[] {
    const files = listFilenamesInDir(`${homePath}/.config/OkPanel`)
        .filter((name) => name.includes(".conf"))
        .filter((name) => name !== "okpanel.conf")
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

function getSelectedConfig(): ConfigFile | undefined {
    const savedConfigString = readFile(`${GLib.get_home_dir()}/.cache/OkPanel/config`).trim()
    const savedConfig = availableConfigs.get().find((config) => config.fileName === savedConfigString)
    if (savedConfig !== undefined) {
        return savedConfig
    }
    if (availableConfigs.get().length === 0) {
        return undefined
    }
    saveConfig(availableConfigs.get()[0].fileName)
    return availableConfigs.get()[0]
}

export function setNewConfig(configFile: ConfigFile, onFinished: () => void) {
    config = loadConfig(`${homePath}/.config/OkPanel/${configFile.fileName}`, defaultConfigValues)
    updateVariablesFromConfig(CONFIG_SCHEMA, variableConfig, config)
    saveConfig(configFile.fileName)
    selectedConfig.set(configFile)
    monitorSelectedConfig()
    setTheme(variableConfig.theme, onFinished)
}

function updateDefaultValues() {
    // update default values
    if (GLib.file_test(`${homePath}/.config/OkPanel/okpanel.conf`, GLib.FileTest.EXISTS)) {
        defaultConfigValues = loadConfig(`${homePath}/.config/OkPanel/okpanel.conf`)
    } else {
        defaultConfigValues = undefined
    }
    // updated in use config
    if (selectedConfig.get() === undefined) {
        config = validateAndApplyDefaults({}, CONFIG_SCHEMA, "", defaultConfigValues)
    } else {
        config = loadConfig(`${homePath}/.config/OkPanel/${selectedConfig.get()?.fileName}`, defaultConfigValues)
    }
    updateVariablesFromConfig(CONFIG_SCHEMA, variableConfig, config)
}

export function setProjectDir(dir: string) {
    projectDir = dir
}
