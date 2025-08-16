import {Gtk} from "ags/gtk4";
import App from "ags/gtk4/app"
import OkButton, {OkButtonHorizontalPadding, OkButtonSize} from "./OkButton";
import {Accessor, createBinding, createState} from "ags";

type Params = {
    marginTop?: number;
    marginBottom?: number;
    marginStart?: number;
    marginEnd?: number;
    visible?: boolean | Accessor<boolean>;
    icon: string | Accessor<string>;
    iconOffset: number | Accessor<number>;
    windowName: string;
    setup?: (revealed: Accessor<boolean>) => void;
    onClick?: () => void;
    content?: JSX.Element;
    revealedContent?: JSX.Element;
}

export default function (
    {
        marginTop = 0,
        marginBottom = 0,
        marginStart = 0,
        marginEnd = 0,
        visible = true,
        icon,
        iconOffset,
        windowName,
        setup,
        onClick,
        content,
        revealedContent,
    }: Params
) {
    const [revealed, revealedSetter] = createState(false)

    if (setup) {
        setup(revealed)
    }

    setTimeout(() => {
        createBinding(App.get_window(windowName)!, "visible").subscribe(() => {
            if (!App.get_window(windowName)?.visible) {
                revealedSetter(false)
            }
        })
    }, 1_000)

    return <box
        visible={visible}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginEnd={marginEnd}
        marginStart={marginStart}
        orientation={Gtk.Orientation.VERTICAL}>
        <box
            orientation={Gtk.Orientation.HORIZONTAL}>
            <OkButton
                size={OkButtonSize.XL}
                offset={iconOffset}
                label={icon}
                onClicked={onClick}/>
            <box marginEnd={10}/>
            <box
                marginTop={4}>
                {content}
            </box>
            <OkButton
                size={OkButtonSize.SMALL}
                hpadding={OkButtonHorizontalPadding.THIN}
                label={revealed((revealed): string => {
                    if (revealed) {
                        return ""
                    } else {
                        return ""
                    }
                })}
                onClicked={() => {
                    revealedSetter(!revealed.get())
                }}/>
        </box>
        <revealer
            marginStart={10}
            marginEnd={10}
            revealChild={revealed}
            transitionDuration={200}
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}>
            {revealedContent}
        </revealer>
    </box>
}