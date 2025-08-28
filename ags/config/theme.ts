import {config, selectedConfig} from "./config";
import {execAsync} from "ags/process";
import {projectDir} from "../app";
import {BarWidget} from "./schema/definitions/barWidgets";
import GLib from "gi://GLib?version=2.0";
import App from "ags/gtk4/app"

export function setTheme(onFinished: () => void) {
    execAsync(`bash -c '

# compile the scss in /tmp
${compileThemeBashScript()}

# if the set config script exists
if [[ -f "${config.configUpdateScript}" ]]; then
    # call the external update theme/config
    ${config.configUpdateScript} ${config.theme.name} ${selectedConfig.get()?.fileName}
fi

# if the update wallpaper script exists
if [[ -f "${config.wallpaperUpdateScript}" ]]; then
    # if there is a cached wallpaper for this theme, then set it
    WALLPAPER_CACHE_PATH="${GLib.get_home_dir()}/.cache/OkPanel/wallpaper/${selectedConfig.get()?.fileName}"
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
            ls -1 "${config.wallpaperDir}"/*.jpg "${config.wallpaperDir}"/*.png 2>/dev/null | head -n1
          )"
        fi
    else
    # If there is no cached wallpaper path, do the same fallback
    WALLPAPER="$(
      ls -1 "${config.wallpaperDir}"/*.jpg "${config.wallpaperDir}"/*.png 2>/dev/null | head -n1
    )"
    fi
    
    ${config.wallpaperUpdateScript} $WALLPAPER
fi

    '`).catch((error) => {
        console.error(error)
    }).finally(() => {
        App.apply_css("/tmp/OkPanel/style.css")
        console.log(`Theme applied: ${config.theme.name}`)
        onFinished()
    })
}

/**
 * Sets the theme for ags.  Does not call user's external scripts
 */
export function setThemeBasic() {
    execAsync(`bash -c '
# compile the scss in /tmp
${compileThemeBashScript()}
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

function compileThemeBashScript() {
    const widgets = Object.values(BarWidget);

    const widgetLines = widgets.map(widget => {
        const pascal = toPascalCase(widget);
        return [
            `\\$bar${pascal}Foreground: ${config.barWidgets[widget].foreground};`,
            `\\$bar${pascal}Background: ${config.barWidgets[widget].background};`,
            `\\$bar${pascal}BorderRadius: ${config.barWidgets[widget].borderRadius}px;`,
            `\\$bar${pascal}BorderWidth: ${config.barWidgets[widget].borderWidth}px;`,
            `\\$bar${pascal}BorderColor: ${config.barWidgets[widget].borderColor};`,
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
\\$font: "${config.theme.font}";
\\$systemMenuClockDayFont: "${config.systemMenu.clock.dayFont}";

\\$gaps: ${config.theme.windows.gaps}px;
\\$buttonBorderRadius: ${config.theme.buttonBorderRadius}px;
\\$windowBorderRadius: ${config.theme.windows.borderRadius}px;
\\$windowBorderWidth: ${config.theme.windows.borderWidth}px;
\\$largeButtonBorderRadius: ${config.theme.largeButtonBorderRadius}px;

\\$bg: ${config.theme.colors.background};
\\$fg: ${config.theme.colors.foreground};
\\$primary: ${config.theme.colors.primary};
\\$buttonPrimary: ${config.theme.colors.buttonPrimary};
\\$warning: ${config.theme.colors.warning};
\\$alertBorder: ${config.theme.colors.alertBorder};
\\$scrimColor: ${config.theme.colors.scrimColor};

\\$frameBackgroundColor: ${config.frame.backgroundColor};
\\$windowBorder: ${config.theme.windows.borderColor};
\\$windowBackgroundColor: ${config.theme.windows.backgroundColor};

\\$barWorkspacesInactiveForeground: ${config.barWidgets.workspaces.inactiveForeground};
\\$barNotificationHistoryIndicatorForeground: ${config.barWidgets.notificationHistory.indicatorForeground};

\\$topBarBorderRadius: ${config.topBar.borderRadius}px;
\\$topBarBorderWidth: ${config.topBar.borderWidth}px;
\\$topBarBorder: ${config.topBar.borderColor};
\\$topBarBackgroundColor: ${config.topBar.backgroundColor};

\\$bottomBarBorderRadius: ${config.bottomBar.borderRadius}px;
\\$bottomBarBorderWidth: ${config.bottomBar.borderWidth}px;
\\$bottomBarBorder: ${config.bottomBar.borderColor};
\\$bottomBarBackgroundColor: ${config.bottomBar.backgroundColor};

\\$leftBarBorderRadius: ${config.leftBar.borderRadius}px;
\\$leftBarBorderWidth: ${config.leftBar.borderWidth}px;
\\$leftBarBorder: ${config.leftBar.borderColor};
\\$leftBarBackgroundColor: ${config.leftBar.backgroundColor};

\\$rightBarBorderRadius: ${config.rightBar.borderRadius}px;
\\$rightBarBorderWidth: ${config.rightBar.borderWidth}px;
\\$rightBarBorder: ${config.rightBar.borderColor};
\\$rightBarBackgroundColor: ${config.rightBar.backgroundColor};

${widgetLines}
EOF

sass $TARGET_DIR/main.scss /tmp/OkPanel/style.css
`
}

export function setWallpaper(path: string) {
    execAsync(`bash -c '

# if the wallpaper update script exists
if [[ -f "${config.wallpaperUpdateScript}" ]]; then
    # call the wallpaper script
    ${config.wallpaperUpdateScript} ${path}
    
    # cache the name of the selected wallpaper
    mkdir -p ${GLib.get_home_dir()}/.cache/OkPanel/wallpaper
    echo "${path}" > ${GLib.get_home_dir()}/.cache/OkPanel/wallpaper/${selectedConfig.get()?.fileName}
fi

    '`).catch((error) => {
        console.error(error)
    })
}