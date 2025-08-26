import {Astal, Gdk, Gtk} from "ags/gtk4";
import App from "ags/gtk4/app"
import {variableConfig} from "../../config/config";
import {hideAllWindows} from "../utils/windows";
import {Bar, selectedBar} from "../../config/bar";
import {Accessor, createComputed} from "ags";

type Params = {
    monitor: number | Accessor<number>;
    windowName: string,
    namespace?: string,
    anchor?: Accessor<Astal.WindowAnchor> | Astal.WindowAnchor,
    topExpand: Accessor<boolean> | boolean,
    bottomExpand: Accessor<boolean> | boolean,
    rightExpand: Accessor<boolean> | boolean,
    leftExpand: Accessor<boolean> | boolean,
    contentWidth: number,
    visible?: boolean,
    width?: number | Accessor<number>,
    height?: number | Accessor<number>,
    content?: JSX.Element;
}

function defaultAnchor(){
    return createComputed([
        selectedBar.asAccessor(),
    ], (bar) => {
        switch (bar) {
            case Bar.TOP:
            case Bar.BOTTOM:
                return Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.RIGHT
                    | Astal.WindowAnchor.BOTTOM
                    | Astal.WindowAnchor.LEFT
            case Bar.LEFT:
                return Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.LEFT
                    | Astal.WindowAnchor.BOTTOM
            case Bar.RIGHT:
                return Astal.WindowAnchor.TOP
                    | Astal.WindowAnchor.RIGHT
                    | Astal.WindowAnchor.BOTTOM
        }
    })
}

export default function(
    {
        monitor,
        windowName,
        namespace,
        anchor = defaultAnchor(),
        topExpand,
        bottomExpand,
        rightExpand,
        leftExpand,
        contentWidth,
        visible = false,
        width = 0,
        height = 0,
        content,
    }: Params
): Astal.Window {
    let mainBox: Gtk.Box

    return <window
        heightRequest={height}
        widthRequest={width}
        monitor={monitor}
        namespace={namespace}
        name={windowName}
        anchor={anchor}
        margin={variableConfig.theme.windows.gaps.asAccessor()}
        exclusivity={Astal.Exclusivity.NORMAL}
        layer={Astal.Layer.OVERLAY}
        cssClasses={["transparentBackground"]}
        application={App}
        visible={visible}
        keymode={Astal.Keymode.ON_DEMAND}
        $={(self) => {
            const gesture = new Gtk.GestureClick();
            gesture.connect('pressed', (_gesture, n_press, x, y) => {
                const [_, childX, childY] = mainBox.translate_coordinates(self, 0, 0)
                const allocation = mainBox.get_allocation();
                const insideIgnoredChild =
                    x >= childX &&
                    x <= childX + allocation.width &&
                    y >= childY &&
                    y <= childY + allocation.height;

                if (insideIgnoredChild) {
                    return;
                }
                hideAllWindows()
            });
            self.add_controller(gesture);

            let keyController = new Gtk.EventControllerKey()

            keyController.connect("key-pressed", (_, key) => {
                if (key === Gdk.KEY_Escape) {
                    hideAllWindows()
                }
            })

            self.add_controller(keyController)
        }}>
        <box orientation={Gtk.Orientation.VERTICAL}>
            <box vexpand={topExpand}/>
            <box
                orientation={Gtk.Orientation.HORIZONTAL}>
                <box hexpand={leftExpand}/>
                <box
                    hexpand={false}
                    orientation={Gtk.Orientation.VERTICAL}
                    cssClasses={["window"]}
                    $={(self) => {
                        mainBox = self;
                    }}>
                    <Gtk.ScrolledWindow
                        cssClasses={["scrollWindow"]}
                        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                        propagateNaturalHeight={true}
                        widthRequest={contentWidth}>
                        {content}
                    </Gtk.ScrolledWindow>
                </box>
                <box hexpand={rightExpand}/>
            </box>
            <box vexpand={bottomExpand}/>
        </box>
    </window> as Astal.Window
}