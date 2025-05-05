import {Gtk} from "astal/gtk4";
import Cairo from 'gi://cairo';
import Cava from "gi://AstalCava"
import {bind} from "astal";
import {selectedBar, selectedTheme} from "../../config/config";
import {Bar} from "../../config/bar";

type Params = {
    vertical?: boolean,
    length?: number,
    size?: number,
    marginTop?: number,
    marginBottom?: number,
    marginStart?: number,
    marginEnd?: number,
}

function getCoordinate(value: number, size: number) {
    const magicSize = size * 0.6
    if (selectedBar.get() === Bar.LEFT) {
        return Math.min(size, value * magicSize)
    }
    return Math.max(0, size - (value * magicSize))
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

export default function(
    {
        vertical = false,
        length = 0,
        size = 0,
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

    // const originalAlpha = a

    const drawing = new Gtk.DrawingArea({
        hexpand: false,
        vexpand: false,
        height_request: vertical ? length : size,
        width_request: vertical ? size : length,
    });

    drawing.set_draw_func((
        area: Gtk.DrawingArea,
        cr: Cairo.Context,
        drawWidth: number,
        drawHeight: number
    ) => {
        // const nonZeroValues = cava.values.filter((value) => value > 0.001)
        // if (nonZeroValues.length === 0) {
        //     a = 0
        // } else {
        //     a = originalAlpha
        // }
        // @ts-ignore
        cr.setSourceRGBA(r, g, b, a);

        // @ts-ignore
        cr.setLineWidth(2);

        let x = 0
        const values = cava.values
        const spacing = length / (values.length * 2 + 1)

        values.reverse()

        moveTo(cr, vertical, 0, selectedBar.get() === Bar.LEFT ? -1 : size - 1)

        values.forEach((value) => {
            x = x + spacing
            lineTo(cr, vertical, x, getCoordinate(value, size) - 1)
        })

        values.reverse()

        values.forEach((value) => {
            x = x + spacing
            lineTo(cr, vertical, x, getCoordinate(value, size) - 1)
        })

        lineTo(cr, vertical, length, selectedBar.get() === Bar.LEFT ? -1 : size - 1)

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
        widthRequest={vertical ? size : length}
        heightRequest={vertical ? length : size}>
        {drawing}
    </box>
}