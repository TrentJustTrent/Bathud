import {Theme} from "./types/derivedTypes";
import {variableConfig} from "./config";
import {execAsync} from "astal/process";
import {GLib} from "astal";
import {App} from "astal/gtk4";

import {projectDir} from "../app";
import {BarWidget} from "./schema/definitions/barWidgets";

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

function toPascalCase(input: string): string {
    return input
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
}

function compileThemeBashScript(theme: Theme) {
    const widgets = Object.values(BarWidget);

    const widgetLines = widgets.map(widget => {
        const pascal = toPascalCase(widget);
        return [
            `\\$bar${pascal}Foreground: ${variableConfig.theme.bars[widget].foreground.get()};`,
            `\\$bar${pascal}Background: ${variableConfig.theme.bars[widget].background.get()};`,
            `\\$bar${pascal}BorderRadius: ${variableConfig.theme.bars[widget].borderRadius.get()}px;`,
            `\\$bar${pascal}BorderWidth: ${variableConfig.theme.bars[widget].borderWidth.get()}px;`,
            `\\$bar${pascal}BorderColor: ${variableConfig.theme.bars[widget].borderColor.get()};`,
        ].join("\n");
    }).join("\n");

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
\\$gaps: ${variableConfig.theme.windows.gaps.get()}px;
\\$barBorderRadius: ${variableConfig.theme.bars.borderRadius.get()}px;
\\$barBorderWidth: ${variableConfig.theme.bars.borderWidth.get()}px;
\\$buttonBorderRadius: ${variableConfig.theme.buttonBorderRadius.get()}px;
\\$windowBorderRadius: ${variableConfig.theme.windows.borderRadius.get()}px;
\\$windowBorderWidth: ${variableConfig.theme.windows.borderWidth.get()}px;
\\$largeButtonBorderRadius: ${variableConfig.theme.largeButtonBorderRadius.get()}px;

\\$bg: ${theme.colors.background.get()};
\\$fg: ${theme.colors.foreground.get()};
\\$primary: ${theme.colors.primary.get()};
\\$buttonPrimary: ${theme.colors.buttonPrimary.get()};
\\$warning: ${theme.colors.warning.get()};
\\$alertBorder: ${theme.colors.alertBorder.get()};
\\$scrimColor: ${theme.colors.scrimColor.get()};

\\$barBorder: ${theme.bars.borderColor.get()};
\\$barBackgroundColor: ${variableConfig.theme.bars.backgroundColor.get()};
\\$windowBorder: ${theme.windows.borderColor.get()};
\\$windowBackgroundColor: ${theme.windows.backgroundColor.get()};

${widgetLines}
EOF

sass $TARGET_DIR/main.scss /tmp/OkPanel/style.css
`
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