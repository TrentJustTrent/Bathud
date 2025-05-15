import {readFile} from "astal/file";
import {projectDir, selectedBar, variableConfig} from "./config";
import {execAsync} from "astal/process";
import {App} from "astal/gtk4";
import {GLib} from "astal";
import Gio from "gi://Gio?version=2.0";
import {Bar} from "./bar";
import {Theme} from "./types/derivedTypes";

export function setBarType(bar: Bar) {
    selectedBar.set(bar)
    saveBar()
}

export function setWallpaper(path: string) {
    execAsync(`bash -c '

# if the wallpaper update script exists
if [[ -f "${variableConfig.wallpaperUpdateScript.get()}" ]]; then
    # call the wallpaper script
    ${variableConfig.wallpaperUpdateScript.get()} ${path}
    
    # cache the name of the selected wallpaper
    mkdir -p ${GLib.get_home_dir()}/.cache/OkPanel/wallpaper
    echo "${path}" > ${GLib.get_home_dir()}/.cache/OkPanel/wallpaper/${variableConfig.theme.name.get()}
fi

    '`).catch((error) => {
        console.error(error)
    })
}

export function setTheme(theme: Theme, onFinished: () => void) {
    execAsync(`bash -c '

# compile the scss in /tmp
${compileThemeBashScript(theme)}

# if the set theme script exists
if [[ -f "${variableConfig.themeUpdateScript.get()}" ]]; then
    # call the external update theme 
    ${variableConfig.themeUpdateScript.get()} ${theme.name.get()}
fi

# if the update wallpaper script exists
if [[ -f "${variableConfig.wallpaperUpdateScript.get()}" ]]; then
    # if there is a cached wallpaper for this theme, then set it
    WALLPAPER_CACHE_PATH="${GLib.get_home_dir()}/.cache/OkPanel/wallpaper/${theme.name.get()}"
    # Check if the file exists and is non-empty
    if [[ -s "$WALLPAPER_CACHE_PATH" ]]; then
        # Read the wallpaper path from the file
        potentialWallpaper="$(< "$WALLPAPER_CACHE_PATH")"
        
        # Check if that file actually exists
        if [[ -f "$potentialWallpaper" ]]; then
          WALLPAPER="$potentialWallpaper"
        else
          # Fallback: pick the first .jpg or .png in the wallpaper dir
          WALLPAPER="$(
            ls -1 "${variableConfig.wallpaperDir.get()}"/*.jpg "${variableConfig.wallpaperDir.get()}"/*.png 2>/dev/null | head -n1
          )"
        fi
    else
    # If there is no cached wallpaper path, do the same fallback
    WALLPAPER="$(
      ls -1 "${variableConfig.wallpaperDir.get()}"/*.jpg "${variableConfig.wallpaperDir.get()}"/*.png 2>/dev/null | head -n1
    )"
    fi
    
    ${variableConfig.wallpaperUpdateScript.get()} $WALLPAPER
fi

    '`).catch((error) => {
        console.error(error)
    }).finally(() => {
        App.apply_css("/tmp/OkPanel/style.css")
        onFinished()
    })
}

/**
 * Sets the theme for ags.  Does not call user's external scripts
 */
export function setThemeBasic(theme: Theme) {
    execAsync(`bash -c '
# compile the scss in /tmp
${compileThemeBashScript(theme)}
    '`).catch((error) => {
        console.error(error)
    }).finally(() => {
        App.apply_css("/tmp/OkPanel/style.css")
    })
}

export function restoreSavedState() {
    setThemeBasic(variableConfig.theme)
    restoreBar()
}

function restoreBar() {
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

export function saveConfig(name: string) {
    const homeDir = GLib.get_home_dir()
    const dirPath = `${homeDir}/.cache/OkPanel`
    const filePath = `${dirPath}/config`

    // Ensure the directory exists
    const dir = Gio.File.new_for_path(dirPath)
    if (!dir.query_exists(null)) {
        dir.make_directory_with_parents(null)
    }

    // Write the file
    const file = Gio.File.new_for_path(filePath)
    const outputStream = file.replace(null, false, Gio.FileCreateFlags.REPLACE_DESTINATION, null)

    outputStream.write(name, null)
    outputStream.close(null)
}

function compileThemeBashScript(theme: Theme) {
    return `
SOURCE_DIR="${projectDir}/scss"
TARGET_DIR="/tmp/OkPanel/scss"

# Remove existing target if it exists
if [ -d "$TARGET_DIR" ]; then
    rm -rf "$TARGET_DIR"
fi
mkdir -p /tmp/OkPanel
cp -r "$SOURCE_DIR" "$TARGET_DIR"

cat > "$TARGET_DIR/variables.scss" <<EOF
\\$font: "${variableConfig.theme.font.get()}";
\\$bg: ${theme.colors.background.get()};
\\$fg: ${theme.colors.foreground.get()};
\\$primary: ${theme.colors.primary.get()};
\\$buttonPrimary: ${theme.colors.buttonPrimary.get()};
\\$warning: ${theme.colors.warning.get()};
\\$barBorder: ${theme.colors.barBorder.get()};
\\$windowBorder: ${theme.colors.windowBorder.get()};
\\$alertBorder: ${theme.colors.alertBorder.get()};
\\$scrimColor: ${theme.colors.scrimColor.get()};
\\$gaps: ${variableConfig.windows.gaps.get()}px;
\\$buttonBorderRadius: ${variableConfig.theme.buttonBorderRadius.get()}px;
\\$largeButtonBorderRadius: ${variableConfig.theme.largeButtonBorderRadius.get()}px;
\\$windowBorderRadius: ${variableConfig.windows.borderRadius.get()}px;
\\$windowBorderWidth: ${variableConfig.windows.borderWidth.get()}px;
EOF

sass $TARGET_DIR/main.scss /tmp/OkPanel/style.css
`
}
