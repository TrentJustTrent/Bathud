import {Astal, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app";
import Cairo from 'gi://cairo';
import {hexToRgba} from "../utils/strings";
import {variableConfig} from "../../config/config";

export const monitorFrameWindowName = "monitorFrame"

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
    const thickness       = 0;
    const innerRadius     = 20; // <- rounded INSIDE corners
    const [fr, fg, fb, fa]    = hexToRgba(variableConfig.theme.colors.background);
    const [br, bg, bb, ba]  = hexToRgba(variableConfig.theme.colors.primary.asAccessor().get());
    const innerBorderWidth  = 2;

    return <drawingarea
        hexpand
        vexpand
        canTarget={false}
        sensitive={false}
        $={(da: Gtk.DrawingArea) => {
            da.set_draw_func((_area, ctx: any, w: number, h: number) => {
                ctx.save();
                ctx.setAntialias(Cairo.Antialias.BEST);

                // Frame: square outer edges
                ctx.setOperator(Cairo.Operator.OVER);
                ctx.setSourceRGBA(fr, fg, fb, fa);
                ctx.rectangle(0, 0, w, h);
                ctx.fill();

                // Inner hole geometry
                const x = thickness, y = thickness;
                const iw = Math.max(0, w - 2 * thickness);
                const ih = Math.max(0, h - 2 * thickness);
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
            });
        }}
    />;
}

export function MonitorFrameBottom(): Astal.Window {
    return <window
        cssClasses={["transparentBackground"]}
        layer={Astal.Layer.OVERLAY}
        namespace={"okpanel-monitor-frame"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
        visible={true}
        application={App}
        canTarget={false}
        canFocus={false}
        $={(self) => {
            self.get_native()?.get_surface()?.set_input_region(new Cairo.Region())
        }}>
        <box
            vexpand={true}
            hexpand={true}
            heightRequest={20}
            cssClasses={["testBackground"]}/>
    </window> as Astal.Window
}

export function MonitorFrameTop(): Astal.Window {
    return <window
        cssClasses={["transparentBackground"]}
        layer={Astal.Layer.OVERLAY}
        namespace={"okpanel-monitor-frame"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
        visible={true}
        application={App}
        canTarget={false}
        canFocus={false}
        $={(self) => {
            self.get_native()?.get_surface()?.set_input_region(new Cairo.Region())
        }}>
        <box
            vexpand={true}
            hexpand={true}
            heightRequest={20}
            cssClasses={["testBackground"]}/>
    </window> as Astal.Window
}

export function MonitorFrameLeft(): Astal.Window {
    return <window
        cssClasses={["transparentBackground"]}
        layer={Astal.Layer.OVERLAY}
        namespace={"okpanel-monitor-frame"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
        visible={true}
        application={App}
        canTarget={false}
        canFocus={false}
        $={(self) => {
            self.get_native()?.get_surface()?.set_input_region(new Cairo.Region())
        }}>
        <box
            vexpand={true}
            hexpand={true}
            widthRequest={20}
            cssClasses={["testBackground"]}/>
    </window> as Astal.Window
}

export function MonitorFrameRight(): Astal.Window {
    return <window
        cssClasses={["transparentBackground"]}
        layer={Astal.Layer.OVERLAY}
        namespace={"okpanel-monitor-frame"}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.TOP}
        visible={true}
        application={App}
        canTarget={false}
        canFocus={false}
        $={(self) => {
            self.get_native()?.get_surface()?.set_input_region(new Cairo.Region())
        }}>
        <box
            vexpand={true}
            hexpand={true}
            widthRequest={20}
            cssClasses={["testBackground"]}/>
    </window> as Astal.Window
}

export default function (): Astal.Window {


    return <window
        name={monitorFrameWindowName}
        cssClasses={["transparentBackground"]}
        layer={Astal.Layer.OVERLAY}
        namespace={"okpanel-monitor-frame"}
        exclusivity={Astal.Exclusivity.NORMAL}
        anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT}
        visible={true}
        application={App}
        canTarget={false}
        canFocus={false}
        $={(self) => {
            self.get_native()?.get_surface()?.set_input_region(new Cairo.Region())
        }}>
        <OutlineOverlay/>
    </window> as Astal.Window
}