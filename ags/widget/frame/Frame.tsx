import {Astal, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app";
import Cairo from 'gi://cairo';
import {hexToRgba} from "../utils/strings";
import {variableConfig} from "../../config/config";
import {createComputed, createState} from "ags";
import LeftBar from "./bars/LeftBar";
import IntegratedMenu from "../systemMenu/IntegratedMenu";
import TopBar from "./bars/TopBar";
import RightBar from "./bars/RightBar";
import BottomBar from "./bars/BottomBar";
import IntegratedCalendar from "../calendar/IntegratedCalendar";
import IntegratedClipboardManager from "../clipboardManager/IntegratedClipboardManager";
import IntegratedNotificationHistory from "../notification/IntegratedNotificationHistory";
import {appendChildren, ghostWhenTooNarrow, removeAllChildren} from "../utils/widgets";
import {Position} from "../../config/schema/definitions/frame";
import IntegratedScreenshot from "../screenshot/IntegratedScreenshot";
import IntegratedAppLauncher from "../appLauncher/IntegratedAppLauncher";
import IntegratedScreenshare from "../screenshare/IntegratedScreenshare";
import {isFraction} from "../utils/numbers";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

const hyprland = AstalHyprland.get_default()

export const frameWindowName = "frame"

export let frameWindow: Astal.Window

let leftGroup: Gtk.Box
let rightGroup: Gtk.Box
let integratedMenu: Gtk.Widget
let leftBar: Gtk.Widget
let rightBar: Gtk.Widget
let integratedCalendar: Gtk.Widget
let integratedClipboardManager: Gtk.Widget
let integratedNotificationHistory: Gtk.Widget
let integratedScreenshotTool: Gtk.Widget
let integratedAppLauncher: Gtk.Widget
let integratedScreenshare: Gtk.Widget

function roundedRect(ctx: any, x: number, y: number, w: number, h: number, r: number) {
    r = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    const pi2 = Math.PI / 2;
    ctx.newPath();
    ctx.arc(x + w - r, y + r,     r, -pi2, 0);
    ctx.arc(x + w - r, y + h - r, r, 0,    pi2);
    ctx.arc(x + r,     y + h - r, r, pi2,  Math.PI);
    ctx.arc(x + r,     y + r,     r, Math.PI, 1.5 * Math.PI);
    ctx.closePath();
}

export function OutlineOverlay() {
    const redrawAccessor = createComputed([
        variableConfig.frame.borderRadius.asAccessor(),
        variableConfig.frame.backgroundColor.asAccessor(),
        variableConfig.frame.borderColor.asAccessor(),
        variableConfig.frame.borderWidth.asAccessor(),
        variableConfig.frame.bottomThickness.asAccessor(),
        variableConfig.frame.topThickness.asAccessor(),
        variableConfig.frame.leftThickness.asAccessor(),
        variableConfig.frame.rightThickness.asAccessor(),
    ])

    const [leftScalingFixVisible, leftScalingFixVisibleSetter] = createState(false)
    const [bottomScalingFixVisible, bottomScalingFixVisibleSetter] = createState(false)

    // The overlays are a hacky fix for a fractional scaling issue with either cairo or Gtk.DrawingArea.
    // A ~2px gap is left to the right and bottom of the Gtk.DrawingArea when using cairo to draw the frame.
    // The gap is not there when using CSS.  Using an overlay when we detect fractional scaling with Hyprland
    // to hide the gap.
    return <overlay
        $={(self) => {
            self.add_overlay(
                <box
                    vexpand
                    visible={leftScalingFixVisible}
                    cssClasses={["frameScalingFix"]}
                    hexpand={false}
                    widthRequest={2}
                    halign={Gtk.Align.END}
                    /> as Gtk.Widget
            )
            self.add_overlay(
                <box
                    hexpand
                    visible={bottomScalingFixVisible}
                    cssClasses={["frameScalingFix"]}
                    vexpand={false}
                    heightRequest={2}
                    valign={Gtk.Align.END}
                /> as Gtk.Widget
            )
        }}
        canTarget={false}
        canFocus={false}
        sensitive={false}>
        <drawingarea
            hexpand
            vexpand
            canTarget={false}
            canFocus={false}
            sensitive={false}
            $={(da: Gtk.DrawingArea) => {
                da.set_draw_func((_area, ctx: any, w: number, h: number) => {
                    const innerRadius     = variableConfig.frame.borderRadius.get();
                    const [fr, fg, fb, fa]    = hexToRgba(variableConfig.frame.backgroundColor.get());
                    const [br, bg, bb, ba]  = hexToRgba(variableConfig.frame.borderColor.get());
                    const innerBorderWidth  = variableConfig.frame.borderWidth.get();

                    const leftThickness = variableConfig.frame.leftThickness.get()
                    const rightThickness = variableConfig.frame.rightThickness.get()
                    const topThickness = variableConfig.frame.topThickness.get()
                    const bottomThickness = variableConfig.frame.bottomThickness.get()

                    // Inner hole geometry
                    let x, y, iw, ih

                    x = leftThickness;
                    y = topThickness;
                    iw = Math.max(0, w - leftThickness - rightThickness);
                    ih = Math.max(0, h - topThickness - bottomThickness);

                    ctx.setAntialias(Cairo.Antialias.BEST);

                    // Only draw the frame if it should be drawn
                    if (!(leftThickness === 0
                            && rightThickness === 0
                            && topThickness === 0
                            && bottomThickness === 0
                            && innerBorderWidth === 0
                            && innerRadius === 0)
                    ) {
                        // Frame: square outer edges
                        ctx.setOperator(Cairo.Operator.OVER);
                        ctx.setSourceRGBA(fr, fg, fb, fa);
                        ctx.rectangle(0, 0, w, h);
                        ctx.fill();

                        const r  = Math.max(0, Math.min(innerRadius, Math.min(iw, ih) / 2));

                        // Cutout (transparent center)
                        ctx.setOperator(Cairo.Operator.CLEAR);
                        roundedRect(ctx, x, y, iw, ih, r);
                        ctx.fill();

                        // Interior border: draw ONLY on the inside by clipping to the hole,
                        // then stroking the same path with 2x width (clip keeps inner half).
                        if (innerBorderWidth > 0 && ba > 0) {
                            ctx.setOperator(Cairo.Operator.OVER);
                            roundedRect(ctx, x, y, iw, ih, r);
                            ctx.clip();                          // limit to the transparent hole
                            roundedRect(ctx, x, y, iw, ih, r);   // the stroke path
                            ctx.setSourceRGBA(br, bg, bb, ba);
                            ctx.setLineWidth(innerBorderWidth * 2);
                            ctx.setLineJoin(Cairo.LineJoin.ROUND);
                            ctx.setLineCap(Cairo.LineCap.ROUND);
                            ctx.stroke();
                        }
                    }

                    // After we draw the cutout, we change the input region of the frame window to include
                    // everything except the cutout region

                    // ——— Build input region in *window* coordinates ———
                    const surf = frameWindow.get_native()?.get_surface();
                    if (!surf) return;

                    // Window size (not the drawing area)
                    const winW = frameWindow.get_allocated_width();
                    const winH = frameWindow.get_allocated_height();

                    // Offset of the drawing area inside the window
                    // (TS defs are thin; cast to any for GI boxed types)
                    const bounds = da.compute_bounds(frameWindow)[1];
                    const daOffX = bounds ? bounds.get_x() : 0;
                    const daOffY = bounds ? bounds.get_y() : 0;

                    // Hole rect in *window* coords
                    const holeL = Math.max(0, Math.floor(daOffX + x));
                    const holeT = Math.max(0, Math.floor(daOffY + y));
                    const holeR = Math.min(winW, Math.ceil(daOffX + x + iw));
                    const holeB = Math.min(winH, Math.ceil(daOffY + y + ih));

                    const Region = (Cairo as any).Region;
                    const RectangleInt = (Cairo as any).RectangleInt;
                    const region = new Region();

                    const addRect = (X: number, Y: number, W: number, H: number) => {
                        if (W <= 0 || H <= 0) return;
                        region.unionRectangle(new RectangleInt({ x: X, y: Y, width: W, height: H }));
                    };

                    // Four bands around the hole (all in window coords)
                    // Top
                    addRect(0, 0, winW, holeT);
                    // Left
                    addRect(0, holeT, holeL, Math.max(0, holeB - holeT));
                    // Right
                    addRect(holeR, holeT, Math.max(0, winW - holeR), Math.max(0, holeB - holeT));
                    // Bottom
                    addRect(0, holeB, winW, Math.max(0, winH - holeB));

                    surf.set_input_region(region);

                    // Enable or disable fractional scaling fix
                    const isFractionalScaling = isFraction(hyprland.monitors[0].scale)
                    leftScalingFixVisibleSetter(
                        isFractionalScaling
                        && !(rightThickness === 0 && innerBorderWidth === 0)
                    )
                    bottomScalingFixVisibleSetter(
                        isFractionalScaling
                        && !(bottomThickness === 0 && innerBorderWidth === 0)
                    )
                });

                redrawAccessor.subscribe(() => {
                    da.queue_draw()
                })
            }}
        />
    </overlay>
}

function getLeftAndRightSides() {
    const menuPosition = variableConfig.frame.menu.position.asAccessor()
    const calendarPosition = variableConfig.frame.calendar.position.asAccessor()
    const clipboardManagerPosition = variableConfig.frame.clipboardManager.position.asAccessor()
    const notificationHistoryPosition = variableConfig.frame.notifications.position.asAccessor()
    const screenshotPositon = variableConfig.frame.screenshotTool.position.asAccessor()
    const appLauncherPosition = variableConfig.frame.appLauncher.position.asAccessor()
    const screensharePosition = variableConfig.frame.screenshare.position.asAccessor()

    const leftSide = [leftBar]
    const rightSide = [rightBar]

    if (menuPosition.get() === Position.LEFT) {
        leftSide.push(integratedMenu)
    } else {
        rightSide.push(integratedMenu)
    }

    if (calendarPosition.get() === Position.LEFT) {
        leftSide.push(integratedCalendar)
    } else {
        rightSide.push(integratedCalendar)
    }

    if (clipboardManagerPosition.get() === Position.LEFT) {
        leftSide.push(integratedClipboardManager)
    } else {
        rightSide.push(integratedClipboardManager)
    }

    if (notificationHistoryPosition.get() === Position.LEFT) {
        leftSide.push(integratedNotificationHistory)
    } else {
        rightSide.push(integratedNotificationHistory)
    }

    if (screenshotPositon.get() === Position.LEFT) {
        leftSide.push(integratedScreenshotTool)
    } else {
        rightSide.push(integratedScreenshotTool)
    }

    if (appLauncherPosition.get() === Position.LEFT) {
        leftSide.push(integratedAppLauncher)
    } else {
        rightSide.push(integratedAppLauncher)
    }

    if (screensharePosition.get() === Position.LEFT) {
        leftSide.push(integratedScreenshare)
    } else {
        rightSide.push(integratedScreenshare)
    }

    rightSide.reverse()

    return [leftSide, rightSide]
}

export default function (): Astal.Window {

    const menuPosition = variableConfig.frame.menu.position.asAccessor()
    const calendarPosition = variableConfig.frame.calendar.position.asAccessor()
    const clipboardManagerPosition = variableConfig.frame.clipboardManager.position.asAccessor()
    const notificationHistoryPosition = variableConfig.frame.notifications.position.asAccessor()
    const screenshotPositon = variableConfig.frame.screenshotTool.position.asAccessor()
    const appLauncherPosition = variableConfig.frame.appLauncher.position.asAccessor()
    const screensharePosition = variableConfig.frame.screenshare.position.asAccessor()

    createComputed([
        menuPosition,
        calendarPosition,
        clipboardManagerPosition,
        notificationHistoryPosition,
        screenshotPositon,
        appLauncherPosition,
        screensharePosition,
    ]).subscribe(() => {
        removeAllChildren(leftGroup)
        removeAllChildren(rightGroup)

        const [leftSideWidgets, rightSideWidgets] = getLeftAndRightSides()

        appendChildren(leftGroup, leftSideWidgets)
        appendChildren(rightGroup, rightSideWidgets)
    })

    integratedMenu = <IntegratedMenu/> as Gtk.Widget
    integratedCalendar = <IntegratedCalendar/> as Gtk.Widget
    integratedClipboardManager = <IntegratedClipboardManager/> as Gtk.Widget
    integratedNotificationHistory = <IntegratedNotificationHistory/> as Gtk.Widget
    integratedScreenshotTool = <IntegratedScreenshot/> as Gtk.Widget
    integratedAppLauncher = <IntegratedAppLauncher/> as Gtk.Widget
    integratedScreenshare = <IntegratedScreenshare/> as Gtk.Widget
    leftBar = <LeftBar/> as Gtk.Widget
    rightBar = <RightBar/> as Gtk.Widget

    return <window
        $={(self) => {
            frameWindow = self
        }}
        name={frameWindowName}
        cssClasses={["transparentBackground"]}
        layer={Astal.Layer.TOP}
        namespace={"okpanel-frame"}
        exclusivity={Astal.Exclusivity.IGNORE}
        anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
        visible={true}
        application={App}>
        <box
            vexpand={true}
            hexpand={true}
            orientation={Gtk.Orientation.VERTICAL}>
            <box
                $={(self) => {
                    ghostWhenTooNarrow(
                        self,
                        [
                            variableConfig.topBar.paddingBottom.asAccessor(),
                            variableConfig.topBar.paddingTop.asAccessor(),
                            variableConfig.topBar.marginBottom.asAccessor(),
                            variableConfig.topBar.marginTop.asAccessor(),
                            variableConfig.topBar.borderWidth.asAccessor(),
                        ]
                    )
                }}
                orientation={Gtk.Orientation.HORIZONTAL}>
                <box hexpand={variableConfig.topBar.expanded.asAccessor().as((e) => !e)}/>
                <TopBar/>
                <box hexpand={variableConfig.topBar.expanded.asAccessor().as((e) => !e)}/>
            </box>
            <box
                vexpand={true}
                hexpand={true}
                orientation={Gtk.Orientation.HORIZONTAL}>
                <box
                    $={(self) => {
                        ghostWhenTooNarrow(
                            self,
                            [
                                variableConfig.leftBar.paddingStart.asAccessor(),
                                variableConfig.leftBar.paddingEnd.asAccessor(),
                                variableConfig.leftBar.marginStart.asAccessor(),
                                variableConfig.leftBar.marginEnd.asAccessor(),
                                variableConfig.leftBar.borderWidth.asAccessor(),
                            ]
                        )
                    }}
                    orientation={Gtk.Orientation.VERTICAL}>
                    <box vexpand={variableConfig.leftBar.expanded.asAccessor().as((e) => !e)}/>
                    <box
                        vexpand={true}
                        heightRequest={variableConfig.leftBar.minimumHeight.asAccessor()}
                        marginStart={variableConfig.leftBar.marginStart.asAccessor()}
                        marginEnd={variableConfig.leftBar.marginEnd.asAccessor()}
                        marginTop={variableConfig.leftBar.marginTop.asAccessor()}
                        marginBottom={variableConfig.leftBar.marginBottom.asAccessor()}
                        cssClasses={["frameLeftGroup"]}>
                        <box
                            marginStart={variableConfig.leftBar.paddingStart.asAccessor()}
                            marginEnd={variableConfig.leftBar.paddingEnd.asAccessor()}
                            marginTop={variableConfig.leftBar.paddingTop.asAccessor()}
                            marginBottom={variableConfig.leftBar.paddingBottom.asAccessor()}
                            orientation={Gtk.Orientation.HORIZONTAL}
                            $={(self) => {
                                leftGroup = self

                                const [leftSideWidgets, _] = getLeftAndRightSides()

                                appendChildren(leftGroup, leftSideWidgets)
                            }}/>
                    </box>
                    <box vexpand={variableConfig.leftBar.expanded.asAccessor().as((e) => !e)}/>
                </box>
                <OutlineOverlay/>
                <box
                    $={(self) => {
                        ghostWhenTooNarrow(
                            self,
                            [
                                variableConfig.rightBar.paddingStart.asAccessor(),
                                variableConfig.rightBar.paddingEnd.asAccessor(),
                                variableConfig.rightBar.marginStart.asAccessor(),
                                variableConfig.rightBar.marginEnd.asAccessor(),
                                variableConfig.rightBar.borderWidth.asAccessor(),
                            ]
                        )
                    }}
                    orientation={Gtk.Orientation.VERTICAL}>
                    <box vexpand={variableConfig.rightBar.expanded.asAccessor().as((e) => !e)}/>
                    <box
                        vexpand={true}
                        heightRequest={variableConfig.rightBar.minimumHeight.asAccessor()}
                        marginStart={variableConfig.rightBar.marginStart.asAccessor()}
                        marginEnd={variableConfig.rightBar.marginEnd.asAccessor()}
                        marginTop={variableConfig.rightBar.marginTop.asAccessor()}
                        marginBottom={variableConfig.rightBar.marginBottom.asAccessor()}
                        cssClasses={["frameRightGroup"]}>
                        <box
                            marginStart={variableConfig.rightBar.paddingStart.asAccessor()}
                            marginEnd={variableConfig.rightBar.paddingEnd.asAccessor()}
                            marginTop={variableConfig.rightBar.paddingTop.asAccessor()}
                            marginBottom={variableConfig.rightBar.paddingBottom.asAccessor()}
                            orientation={Gtk.Orientation.HORIZONTAL}
                            $={(self) => {
                                rightGroup = self

                                const [_, rightSideWidgets] = getLeftAndRightSides()

                                appendChildren(rightGroup, rightSideWidgets)
                            }}/>
                    </box>
                    <box vexpand={variableConfig.rightBar.expanded.asAccessor().as((e) => !e)}/>
                </box>
            </box>
            <box
                $={(self) => {
                    ghostWhenTooNarrow(
                        self,
                        [
                            variableConfig.bottomBar.paddingBottom.asAccessor(),
                            variableConfig.bottomBar.paddingTop.asAccessor(),
                            variableConfig.bottomBar.marginBottom.asAccessor(),
                            variableConfig.bottomBar.marginTop.asAccessor(),
                            variableConfig.bottomBar.borderWidth.asAccessor(),
                        ]
                    )
                }}
                orientation={Gtk.Orientation.HORIZONTAL}>
                <box hexpand={variableConfig.bottomBar.expanded.asAccessor().as((e) => !e)}/>
                <BottomBar/>
                <box hexpand={variableConfig.bottomBar.expanded.asAccessor().as((e) => !e)}/>
            </box>
        </box>
    </window> as Astal.Window
}