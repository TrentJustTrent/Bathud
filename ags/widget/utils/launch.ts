import GLib from "gi://GLib";

// Tiny safe single-quote for sh -c
const sq = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`;

export function launchApp(argv: string[]) {
    // 1) If uwsm exists: run as transient user unit
    if (GLib.find_program_in_path("uwsm")) {
        console.log("launching app with uwsm")
        const cmd = `uwsm app -t service -- ${argv.map(sq).join(" ")}`;
        GLib.spawn_command_line_async(cmd);
        return;
    }

    // 2) If Hyprland is around: let the compositor own it
    if (GLib.find_program_in_path("hyprctl")) {
        console.log("launching app with hyprctl")
        const cmdline = argv.map(sq).join(" ");
        GLib.spawn_command_line_async(`hyprctl dispatch exec ${sq(cmdline)}`);
        return;
    }

    // 3) Portable, fully detached: new session, no parent/tty
    console.log("launching app with sh")
    const cmdline = argv.map(sq).join(" ");
    GLib.spawn_command_line_async(`setsid sh -c "exec ${cmdline} >/dev/null 2>&1 &"`);
}