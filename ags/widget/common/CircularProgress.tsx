import {Gtk} from "ags/gtk4";
import {Accessor} from "ags";

type RGBA = [number, number, number, number]; // r,g,b,a in 0..1

type Props = {
    progress: Accessor<number>;   // 0..1
    size?: number;                // px
    stroke?: number;              // px
    trackAlpha?: number;          // 0..1 (only used if no trackColor)
    fgColor?: RGBA;               // default [1,1,1,1]
    trackColor?: RGBA;            // default [1,1,1,trackAlpha]
    cssClasses?: string[];
};

export default function ({
    progress,
    size = 24,
    stroke = 3,
    trackAlpha = 0.25,
    fgColor = [1, 1, 1, 1],
    trackColor,                  // if omitted, uses fg with alpha
    cssClasses = [],
}: Props) {
    return (
        <drawingarea
            cssClasses={cssClasses}
            widthRequest={size}
            heightRequest={size}
            $={(area: Gtk.DrawingArea) => {
                const draw = (_: Gtk.DrawingArea, cr: any, w: number, h: number) => {
                    const p = Math.max(0, Math.min(1, progress.get()));
                    const cx = w / 2, cy = h / 2;
                    const r = Math.min(w, h) / 2 - stroke / 2;
                    const start = -Math.PI / 2;              // top
                    const end = start + p * 2 * Math.PI;

                    cr.setLineWidth(stroke);

                    // track ring
                    {
                        const [rC, gC, bC, aC] = trackColor ?? [fgColor[0], fgColor[1], fgColor[2], trackAlpha];
                        cr.setSourceRGBA(rC, gC, bC, aC);
                        cr.arc(cx, cy, r, 0, 2 * Math.PI);
                        cr.stroke();
                    }

                    // progress arc
                    {
                        const [rF, gF, bF, aF] = fgColor;
                        cr.setSourceRGBA(rF, gF, bF, aF);
                        cr.arc(cx, cy, r, start, end);
                        cr.stroke();
                    }
                };

                area.set_draw_func(draw);

                // re-draw whenever progress changes
                const unsub = progress.subscribe(() => area.queue_draw());
                area.connect("destroy", () => unsub());
            }}
        />
    );
}