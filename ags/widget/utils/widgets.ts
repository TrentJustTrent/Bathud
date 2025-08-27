import {Gtk} from "ags/gtk4";

export function orderChildrenLTR(box: Gtk.Box, order: Array<Gtk.Widget>) {
    const widgets = order.filter(Boolean) as Gtk.Widget[];
    if (!widgets.length) return;

    // Put the first at the very start
    box.reorder_child_after(widgets[0], null);

    // Chain each next widget after the previous one
    for (let i = 1; i < widgets.length; i++) {
        box.reorder_child_after(widgets[i], widgets[i - 1]);
    }
}

export function appendChildren(box: Gtk.Box, order: Array<Gtk.Widget>) {
    order.forEach((widget) => {
        box.append(widget)
    })
}

export function removeAllChildren(box: Gtk.Box) {
    let child = box.get_first_child();
    while (child) {
        const next = child.get_next_sibling();
        box.remove(child);
        child = next;
    }
}