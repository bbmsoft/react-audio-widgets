import { Button, ButtonGroup, Grid, Slider, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { EqContext } from './EQ';
import { linearScale, logarithmicScale } from '../scales/scales';

function SliderEQ(props) {

    const initActiveBand = props.activeBand || 0;

    const eq = useContext(EqContext);
    const [activeBand, setActiveBand] = useState(initActiveBand);

    const buttons = [];
    for (let i = 0; i < eq.bands.length; i++) {
        if (activeBand === i) {
            buttons.push(<Button key={i} color="primary" onClick={() => setActiveBand(i)}>{`Band ${i + 1}`}</Button>);
        } else {
            buttons.push(<Button key={i} onClick={() => setActiveBand(i)}>{`Band ${i + 1}`}</Button>);
        }
    }

    const noop = (v, i) => { };
    const onFrequencyChange = props.onFrequencyChange || noop;
    const onGainChange = props.onGainChange || noop;
    const onQChange = props.onQChange || noop;

    const sliderScale = linearScale(0, 100);
    const frequencyScale = logarithmicScale(eq.minFreq, eq.maxFreq);
    const gainScale = linearScale(eq.minGain, eq.maxGain);
    const qScale = logarithmicScale(eq.minQ, eq.maxQ);

    const sliderFreqChange = (e, value) => {
        const val = sliderScale.convertTo(frequencyScale, value);
        onFrequencyChange(val, activeBand);
    }

    const sliderGainChange = (e, value) => {
        const val = sliderScale.convertTo(gainScale, value);
        onGainChange(val, activeBand);
    }

    const sliderQChange = (e, value) => {
        const val = sliderScale.convertTo(qScale, value);
        onQChange(val, activeBand);
    }

    const freqSliderValue = frequencyScale.convertTo(sliderScale, eq.bands[activeBand].frequency);
    const gainSliderValue = gainScale.convertTo(sliderScale, eq.bands[activeBand].gain);
    const qSliderValue = qScale.convertTo(sliderScale, eq.bands[activeBand].q);

    return (
        <div>
            <ButtonGroup disableElevation variant="contained" >
                {buttons}
            </ButtonGroup>
            <div>
                <EqSlider label="Frequency" value={eq.bands[activeBand].frequency} sliderValue={freqSliderValue} onChange={sliderFreqChange} />
                <EqSlider label="Gain" value={eq.bands[activeBand].gain} sliderValue={gainSliderValue} onChange={sliderGainChange} />
                <EqSlider label="Q" value={eq.bands[activeBand].q} sliderValue={qSliderValue} onChange={sliderQChange} />
            </div>

        </div>
    );
}

function EqSlider(props) {

    const label = props.label;
    const sliderValue = props.sliderValue;
    const onChange = props.onChange;
    const value = props.value;

    return (
        <Grid container spacing={2}>
            <Grid item>
                <TextField id="outlined-basic" label={label} variant="outlined" value={value} />
            </Grid>
            <Grid item xs>
                <Slider min={0} max={100} value={sliderValue} onChange={onChange} />
            </Grid>
        </Grid>
    );
}

export default SliderEQ;