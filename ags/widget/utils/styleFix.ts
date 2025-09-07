import {Gtk} from "ags/gtk4";
import {Accessor} from "ags";

/**
 * Make sure a revealer's children apply css properly when revealing.
 * Fixes bug when switching css themes where hidden content doesn't update after calling
 * App.apply_css.
 */
export function applyStyleChangeFix(
    revealer: Gtk.Revealer,
    revealed: Accessor<boolean>,
) {
    revealed.subscribe(() => {
        if (revealed.get()) {
            const content = revealer.child
            content.add_css_class("__restyle")
            content.remove_css_class("__restyle")
        }
    })
}