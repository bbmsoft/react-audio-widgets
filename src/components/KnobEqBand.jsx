import { Card } from '@material-ui/core';
import React from 'react';
import { formatFrequency, formatGain, formatQ } from '../scales/formatters';
import { clamped, linearScale, logarithmicScale, uiConverter } from '../scales/scales';
import LabelledCircularSlider from './LabelledCircularSlider';

function KnobEqBand(props) {

    const { band, eq, id } = props;

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
        const newEq = { ...eq };
        newEq.bands[band].frequency = v;
        newEq.activeBand = band;
        onInput(newEq);
    };

    const onGainInput = v => {
        const newEq = { ...eq };
        newEq.bands[band].gain = v;
        newEq.activeBand = band;
        onInput(newEq);
    };

    const onQInput = v => {
        const newEq = { ...eq };
        newEq.bands[band].q = q;
        newEq.activeBand = band;
        onInput(newEq);
    };

    return (
        <Card style={{ display: "inline-block", padding: "1em", margin: "1em" }}>
            <LabelledCircularSlider id={`${id}-freq`} min={min} max={max} label="Frequency" value={frequency} converter={fconv} formatter={freqFormatter} onInput={onFreqInput} />
            <LabelledCircularSlider id={`${id}-gain`} min={min} max={max} label="Gain" value={gain} converter={gconv} formatter={gainFormatter} onInput={onGainInput} />
            <LabelledCircularSlider id={`${id}-q`} min={min} max={max} label="Q" value={q} converter={qconv} formatter={qFormatter} onInput={onQInput} />
        </Card >
    );
}

export default KnobEqBand;