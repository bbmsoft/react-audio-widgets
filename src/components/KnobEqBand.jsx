import { Card } from '@material-ui/core';
import React from 'react';
import { formatFrequency, formatGain, formatQ } from '../scales/formatters';
import { clamped, linearScale, logarithmicScale, uiConverter } from '../scales/scales';
import LabelledCircularSlider from './LabelledCircularSlider';

function KnobEqBand(props) {

    const eq = { ...props.eq };

    const band = props.band;

    const onInput = props.onInput || (v => { });

    const min = 0;
    const max = 100;

    const knobScale = clamped(linearScale(min, max));
    const freqScale = clamped(logarithmicScale(eq.minFreq, eq.maxFreq));
    const gainScale = clamped(linearScale(eq.minGain, eq.maxGain));
    const qScale = clamped(logarithmicScale(eq.minQ, eq.maxQ));

    const frequency = eq.bands[band].frequency;
    const gain = eq.bands[band].gain;
    const q = eq.bands[band].q;

    const fconv = uiConverter(freqScale, knobScale);
    const gconv = uiConverter(gainScale, knobScale);
    const qconv = uiConverter(qScale, knobScale);

    const freqFormatter = v => formatFrequency(v, true);
    const gainFormatter = v => formatGain(v, true);
    const qFormatter = v => formatQ(v, true);

    const onFreqInput = v => {
        eq.bands[band].frequency = v;
        eq.activeBand = band;
        onInput(eq);
    };

    const onGainInput = v => {
        eq.bands[band].gain = v;
        eq.activeBand = band;
        onInput(eq);
    };

    const onQInput = v => {
        eq.bands[band].q = v;
        eq.activeBand = band;
        onInput(eq);
    };

    return (
        <Card style={{ display: "inline-block", padding: "1em", margin: "1em" }}>
            <LabelledCircularSlider min={min} max={max} label="Frequency" value={frequency} converter={fconv} formatter={freqFormatter} onInput={onFreqInput} />
            <LabelledCircularSlider min={min} max={max} label="Gain" value={gain} converter={gconv} formatter={gainFormatter} onInput={onGainInput} />
            <LabelledCircularSlider min={min} max={max} label="Q" value={q} converter={qconv} formatter={qFormatter} onInput={onQInput} />
        </Card >
    );
}

export default KnobEqBand;