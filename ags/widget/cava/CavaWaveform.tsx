import {Gtk} from "astal/gtk4";
import Cairo from 'gi://cairo';
import Cava from "gi://AstalCava"
import {bind} from "astal";
import {selectedBar, selectedTheme} from "../../config/config";
import {Bar} from "../../config/bar";

function getCoordinate(value: number, size: number) {
    const magicSize = size * 0.6
    if (selectedBar.get() === Bar.LEFT) {
        // subtract 1 to make it align with the bar if the line should be flat
        return Math.min(size, (value * magicSize) - 1)
    }
    // add 1 to make it align with the bar if the line should be flat
    return Math.max(0, size - (value * magicSize) + 1)
}

function hexToRgba(hex: string): [number, number, number, number] {
    hex = hex.replace("#", "");

    if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        return [r, g, b, 1];
    }

    if (hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        const a = parseInt(hex.slice(6, 8), 16) / 255;
        return [r, g, b, a];
    }

    throw new Error(`Invalid hex color: "${hex}"`);
}

function moveTo(
    cr: Cairo.Context,
    vertical: boolean,
    length: number,
    size: number,
) {
    if (vertical) {
        // @ts-ignore
        cr.moveTo(size, length)
    } else {
        // @ts-ignore
        cr.moveTo(length, size)
    }
}

function lineTo(
    cr: Cairo.Context,
    vertical: boolean,
    length: number,
    size: number,
) {
    if (vertical) {
        // @ts-ignore
        cr.lineTo(size, length)
    } else {
        // @ts-ignore
        cr.lineTo(length, size)
    }
}

type Params = {
    vertical?: boolean,
    length?: number,
    size?: number,
    expand?: boolean,
    marginTop?: number,
    marginBottom?: number,
    marginStart?: number,
    marginEnd?: number,
}

export default function(
    {
        vertical = false,
        length = 0,
        size = 0,
        expand = false,
        marginTop,
        marginBottom,
        marginStart,
        marginEnd,
    }: Params
) {
    const cava = Cava.get_default()

    if (cava === null) {
        return <box/>
    }

    let [r, g, b, a] = hexToRgba(selectedTheme.get().colors.primary);

    const drawing = new Gtk.DrawingArea({
        hexpand: vertical ? false : expand,
        vexpand: vertical ? expand : false,
        height_request: vertical ? length : size,
        width_request: vertical ? size : length,
    });

    drawing.set_draw_func((
        area: Gtk.DrawingArea,
        cr: Cairo.Context,
        drawWidth: number,
        drawHeight: number
    ) => {
        const drawLength = vertical ? drawHeight : drawWidth
        const drawSize = vertical ? drawWidth : drawHeight
        const bar = selectedBar.get()

        // @ts-ignore
        cr.setSourceRGBA(r, g, b, a);

        // @ts-ignore
        cr.setLineWidth(2);

        let x = 0
        const values = cava.values
        // add one to even the ends out
        const spacing = drawLength / (values.length * 2 + 1)

        values.reverse()

        // add or subtract 1 to make it align with the bar if the line should be flat
        moveTo(cr, vertical, 0, bar === Bar.LEFT ? -1 : drawSize + 1)

        values.forEach((value) => {
            x = x + spacing
            lineTo(cr, vertical, x, getCoordinate(value, drawSize))
        })

        values.reverse()

        values.forEach((value) => {
            x = x + spacing
            lineTo(cr, vertical, x, getCoordinate(value, drawSize))
        })

        // add or subtract 1 to make it align with the bar if the line should be flat
        lineTo(cr, vertical, drawLength, bar === Bar.LEFT ? -1 : drawSize + 1)

        // @ts-ignore
        cr.stroke();
    });

    bind(cava, "values").subscribe((values) => {
        drawing.queue_draw()
    })

    return <box
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginStart={marginStart}
        marginEnd={marginEnd}
        vexpand={vertical ? expand : false}
        hexpand={vertical ? false : expand}
        widthRequest={vertical ? size : length}
        heightRequest={vertical ? length : size}>
        {drawing}
    </box>
}