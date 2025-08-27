import {Astal, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app";
import Cairo from 'gi://cairo';
import {hexToRgba} from "../utils/strings";
import {variableConfig} from "../../config/config";
import {createComputed} from "ags";
import LeftBar from "./bars/LeftBar";
import IntegratedMenu from "../systemMenu/IntegratedMenu";
import TopBar from "./bars/TopBar";
import RightBar from "./bars/RightBar";
import BottomBar from "./bars/BottomBar";
import IntegratedCalendar from "../calendar/IntegratedCalendar";
import IntegratedClipboardManager from "../clipboardManager/IntegratedClipboardManager";
import IntegratedNotificationHistory from "../notification/IntegratedNotificationHistory";
import {appendChildren, orderChildrenLTR} from "../utils/widgets";
import {Position} from "../../config/schema/definitions/frame";

export const frameWindowName = "frame"

let frameWindow: Gtk.Window

let frame: Gtk.Widget
let frameBox: Gtk.Box
let integratedMenu: Gtk.Widget
let leftBar: Gtk.Widget
let rightBar: Gtk.Widget
let integratedCalendar: Gtk.Widget
let integratedClipboardManager: Gtk.Widget
let integratedNotificationHistory: Gtk.Widget

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

    return <drawingarea
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

                ctx.save();
                ctx.setAntialias(Cairo.Antialias.BEST);

                // Frame: square outer edges
                ctx.setOperator(Cairo.Operator.OVER);
                ctx.setSourceRGBA(fr, fg, fb, fa);
                ctx.rectangle(0, 0, w, h);
                ctx.fill();

                // Inner hole geometry
                let x, y, iw, ih

                x = leftThickness;
                y = topThickness;
                iw = Math.max(0, w - leftThickness - rightThickness);
                ih = Math.max(0, h - topThickness - bottomThickness);

                const r  = Math.max(0, Math.min(innerRadius, Math.min(iw, ih) / 2));

                // Cutout (transparent center)
                ctx.setOperator(Cairo.Operator.CLEAR);
                roundedRect(ctx, x, y, iw, ih, r);
                ctx.fill();

                // Interior border: draw ONLY on the inside by clipping to the hole,
                // then stroking the same path with 2x width (clip keeps inner half).
                if (innerBorderWidth > 0 && ba > 0) {
                    ctx.setOperator(Cairo.Operator.OVER);
                    ctx.save();
                    roundedRect(ctx, x, y, iw, ih, r);
                    ctx.clip();                          // limit to the transparent hole
                    roundedRect(ctx, x, y, iw, ih, r);   // the stroke path
                    ctx.setSourceRGBA(br, bg, bb, ba);
                    ctx.setLineWidth(innerBorderWidth * 2);
                    ctx.setLineJoin(Cairo.LineJoin.ROUND);
                    ctx.setLineCap(Cairo.LineCap.ROUND);
                    ctx.stroke();
                    ctx.restore();
                }

                ctx.restore();
                ctx.setOperator(Cairo.Operator.OVER);

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
            });

            redrawAccessor.subscribe(() => {
                da.queue_draw()
            })
        }}
    />;
}

function getPositionArray() {
    const menuPosition = variableConfig.frame.menuPosition.asAccessor()
    const calendarPosition = variableConfig.frame.calendarPosition.asAccessor()
    const clipboardManagerPosition = variableConfig.frame.clipboardManagerPosition.asAccessor()
    const notificationHistoryPosition = variableConfig.frame.notificationsPosition.asAccessor()

    const leftSide = []
    const rightSide = []

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

    rightSide.reverse()

    return [leftBar, ...leftSide, frame, ...rightSide, rightBar]
}

export default function (): Astal.Window {

    const menuPosition = variableConfig.frame.menuPosition.asAccessor()
    const calendarPosition = variableConfig.frame.calendarPosition.asAccessor()
    const clipboardManagerPosition = variableConfig.frame.clipboardManagerPosition.asAccessor()
    const notificationHistoryPosition = variableConfig.frame.notificationsPosition.asAccessor()

    createComputed([
        menuPosition,
        calendarPosition,
        clipboardManagerPosition,
        notificationHistoryPosition,
    ]).subscribe(() => {
        orderChildrenLTR(frameBox, getPositionArray())
    })

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
            <TopBar/>
            <box
                vexpand={true}
                hexpand={true}
                orientation={Gtk.Orientation.HORIZONTAL}
                $={(self) => {
                    frameBox = self

                    // Add the children in the proper order based on the currently selected bar
                    frame = <OutlineOverlay/> as Gtk.Widget
                    leftBar = <LeftBar/> as Gtk.Widget
                    rightBar = <RightBar/> as Gtk.Widget
                    integratedMenu = <IntegratedMenu/> as Gtk.Widget
                    integratedCalendar = <IntegratedCalendar/> as Gtk.Widget
                    integratedClipboardManager = <IntegratedClipboardManager/> as Gtk.Widget
                    integratedNotificationHistory = <IntegratedNotificationHistory/> as Gtk.Widget

                    appendChildren(self, getPositionArray())
                }}>
            </box>
            <BottomBar/>
        </box>
    </window> as Astal.Window
}