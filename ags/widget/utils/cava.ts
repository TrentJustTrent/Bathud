import {config, selectedBar} from "../../config/config";
import {Bar} from "../../config/bar";
import {Binding} from "astal";

import {WaveformPosition} from "../../config/schema/definitions/barWidgets";

export function getCavaFlipStartValue(vertical: boolean): Binding<boolean> {
    return selectedBar().as((bar): boolean => {
        if (vertical) {
            switch (config.verticalBar.cava_waveform.position) {
                case WaveformPosition.START:
                    return true
                case WaveformPosition.END:
                    return false
                case WaveformPosition.OUTER:
                    return bar === Bar.LEFT
                case WaveformPosition.INNER:
                    return bar !== Bar.LEFT
            }
        } else {
            switch (config.horizontalBar.cava_waveform.position) {
                case WaveformPosition.START:
                    return true
                case WaveformPosition.END:
                    return false
                case WaveformPosition.OUTER:
                    return bar === Bar.TOP
                case WaveformPosition.INNER:
                    return bar !== Bar.TOP
            }
        }
    })
}