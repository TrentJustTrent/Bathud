import {exec} from "astal/process";
import {Variable} from "astal";
import {loadConfig, validateAndApplyDefaults} from "./configLoader";
import {Bar} from "./bar";
import {Config, Theme, themeSchema} from "./schema/derivedTypes";

export const config: Config = (() => {
    const homePath = exec('bash -c "echo $HOME"')
    return loadConfig(`${homePath}/.config/OkPanel/okpanel.conf`)
})()

export const selectedTheme = Variable<Theme>(
    validateAndApplyDefaults<Theme>({
        name: "Bloodrust",
        icon: "",
        pixelOffset: 2,
        wallpaperDir: "",
        colors: {
            background: "#1F2932",
            foreground: "#AFB3BD",
            primary: "#7C545F",
            buttonPrimary: "#7C545F",
            warning: "#7C7C54",
            barBorder: "#7C545F",
            windowBorder: "#AFB3BD",
            alertBorder: "#7C545F",
        },
    }, themeSchema.children!)
)

export const selectedBar = Variable(Bar.LEFT)

export let projectDir = ""
export let homeDir = ""

export function setProjectDir(dir: string) {
    projectDir = dir
}

export function setHomeDir(dir: string) {
    homeDir = dir
}