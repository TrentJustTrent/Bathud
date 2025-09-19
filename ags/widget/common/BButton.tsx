import {isAccessor} from "../utils/bindings";
import Pango from "gi://Pango?version=1.0";
import {Accessor, createComputed, createState} from "ags";
import {Gtk} from "ags/gtk4";
import {attachClickHandlers} from "../utils/clickHandler";

export enum BButtonHorizontalPadding {
    STANDARD,
    THIN,
    NONE
}

export enum BButtonVerticalPadding {
    STANDARD,
    THIN,
    NONE
}

export enum BButtonSize {
    SMALL,
    MEDIUM,
    LARGE,
    XL,
}

function buildButtonCssClasses(
    backgroundCss: string[],
    size: BButtonSize,
    primary: boolean,
    menuButtonContent?: JSX.Element,
    selected?: Accessor<boolean>,
    selectedCss?: string[],
): string[] | Accessor<string[]> {
    const buttonClasses: string[] = []

    switch (size) {
        case BButtonSize.SMALL:
        case BButtonSize.MEDIUM:
        case BButtonSize.LARGE:
            buttonClasses.push("radiusSmall")
            break
        case BButtonSize.XL:
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
        buttonClasses.push("bbuttonClass")
        if (primary) {
            buttonClasses.push("bbuttonClassPrimary")
        }
        buttonClasses.push(...backgroundCss)
        return buttonClasses
    }

    buttonClasses.push(...backgroundCss)

    return selected.as((isSelected) => {
        if (isSelected) {
            if (selectedCss === undefined) {
                return buttonClasses.concat("bbuttonClassSelected")
            } else {
                return buttonClasses.concat(selectedCss)
            }
        } else {
            return buttonClasses.concat("bbuttonClass")
        }
    })
}

