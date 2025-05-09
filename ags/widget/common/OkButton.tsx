import {bind, Binding, Variable} from "astal";
import {isBinding} from "../utils/bindings";
import {Gtk} from "astal/gtk4";
import Pango from "gi://Pango?version=1.0";

export enum IconButtonHorizontalPadding {
    STANDARD,
    THIN,
    NONE
}

export enum IconButtonSize {
    SMALL,
    MEDIUM,
    LARGE,
    XL,
}

function buildButtonCssClasses(
    size: IconButtonSize,
    primary: boolean,
    menuButtonContent?: JSX.Element,
    selected?: Binding<boolean>,
): string[] | Binding<string[]> {
    const buttonClasses: string[] = []

    switch (size) {
        case IconButtonSize.SMALL:
        case IconButtonSize.MEDIUM:
        case IconButtonSize.LARGE:
            buttonClasses.push("radiusSmall")
            break
        case IconButtonSize.XL:
            buttonClasses.push("radiusLarge")
            break
    }

    if (menuButtonContent !== undefined) {
        buttonClasses.push("trayIconButton")
    }

    if (primary) {
        buttonClasses.push("backgroundColorPrimary")
    }

    if (selected === undefined) {
        buttonClasses.push("iconButtonClass")
        if (primary) {
            buttonClasses.push("iconButtonClassPrimary")
        }
        return buttonClasses
    }

    return selected.as((isSelected) => {
        if (isSelected) {
            return buttonClasses.concat("iconButtonClassSelected")
        } else {
            return buttonClasses.concat("iconButtonClass")
        }
    })
}

export default function(
    {
        label,
        offset = 0,
        selected,
        hpadding = IconButtonHorizontalPadding.STANDARD,
        size = IconButtonSize.SMALL,
        bold = false,
        warning = false,
        primary = false,
        visible = true,
        widthRequest = 0,
        heightRequest = 0,
        marginTop,
        marginBottom,
        marginStart,
        marginEnd,
        hexpand = false,
        vexpand = false,
        halign = Gtk.Align.FILL,
        valign = Gtk.Align.FILL,
        labelHalign = Gtk.Align.FILL,
        ellipsize = Pango.EllipsizeMode.NONE,
        menuButtonContent,
        onClicked,
    }:
    {
        label: Binding<string> | string,
        offset?: number | Binding<number>,
        selected?: Binding<boolean>,
        hpadding?: IconButtonHorizontalPadding,
        size?: IconButtonSize,
        bold?: boolean,
        warning?: boolean | Binding<boolean>,
        primary?: boolean,
        visible?: boolean | Binding<boolean>,
        widthRequest?: number,
        heightRequest?: number,
        marginTop?: number,
        marginBottom?: number,
        marginStart?: number,
        marginEnd?: number,
        hexpand?: boolean | Binding<boolean>,
        vexpand?: boolean | Binding<boolean>,
        halign?: Gtk.Align | Binding<Gtk.Align>,
        valign?: Gtk.Align | Binding<Gtk.Align>,
        labelHalign?: Gtk.Align | Binding<Gtk.Align>,
        ellipsize?: Pango.EllipsizeMode,
        menuButtonContent?: JSX.Element,
        onClicked?: () => void
    }
) {
    let realWarning: Binding<boolean>
    if (isBinding(warning)) {
        realWarning = warning
    } else {
        realWarning = bind(Variable(warning))
    }
    const verticalPadding = 8

    let horizontalPadding
    switch (hpadding) {
        case IconButtonHorizontalPadding.STANDARD:
            horizontalPadding = 18
            break
        case IconButtonHorizontalPadding.THIN:
            horizontalPadding = 14
            break
        case IconButtonHorizontalPadding.NONE:
            horizontalPadding = 0
    }

    const labelClasses: string[] = []

    switch (size) {
        case IconButtonSize.SMALL:
            labelClasses.push("labelSmall")
            break
        case IconButtonSize.MEDIUM:
            labelClasses.push("labelMedium")
            break
        case IconButtonSize.LARGE:
            labelClasses.push("labelLarge")
            break
        case IconButtonSize.XL:
            labelClasses.push("labelXL")
            break
    }
    if (bold) {
        labelClasses.push("bold")
    }

    const onlyLabel = onClicked === undefined && menuButtonContent === undefined

    const labelWidget = <label
        visible={visible}
        ellipsize={ellipsize}
        halign={labelHalign}
        valign={onlyLabel ? valign : Gtk.Align.FILL}
        hexpand={onlyLabel ? hexpand : false}
        vexpand={onlyLabel ? vexpand : false}
        cssClasses={realWarning.as((warning) => {
            return warning ? labelClasses.concat("colorWarning") : labelClasses
        })}
        marginTop={verticalPadding}
        marginBottom={verticalPadding}
        marginStart={typeof offset === 'number' ? horizontalPadding - offset : offset.as((value) => horizontalPadding - value)}
        marginEnd={typeof offset === 'number' ? horizontalPadding + offset : offset.as((value) => horizontalPadding + value)}
        label={label}/>

    if (onlyLabel) {
        return labelWidget
    }

    const buttonClasses = buildButtonCssClasses(
        size,
        primary,
        menuButtonContent,
        selected,
    )

    if (menuButtonContent !== undefined) {
        return <menubutton
            widthRequest={widthRequest}
            heightRequest={heightRequest}
            marginTop={marginTop}
            marginBottom={marginBottom}
            marginStart={marginStart}
            marginEnd={marginEnd}
            halign={halign}
            valign={valign}
            hexpand={hexpand}
            vexpand={vexpand}
            visible={visible}
            cssClasses={buttonClasses}
            onClicked={onClicked}>
            {labelWidget}
            {menuButtonContent}
        </menubutton>
    }

    return <button
        widthRequest={widthRequest}
        heightRequest={heightRequest}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginStart={marginStart}
        marginEnd={marginEnd}
        halign={halign}
        valign={valign}
        hexpand={hexpand}
        vexpand={vexpand}
        visible={visible}
        cssClasses={buttonClasses}
        onClicked={onClicked}>
        {labelWidget}
    </button>
}