import {Gtk} from "astal/gtk4"
import {execAsync} from "astal/process"
import {GLib, Variable} from "astal"
import {SystemMenuWindowName} from "../SystemMenuWindow";
import Pango from "gi://Pango?version=1.0";
import {createScaledTexture} from "../../utils/images";
import Divider from "../../common/Divider";
import {config, selectedBar, selectedTheme} from "../../../config/config";
import RevealerRow from "../../common/RevealerRow";
import {setBarType, setTheme, setWallpaper} from "../../../config/cachedStates";
import {Bar} from "../../../config/bar";
import {Theme} from "../../../config/schema/derivedTypes";
import OkButton, {OkButtonSize} from "../../common/OkButton";

const files: Variable<string[][]> = Variable([])
const numberOfColumns = 2
let buttonsEnabled = true

function updateTheme(theme: Theme) {
    if (!buttonsEnabled) {
        return
    }
    buttonsEnabled = false
    setTheme(theme, () => {
        buttonsEnabled = true
    })
}

function chunkIntoColumns<T>(arr: T[], numCols: number): T[][] {
    // Create numCols empty arrays
    const columns: T[][] = Array.from({ length: numCols }, () => []);

    // Distribute each item into the correct column
    arr.forEach((item, i) => {
        const colIndex = i % numCols;
        columns[colIndex].push(item);
    });

    return columns;
}

function updateFiles(theme: Theme) {
    if (theme.wallpaperDir === "") {
        return
    }
    execAsync(["bash", "-c", `ls ${theme.wallpaperDir}`])
        .catch((error) => {
            console.error(error)
        })
        .then((value) => {
            if (typeof value !== "string") {
                return
            }

            files.set(
                chunkIntoColumns(
                    value
                        .split("\n")
                        .filter((line) => line.includes("jpg") || line.includes("png")),
                    numberOfColumns
                )
            )
        })
}

function updateFade(
    adjustment: Gtk.Adjustment,
    leftGradient: Gtk.Box,
    rightGradient: Gtk.Box,
) {
    let leftDistance = adjustment.get_value() * 2
    if (leftDistance > 100) {
        leftDistance = 100
    }
    leftGradient.opacity = leftDistance / 100

    const maxScroll = adjustment.get_upper() - adjustment.get_page_size();
    let rightDistance = (maxScroll - adjustment.get_value()) * 2
    if (rightDistance > 100) {
        rightDistance = 100
    }
    rightGradient.opacity = rightDistance / 100
}

let scrollAnimationId: number | null = null

function animateScroll(
    adjustment: Gtk.Adjustment,
    targetValue: number,
    leftGradient: Gtk.Box,
    rightGradient: Gtk.Box,
    duration = 150
) {
    // Cancel any previous animation
    if (scrollAnimationId !== null) {
        GLib.source_remove(scrollAnimationId);
        scrollAnimationId = null;
    }

    const start = adjustment.get_value();
    const delta = targetValue - start;
    const startTime = GLib.get_monotonic_time();

    scrollAnimationId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000 / 60, () => {
        const now = GLib.get_monotonic_time();
        const elapsed = (now - startTime) / 1000; // microseconds → milliseconds

        const progress = Math.min(elapsed / duration, 1);
        const eased = progress * (2 - progress); // easeOutQuad

        adjustment.set_value(start + delta * eased);

        updateFade(adjustment, leftGradient, rightGradient);

        if (progress < 1) {
            return GLib.SOURCE_CONTINUE;
        } else {
            scrollAnimationId = null;
            return GLib.SOURCE_REMOVE;
        }
    });
}

function enableNightLight() {
    execAsync(`hyprctl hyprsunset temperature ${config.nightLightTemperature}`)
        .catch((error) => {
            console.error(error)
        })
}

function disableNightLight() {
    execAsync("hyprctl hyprsunset identity")
        .catch((error) => {
            console.error(error)
        })
}

function BarButton(
    {
        barType,
        icon,
    }: {
        barType: Bar,
        icon: string,
    }
) {
    return <OkButton
        size={OkButtonSize.XL}
        selected={selectedBar((bar) => bar === barType)}
        label={icon}
        onClicked={() => {
            setBarType(barType)
        }}/>
}

function BarPositionOptions() {
    return <box
        vertical={false}
        halign={Gtk.Align.CENTER}
        spacing={12}>
        <BarButton barType={Bar.LEFT} icon={"󱂪"}/>
        <BarButton barType={Bar.TOP} icon={"󱔓"}/>
        <BarButton barType={Bar.RIGHT} icon={"󱂫"}/>
        <BarButton barType={Bar.BOTTOM} icon={"󱂩"}/>
    </box>
}

function ThemeButton(
    {
        theme
    }:
    {
        theme: Theme,
    }
) {
    return <OkButton
        size={OkButtonSize.XL}
        label={theme.icon}
        offset={theme.pixelOffset}
        selected={selectedTheme((t) => t === theme)}
        onClicked={() => {
            updateTheme(theme)
        }}/>
}

