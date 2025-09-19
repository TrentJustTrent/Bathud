import {Gtk} from "ags/gtk4"
import {variableConfig} from "../../config/config";
import {createBinding, createComputed, createState, For, Accessor} from "ags";
import {interval} from "ags/time";
import AstalNetwork from "gi://AstalNetwork?version=0.1";
import AstalIO from "gi://AstalIO?version=0.1";
import {fetchJson} from "../utils/networkRequest";

type Verse = {
    book: string | null;
    chapter: string| null;
    verse: string | null;
    text: string | null;
};

const [verse, verseSetter] = createState<Verse>({
    book: null,
    chapter: null,
    verse: null,
    text: null
});

let lastVerseUpdate = 0; // in milliseconds
let lastDay = 0;
const VERSE_UPDATE_INTERVAL = variableConfig.systemMenu.bible.refreshRate.asAccessor() * 60 * 1000; // 15 minutes

function updateVerse() {
    const now = Date.now();
    const date = new Date();
    const day = date.getDay();
    if (now - lastVerseUpdate < VERSE_UPDATE_INTERVAL && day != lastDay) {
        console.log("Verse update skipped — too soon");
        return;
    }

    lastVerseUpdate = now;
    lastDay = day;

    const url = "https://bible-api.com/data/kjv/random";

    console.log("Getting Bible verse...")

    fetchJson(url)
        .then((resp) => {
            const quote = resp.random_verse;
            const r_book = quote.book;
            const r_chapter = quote.chapter;
            const r_verse = quote.verse;
            const r_text = quote.text;

            verseSetter({
                r_book,
                r_chapter,
                r_verse,
                r_text
            });
        })
        .catch((error) => {
            logError(error);
        })
        .finally(() => {
            console.log("Verse done")
        })
}

let updateIntervalBinding: Accessor | null = null
let network = AstalNetwork.get_default()
let updateInterval: AstalIO.Time | null = null

function setupUpdateInterval() {
    if (updateIntervalBinding !== null) {
        return
    }

    updateIntervalBinding = createBinding(network, "connectivity")
    updateIntervalBinding.subscribe(() => {
        if (updateInterval !== null) {
            updateInterval.cancel()
            updateInterval = null
        }
        if (network.connectivity === AstalNetwork.Connectivity.FULL) {
            updateInterval = interval(VERSE_UPDATE_INTERVAL, () => {
                updateVerse()
            })
            return;
        }
    })

    if (network.connectivity === AstalNetwork.Connectivity.FULL) {
        updateInterval = interval(VERSE_UPDATE_INTERVAL, () => {
            updateVerse()
        })
        return;
    }
}

export default function() {
    setupUpdateInterval()

    const actual_verse = createComputed([
        verse
    ], (verse:Verse) => {
        return verse
    })

    return <box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={10}>
        <label
            cssClasses={["labelXL"]}
            label={`Verse of the day:`}/>
        <box
            halign={Gtk.Align.CENTER}
            spacing={30}
            orientation={Gtk.Orientation.HORIZONTAL}>
            <box
                orientation={Gtk.Orientation.VERTICAL}>
                <label
                    cssClasses={["labelLargeBold"]}
                    label={`${actual_verse?.book} ${actual_verse?.chapter}:${actual_verse?.verse}`}
                />
                <label
                    cssClasses={["labelSmall"]}
                    label={actual_verse?.text}/>
            </box>
        </box>
    </box>
}