export default function(
    {
        labelCss = [],
        backgroundCss = [],
        selectedCss,
        label,
        offset = 0,
        selected,
        hpadding = BButtonHorizontalPadding.STANDARD,
        vpadding = BButtonVerticalPadding.STANDARD,
        size = BButtonSize.SMALL,
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
        onHoverEnter,
        onHoverLeave,
        onClicked,
        clickHandlers,
    }:
    {
        labelCss?: string[]
        backgroundCss?: string[]
        selectedCss?: string[]
        label: Accessor<string> | string,
        offset?: number | Accessor<number>,
        selected?: Accessor<boolean>,
        hpadding?: BButtonHorizontalPadding | Accessor<BButtonHorizontalPadding>,
        vpadding?: BButtonVerticalPadding | Accessor<BButtonVerticalPadding>,
        size?: BButtonSize | Accessor<BButtonSize>,
        bold?: boolean | Accessor<boolean>,
        warning?: boolean | Accessor<boolean>,
        primary?: boolean,
        visible?: boolean | Accessor<boolean>,
        widthRequest?: number,
        heightRequest?: number,
        marginTop?: number,
        marginBottom?: number,
        marginStart?: number,
        marginEnd?: number,
        hexpand?: boolean | Accessor<boolean>,
        vexpand?: boolean | Accessor<boolean>,
        halign?: Gtk.Align | Accessor<Gtk.Align>,
        valign?: Gtk.Align | Accessor<Gtk.Align>,
        labelHalign?: Gtk.Align | Accessor<Gtk.Align>,
        ellipsize?: Pango.EllipsizeMode,
        menuButtonContent?: JSX.Element,
        onHoverEnter?: () => void,
        onHoverLeave?: () => void,
        onClicked?: () => void,
        clickHandlers?: {
            onLeftClick?:    (ev: {self:Gtk.Widget,x:number,y:number,n:number,shift:boolean,ctrl:boolean}) => void,
            onMiddleClick?:  (ev: {self:Gtk.Widget,x:number,y:number,n:number,shift:boolean,ctrl:boolean}) => void,
            onRightClick?:   (ev: {self:Gtk.Widget,x:number,y:number,n:number,shift:boolean,ctrl:boolean}) => void,
            onDoubleLeft?:   (ev: {self:Gtk.Widget,x:number,y:number}) => void,
            onLongPress?:    (ev: {self:Gtk.Widget,x:number,y:number}) => void,
        },
    }
) {
    let realWarning: Accessor<boolean>
    if (isAccessor(warning)) {
        realWarning = warning
    } else {
        realWarning = createState(warning)[0]
    }
    let realSize: Accessor<BButtonSize>
    if (isAccessor(size)) {
        realSize = size
    } else {
        realSize = createState(size)[0]
    }
    let realBold: Accessor<boolean>
    if (isAccessor(bold)) {
        realBold = bold
    } else {
        realBold = createState(bold)[0]
    }
    const cssInputs = createComputed([
        realWarning,
        realSize,
        realBold,
    ])

    const labelVerticalMargin = createComputed([
        isAccessor(vpadding) ? vpadding : createState(vpadding)[0]
    ], (v) => {
        switch (v) {
            case BButtonVerticalPadding.STANDARD:
                return 8
            case BButtonVerticalPadding.THIN:
                return 4
            case BButtonVerticalPadding.NONE:
                return 0
        }
    })

    const labelMarginStart = createComputed([
        isAccessor(offset) ? offset : createState(offset)[0],
        isAccessor(hpadding) ? hpadding : createState(hpadding)[0],
    ], (o, h) => {
        let horizontalPadding
        switch (h) {
            case BButtonHorizontalPadding.STANDARD:
                horizontalPadding = 18
                break
            case BButtonHorizontalPadding.THIN:
                horizontalPadding = 14
                break
            case BButtonHorizontalPadding.NONE:
                horizontalPadding = 0
        }
        return horizontalPadding - o
    })

    const labelMarginEnd = createComputed([
        isAccessor(offset) ? offset : createState(offset)[0],
        isAccessor(hpadding) ? hpadding : createState(hpadding)[0],
    ], (o, h) => {
        let horizontalPadding
        switch (h) {
            case BButtonHorizontalPadding.STANDARD:
                horizontalPadding = 18
                break
            case BButtonHorizontalPadding.THIN:
                horizontalPadding = 14
                break
            case BButtonHorizontalPadding.NONE:
                horizontalPadding = 0
        }
        return horizontalPadding + o
    })

    const onlyLabel = onClicked === undefined
        && menuButtonContent === undefined
        && clickHandlers === undefined

    const labelWidget = <label
        visible={visible}
        ellipsize={ellipsize}
        halign={labelHalign}
        valign={onlyLabel ? valign : Gtk.Align.FILL}
        hexpand={onlyLabel ? hexpand : false}
        vexpand={onlyLabel ? vexpand : false}
        cssClasses={cssInputs(([warning, size, bold]) => {
            const labelClasses: string[] = []

            switch (size) {
                case BButtonSize.SMALL:
                    labelClasses.push("labelSmall")
                    break
                case BButtonSize.MEDIUM:
                    labelClasses.push("labelMedium")
                    break
                case BButtonSize.LARGE:
                    labelClasses.push("labelLarge")
                    break
                case BButtonSize.XL:
                    labelClasses.push("labelXL")
                    break
            }

            if (bold) {
                labelClasses.push("bold")
            }

            labelClasses.push(...labelCss)

            return warning ? labelClasses.concat("colorWarning") : labelClasses
        })}
        marginTop={labelVerticalMargin}
        marginBottom={labelVerticalMargin}
        marginStart={labelMarginStart}
        marginEnd={labelMarginEnd}
        label={label}
        $={(self) => {
            const motion = new Gtk.EventControllerMotion()
            motion.connect("enter", () => onHoverEnter?.())
            motion.connect("leave", () => onHoverLeave?.())
            self.add_controller(motion)
        }}/>

    const buttonClasses = buildButtonCssClasses(
        backgroundCss,
        realSize.get(),
        primary,
        menuButtonContent,
        selected,
        selectedCss,
    )

    if (menuButtonContent !== undefined) {
        return <menubutton
            focusable={false}
            focusOnClick={false}
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
            onActivate={onClicked}>
            {labelWidget}
            {menuButtonContent}
        </menubutton>
    }

    if (clickHandlers !== undefined) {
        return <box
            $={(self) => {
                attachClickHandlers(self, clickHandlers)
            }}
            focusable={false}
            focusOnClick={false}
            sensitive={!onlyLabel}
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
            cssClasses={buttonClasses}>
            {labelWidget}
        </box>
    }

    return <button
        focusable={false}
        focusOnClick={false}
        sensitive={!onlyLabel}
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