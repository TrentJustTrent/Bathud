import {config, selectedBar} from "../../config/config";
import {HorizontalWaveformPosition, VerticalWaveformPosition} from "../../config/configSchema";
import {Bar} from "../../config/bar";
import {Binding} from "astal";

export function getCavaFlipStartValue(vertical: boolean): Binding<boolean> {
    return selectedBar().as((bar): boolean => {
        if (vertical) {
            switch (config.verticalBar.cavaWaveformPosition) {
                case VerticalWaveformPosition.LEFT:
                    return true
                case VerticalWaveformPosition.RIGHT:
                    return false
                case VerticalWaveformPosition.OUTER:
                    return bar === Bar.LEFT
                case VerticalWaveformPosition.INNER:
                    return bar !== Bar.LEFT
            }
        } else {
            switch (config.horizontalBar.cavaWaveformPosition) {
                case HorizontalWaveformPosition.TOP:
                    return true
                case HorizontalWaveformPosition.BOTTOM:
                    return false
                case HorizontalWaveformPosition.OUTER:
                    return bar === Bar.TOP
                case HorizontalWaveformPosition.INNER:
                    return bar !== Bar.TOP
            }
        }
    })
}