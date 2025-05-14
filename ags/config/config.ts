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

export const availableConfigs = Variable(getAvailableConfigs())

export const selectedConfig = Variable(getConfigName())

export let config: Config = (() => {
    return loadConfig(`${homePath}/.config/OkPanel/${selectedConfig.get().name}.conf`)
})()

export const variableConfig: VariableConfig = (() => {
    return wrapConfigInVariables(CONFIG_SCHEMA, config)
})()

console.log(`selected config: ${selectedConfig.get().name}`)

function monitorAvailableConfigs() {
    monitorFile(`${homePath}/.config/OkPanel`, (file, event) => {
        const fileName = GLib.path_get_basename(file)
        if (fileName.split(".").pop() !== "conf") {
            return
        }
        const configName = fileName.slice(0, -".conf".length)
        switch (event) {
            case Gio.FileMonitorEvent.CREATED:
                console.log(`config file created: ${fileName}`)
                const newConfig = loadConfig(`${homePath}/.config/OkPanel/${configName}.conf`)
                availableConfigs.set(availableConfigs.get().concat({
                    name: configName,
                    icon: newConfig.theme.icon,
                    pixelOffset: newConfig.theme.pixelOffset
                }))
                break
            case Gio.FileMonitorEvent.DELETED:
                console.log(`config file deleted: ${fileName}`)
                availableConfigs.set(availableConfigs.get().filter((conf) => conf.name === configName))
                break
            case Gio.FileMonitorEvent.CHANGED:
                console.log(`config file changed: ${fileName}`)
                if (configName === selectedConfig.get().name) {
                    config = loadConfig(`${homePath}/.config/OkPanel/${fileName}`)
                    updateVariablesFromConfig(CONFIG_SCHEMA, variableConfig, config)
                }
                break
        }
    })
}

monitorAvailableConfigs()

function getAvailableConfigs(): ConfigFile[] {
    const files = listFilenamesInDir(`${homePath}/.config/OkPanel`)
        .filter((name) => name.includes(".conf"))
        .map((name) => name.slice(0, -".conf".length))
    const configs: ConfigFile[] = []
    files.forEach((file) => {
        const config = loadConfig(`${homePath}/.config/OkPanel/${file}.conf`)
        configs.push({
            name: file,
            icon: config.theme.icon,
            pixelOffset: config.theme.pixelOffset
        })
    })
    return configs
}

function getConfigName(): ConfigFile {
    const savedConfigString = readFile(`${GLib.get_home_dir()}/.cache/OkPanel/config`).trim()
    const savedConfig = availableConfigs.get().find((config) => config.name === savedConfigString)
    if (savedConfig !== undefined) {
        return savedConfig
    }
    saveConfig(availableConfigs.get()[0].name)
    return availableConfigs.get()[0]
}

export function setNewConfig(configFile: ConfigFile, onFinished: () => void) {
    config = loadConfig(`${homePath}/.config/OkPanel/${configFile.name}.conf`)
    updateVariablesFromConfig(CONFIG_SCHEMA, variableConfig, config)
    saveConfig(configFile.name)
    selectedConfig.set(configFile)
    setTheme(variableConfig.theme, onFinished)
}

export const selectedBar = Variable(Bar.LEFT)

export let projectDir = ""
export let homeDir = ""

export function setProjectDir(dir: string) {
    projectDir = dir
}

export function setHomeDir(dir: string) {
    homeDir = dir
}