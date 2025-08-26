import {Astal, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app";
import Cairo from 'gi://cairo';
import {hexToRgba} from "../../utils/strings";
import {variableConfig} from "../../../config/config";
import {createComputed} from "ags";
import {Bar, selectedBar} from "../../../config/bar";
import LeftBar from "../LeftBar";
import IntegratedMenu from "../IntegratedMenu";
import TopBar from "../TopBar";
import {Position} from "../../../config/schema/definitions/systemMenu";
import RightBar from "../RightBar";
import BottomBar from "../BottomBar";
import IntegratedCalendar from "../../calendar/IntegratedCalendar";

export const frameWindowName = "frame"

let frameWindow: Gtk.Window

let frame: Gtk.Widget
let frameBox: Gtk.Box
let integratedMenu: Gtk.Widget
let leftBar: Gtk.Widget
let topBar: Gtk.Widget
let rightBar: Gtk.Widget
let bottomBar: Gtk.Widget
let integratedCalendar: Gtk.Widget

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
        selectedBar.asAccessor(),
        variableConfig.theme.bars.frameThickness.asAccessor(),
        variableConfig.theme.bars.borderRadius.asAccessor(),
        variableConfig.theme.bars.backgroundColor.asAccessor(),
        variableConfig.theme.colors.primary.asAccessor(),
        variableConfig.theme.bars.borderWidth.asAccessor(),
    ])

    return <drawingarea
        hexpand
        vexpand
        canTarget={false}
        sensitive={false}
        $={(da: Gtk.DrawingArea) => {
            da.set_draw_func((_area, ctx: any, w: number, h: number) => {
                const thickness       = variableConfig.theme.bars.frameThickness.get();
                const innerRadius     = variableConfig.theme.bars.borderRadius.get();
                const [fr, fg, fb, fa]    = hexToRgba(variableConfig.theme.bars.backgroundColor.get());
                const [br, bg, bb, ba]  = hexToRgba(variableConfig.theme.colors.primary.get());
                const innerBorderWidth  = variableConfig.theme.bars.borderWidth.get();
                const bar = selectedBar.get();

                ctx.save();
                ctx.setAntialias(Cairo.Antialias.BEST);

                // Frame: square outer edges
                ctx.setOperator(Cairo.Operator.OVER);
                ctx.setSourceRGBA(fr, fg, fb, fa);
                ctx.rectangle(0, 0, w, h);
                ctx.fill();

                // Inner hole geometry
                let x, y, iw, ih

                switch (bar) {
                    case Bar.BOTTOM:
                        x = thickness;
                        y = thickness;
                        iw = Math.max(0, w - 2 * thickness);
                        ih = Math.max(0, h - thickness);
                        break
                    case Bar.TOP:
                        x = thickness;
                        y = 0;
                        iw = Math.max(0, w - 2 * thickness);
                        ih = Math.max(0, h - thickness);
                        break
                    case Bar.LEFT:
                        x = 0;
                        y = thickness;
                        iw = Math.max(0, w - thickness);
                        ih = Math.max(0, h - 2 * thickness);
                        break
                    case Bar.RIGHT:
                        x = thickness;
                        y = thickness;
                        iw = Math.max(0, w - thickness);
                        ih = Math.max(0, h - 2 * thickness);
                        break
                }

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

export default function (): Astal.Window {

    variableConfig.systemMenu.position.asAccessor().subscribe(() => {
        const position = variableConfig.systemMenu.position.get()
        switch (position) {
            case Position.LEFT:
                frameBox.reorder_child_after(leftBar, integratedMenu)
                frameBox.reorder_child_after(integratedCalendar, leftBar)
                frameBox.reorder_child_after(frame, integratedCalendar)
                frameBox.reorder_child_after(rightBar, frame)
                break
            case Position.RIGHT:
                frameBox.reorder_child_after(frame, leftBar)
                frameBox.reorder_child_after(integratedCalendar, frame)
                frameBox.reorder_child_after(rightBar, integratedCalendar)
                frameBox.reorder_child_after(integratedMenu, rightBar)
                break
        }
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
            <TopBar
                setup={(self) => {
                    topBar = self
                }}/>
            <box
                vexpand={true}
                hexpand={true}
                orientation={Gtk.Orientation.HORIZONTAL}
                $={(self) => {
                    frameBox = self

                    // Add the children in the proper order based on the currently selected bar
                    const f = <box
                        canTarget={false}
                        canFocus={false}
                        visible={true}
                        $={(self) => {
                            frame = self
                        }}>
                        <OutlineOverlay/>
                    </box> as Gtk.Widget

                    const im = <IntegratedMenu
                        setup={(self) => {
                            integratedMenu = self
                        }}/> as Gtk.Widget

                    const lb = <LeftBar
                        setup={(self) => {
                            leftBar = self
                        }}/> as Gtk.Widget

                    const rb = <RightBar
                        setup={(self) => {
                            rightBar = self
                        }}/> as Gtk.Widget

                    const ic = <IntegratedCalendar
                        setup={(self) => {
                            integratedCalendar = self
                        }}/> as Gtk.Widget

                    if (variableConfig.systemMenu.position.get() === Position.LEFT) {
                        self.append(im)
                        self.append(lb)
                        self.append(ic)
                        self.append(f)
                        self.append(rb)
                    } else {
                        self.append(lb)
                        self.append(f)
                        self.append(ic)
                        self.append(rb)
                        self.append(im)
                    }
                }}>
            </box>
            <BottomBar
                setup={(self) => {
                    bottomBar = self
                }}/>
        </box>
    </window> as Astal.Window
}