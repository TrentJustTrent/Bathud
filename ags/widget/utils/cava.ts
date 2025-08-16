import {variableConfig} from "../../config/config";
import {Bar, selectedBar} from "../../config/bar";

import {WaveformPosition} from "../../config/schema/definitions/barWidgets";
import {Accessor, createComputed} from "ags";

export function getCavaFlipStartValue(vertical: boolean): Accessor<boolean> {
    return createComputed([
        selectedBar.asAccessor(),
        variableConfig.verticalBar.cava_waveform.position.asAccessor(),
        variableConfig.horizontalBar.cava_waveform.position.asAccessor(),
    ], (bar, vPosition, hPosition) => {
        if (vertical) {
            switch (vPosition) {
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
            switch (hPosition) {
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