import {Binding} from "astal";

export enum IconButtonMode {
    SQUARE,
    WIDE,
    TALL,
}

export enum IconButtonSize {
    SMALL,
    MEDIUM,
    LARGE,
    XL,
}

export default function(
    {
        icon,
        offset = 2,
        selected,
        mode = IconButtonMode.SQUARE,
        size = IconButtonSize.SMALL,
        bold = false,
        warning = false,
        onClicked,
    }:
    {
        icon: Binding<string> | string,
        offset?: number | Binding<number>,
        selected?: Binding<boolean>,
        mode?: IconButtonMode,
        size?: IconButtonSize,
        bold?: boolean,
        warning?: boolean,
        onClicked?: () => void
    }
) {
    let verticalPadding
    switch (mode) {
        case IconButtonMode.TALL:
        case IconButtonMode.SQUARE:
            verticalPadding = 8
            break
        case IconButtonMode.WIDE:
            verticalPadding = 8
            break
    }

    let horizontalPadding
    switch (mode) {
        case IconButtonMode.WIDE:
        case IconButtonMode.SQUARE:
            horizontalPadding = 16
            break
        case IconButtonMode.TALL:
            horizontalPadding = 14
            break
    }

    const labelClasses: string[] = []
    let buttonRadiusClass: string

    switch (size) {
        case IconButtonSize.SMALL:
            labelClasses.push("labelSmall")
            buttonRadiusClass = "radiusSmall"
            break
        case IconButtonSize.MEDIUM:
            labelClasses.push("labelMedium")
            buttonRadiusClass = "radiusSmall"
            break
        case IconButtonSize.LARGE:
            labelClasses.push("labelLarge")
            buttonRadiusClass = "radiusSmall"
            break
        case IconButtonSize.XL:
            labelClasses.push("labelXL")
            buttonRadiusClass = "radiusLarge"
            break
    }
    if (warning) {
        labelClasses.push("colorWarning")
    }
    if (bold) {
        labelClasses.push("bold")
    }

    const label = <label
        cssClasses={labelClasses}
        marginTop={verticalPadding}
        marginBottom={verticalPadding}
        marginStart={typeof offset === 'number' ? horizontalPadding - offset : offset.as((value) => horizontalPadding - value)}
        marginEnd={typeof offset === 'number' ? horizontalPadding + offset : offset.as((value) => horizontalPadding + value)}
        label={icon}/>

    if (onClicked === null) {
        return label
    }

    const buttonClasses = selected === undefined ?
        ["iconButtonClass", buttonRadiusClass]
        : selected.as((b) => {
            return b ? ["iconButtonClassSelected", buttonRadiusClass]
                : ["iconButtonClass", buttonRadiusClass]
        })

    return <button
        cssClasses={buttonClasses}
        onClicked={onClicked}>
        {label}
    </button>
}