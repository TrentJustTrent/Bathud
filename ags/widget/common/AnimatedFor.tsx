import Gtk from "gi://Gtk?version=4.0"
import {Accessor, createComputed, createState, For, onCleanup, With} from "ags";
import {timeout} from "ags/time";

type AnimatedForProps<Item, El extends JSX.Element, Key> = {
    each: Accessor<Iterable<Item>>
    children: (item: Item, index: Accessor<number>) => El
    emptyState?: El,
    id?: (item: Item) => Key
    /** Revealer transition type (default: CROSSFADE) */
    transitionType?: Gtk.RevealerTransitionType
    /** Revealer transition duration in ms (default: 220) */
    transitionDuration?: number
    orientation?: Gtk.Orientation
}

/**
 * A wrapper around <For> that animates item removal/exit with Gtk.Revealer.
 * It delays unmounting until the hide animation finishes.
 */
export function AnimatedFor<Item, El extends JSX.Element, Key>({
    each,
    children,
    emptyState,
    id = (item: any) => item as any as Key,
    transitionType = Gtk.RevealerTransitionType.CROSSFADE,
    transitionDuration = 220,
    orientation = Gtk.Orientation.VERTICAL,
}: AnimatedForProps<Item, El, Key>) {
    const [rendered, renderedSet] = createState<Map<Key, Item>>(new Map())
    const [exiting, exitingSet] = createState<Map<Key, Item>>(new Map())

    function update() {
        const eachMap = new Map<Key, Item>()
        const newRendered = new Map<Key, Item>(rendered.get())
        const newExiting = new Map<Key, Item>(exiting.get())

        for (const item of each.get()) {
            const k = id(item)
            eachMap.set(k, item)
            newRendered.set(k, item)
        }

        for (const [k, item] of newRendered) {
            if (!eachMap.has(k)) {
                newExiting.set(k, item)
            }
        }

        renderedSet(newRendered)
        exitingSet(newExiting)
    }

    // Reconcile on each() changes
    const unsub = each.subscribe(() => {
        update()
    })
    update()

    onCleanup(unsub)

    function removeItem(key: Key) {
        const cur = new Map(rendered.get())
        const exit = new Map(exiting.get())

        exit.delete(key)
        cur.delete(key)

        exitingSet(exit)
        renderedSet(cur)
    }

    // Render via your existing <For>, keyed by .key
    return <box
        orientation={orientation}>
        <For
            each={rendered}
            id={(pair) => pair[0]}>
            {(pair, idx) => {
                const [key, item] = pair
                const [revealed, revealedSet] = createState(false)

                return <revealer
                    $={(self) => {
                        timeout(200, () => {
                            revealedSet(true)
                        })

                        const isClosing = createComputed([
                            exiting
                        ], (ex) => {
                            return ex.has(key)
                        })

                        isClosing.subscribe(() => {
                            if (isClosing.get()) {
                                revealedSet(false)
                                timeout(300, () => {
                                    removeItem(key)
                                })
                            }
                        })
                    }}
                    revealChild={revealed}>
                    {children(item, idx)}
                </revealer>
            }}
        </For>
        <With value={rendered}>
            {(rendered) => {
                if (rendered.size === 0) {
                    return emptyState
                }
                return <box/>
            }}
        </With>
    </box>
}