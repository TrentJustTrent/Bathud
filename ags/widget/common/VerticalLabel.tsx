import Cairo from "cairo";
import {Gtk} from "astal/gtk4";
import {config, selectedTheme} from "../../config/config";
import {hexToRgba} from "../utils/strings";
import {Binding} from "astal";
import {isBinding} from "../utils/bindings";

export default function (
    {
        text,
        fontSize,
        flipped,
        bold,
        centered = true,
        minimumHeight = 0,
    }:
    {
        text: string | Binding<string>,
        fontSize: number,
        flipped: boolean | Binding<boolean>,
        bold: boolean,
        centered?: boolean,
        minimumHeight?: number,
    }
) {
    const area = new Gtk.DrawingArea()
    area.set_content_width(fontSize + 6)

    let realText = ""
    if (isBinding(text)) {
        text.subscribe((value) => {
            realText = value
            area.queue_draw()
        })
        realText = text.get()
    } else {
        realText = text
    }

    let realFlipped = false
    if (isBinding(flipped)) {
        flipped.subscribe((value) => {
            realFlipped = value
            area.queue_draw()
        })
        realFlipped = flipped.get()
    } else {
        realFlipped = flipped
    }

    let [r, g, b, a] = hexToRgba(selectedTheme.get().colors.foreground)

    selectedTheme().subscribe((theme) => {
        [r, g, b, a] = hexToRgba(theme.colors.foreground)
        area.queue_draw()
    })

    area.set_draw_func((widget, cr, width, height) => {
        // @ts-ignore
        cr.save()
        // @ts-ignore
        cr.translate(width / 2, height / 2)
        // @ts-ignore
        cr.rotate(realFlipped ? Math.PI / 2 : -Math.PI / 2) // 90 degrees counterclockwise
        // @ts-ignore
        cr.setSourceRGBA(r, g, b, a)
        // @ts-ignore
        cr.selectFontFace(config.font, Cairo.FontSlant.NORMAL, bold ? Cairo.FontWeight.BOLD : Cairo.FontWeight.NORMAL)// @ts-ignore
        cr.setFontSize(fontSize)

        // @ts-ignore
        const extents = cr.textExtents(realText)
        const textWidth = extents.width
        const textHeight = extents.height

        // this will center
        let y
        if (centered) {
            y = -textWidth / 2
        } else {
            y = -height / 2
        }

        const x = (width - textHeight) / 2
        // @ts-ignore
        cr.moveTo(y, x)

        // @ts-ignore
        cr.showText(realText)
        // @ts-ignore
        cr.restore()

        // textWidth is height when rotated
        area.set_content_height(textWidth)
    })

    return <box
        heightRequest={minimumHeight}>
        {area}
    </box>
}