function ThemeOptions() {
    let leftGradient: Gtk.Box
    let rightGradient: Gtk.Box
    const scrolledWindow = new Gtk.ScrolledWindow({
        hexpand: true,
        cssClasses: ["visibleScrollWindow"],
        hscrollbar_policy: Gtk.PolicyType.AUTOMATIC,
        vscrollbar_policy: Gtk.PolicyType.NEVER,
        heightRequest: 50,
        child: <box
            marginStart={22}
            marginEnd={22}
            vertical={false}
            spacing={10}>
            {config.themes.map((theme) => {
                return <ThemeButton theme={theme}/>
            })}
        </box>
    })

    const scrollController = Gtk.EventControllerScroll.new(Gtk.EventControllerScrollFlags.BOTH_AXES)

    // Intercept vertical scrolling and translate to horizontal
    scrollController.connect('scroll', (controller, dx, dy) => {
        if (dy !== 0) {
            const hadj = scrolledWindow.get_hadjustment()
            const maxScroll = hadj.get_upper() - hadj.get_page_size();
            if (dy === 1 || dy === -1) {
                const newValue = hadj.get_value() + dy * 30;
                animateScroll(
                    hadj,
                    Math.max(0, Math.min(newValue, maxScroll)),
                    leftGradient,
                    rightGradient,
                );
            } else {
                const newValue = hadj.get_value() + dy * 5;
                hadj.set_value(newValue);
                updateFade(hadj, leftGradient, rightGradient);
            }
            return true
        }
        if (dx !== 0) {
            const hadj = scrolledWindow.get_hadjustment()
            const maxScroll = hadj.get_upper() - hadj.get_page_size();
            if (dx === 1 || dx === -1) {
                const newValue = hadj.get_value() + dx * 30;
                animateScroll(
                    hadj,
                    Math.max(0, Math.min(newValue, maxScroll)),
                    leftGradient,
                    rightGradient,
                );
            } else {
                const newValue = hadj.get_value() + dx * 5;
                hadj.set_value(newValue);
                updateFade(hadj, leftGradient, rightGradient);
            }
            return true

        }
        return false
    })

    scrolledWindow.add_controller(scrollController);

    return <box
        hexpand={true}
        vertical={false}>
        <overlay>
            <box
                canTarget={false}
                canFocus={false}
                opacity={0}
                type={"overlay clip"}
                widthRequest={50}
                halign={Gtk.Align.START}
                hexpand={false}
                cssClasses={["fadeLeft"]}
                setup={(self) => {
                    leftGradient = self
                }}/>
            <box
                canTarget={false}
                canFocus={false}
                type={"overlay clip"}
                widthRequest={50}
                halign={Gtk.Align.END}
                hexpand={false}
                cssClasses={["fadeRight"]}
                setup={(self) => {
                    rightGradient = self
                }}/>
            {scrolledWindow}

        </overlay>
    </box>
}

function WallpaperColumn(
    {
        column
    }: {
        column: number,
    }
) {
    return <box
        hexpand={true}
        vertical={true}>
        {files((filesList) => {
            if (filesList.length === 0) {
                return <box/>
            }
            return filesList[column].map((file) => {
                const path = `${selectedTheme.get()?.wallpaperDir}/${file}`
                // 140x70 is a magic number that scales well and doesn't cause unwanted expansion of the scroll window
                const texture = createScaledTexture(140, 70, path)

                return <button
                    cssClasses={["wallpaperButton"]}
                    onClicked={() => {
                        setWallpaper(path)
                    }}>
                    <Gtk.Picture
                        heightRequest={90}
                        cssClasses={["wallpaper"]}
                        keepAspectRatio={true}
                        contentFit={Gtk.ContentFit.COVER}
                        paintable={texture}/>
                </button>
            })
        })}
    </box>
}

function NightLight() {
    return <box
        marginStart={20}
        marginEnd={20}
        vertical={false}>
        <label
            halign={Gtk.Align.START}
            hexpand={true}
            label="󱩌  Night light"
            cssClasses={["labelMedium"]}/>
        <switch
            onNotifyActive={(self) => {
                if (self.active) {
                    enableNightLight()
                } else {
                    disableNightLight()
                }
            }}/>
    </box>
}

export default function () {
    selectedTheme.subscribe((theme) => {
        if (theme != null) {
            updateFiles(theme)
        }
    })
    updateFiles(selectedTheme.get())

    return <RevealerRow
        icon={selectedTheme((theme) => {
            return theme?.icon ?? ""
        })}
        iconOffset={selectedTheme((theme) => {
            return theme.pixelOffset
        })}
        windowName={SystemMenuWindowName}
        content={
            <label
                cssClasses={["labelMediumBold"]}
                halign={Gtk.Align.START}
                hexpand={true}
                ellipsize={Pango.EllipsizeMode.END}
                label="Look and Feel"/>
        }
        revealedContent={
            <box
                marginTop={10}
                vertical={true}>
                {config.themes.length > 1 && <box
                    vertical={true}>
                    <ThemeOptions/>
                    <Divider
                        marginStart={20}
                        marginEnd={20}
                        marginTop={10}
                        marginBottom={10}/>
                </box>}
                <BarPositionOptions/>
                <box marginTop={20}/>
                <NightLight/>
                <box marginTop={10}/>
                <box
                    vertical={false}>
                    {Array.from({length: numberOfColumns}).map((_, index) => {
                        return <WallpaperColumn column={index}/>
                    })}
                </box>
            </box>
        }
    />
}