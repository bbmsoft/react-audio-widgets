import { Button, ButtonGroup, Grid, Slider, TextField } from '@material-ui/core';
import React from 'react';
import { linearScale, logarithmicScale } from '../scales/scales';
import { formatFrequency, formatGain, formatQ } from '../scales/formatters'

function SliderEQ(props) {

    if (!props.eq) {
        return (
            <div>
                <ButtonGroup disableElevation variant="contained" >
                    <Button>No Bands</Button>
                </ButtonGroup>
                <div>
                    <EqSlider label="Frequency" value={""} sliderValue={0} />
                    <EqSlider label="Gain" value={""} sliderValue={0} />
                    <EqSlider label="Q" value={""} sliderValue={0} />
                </div>
            </div>
        );
    }

    const eq = { ...props.eq };

    const activeBand = eq.activeBand;

    const onInput = props.onInput || ((v, i) => { });

    const buttons = [];

    const onClick = i => {
        eq.activeBand = i;
        onInput(eq);
    }

    for (let i = 0; i < eq.bands.length; i++) {
        if (activeBand === i) {
            buttons.push(<Button key={i} color="primary" onClick={() => onClick(i)}>{`Band ${i + 1}`}</Button>);
        } else {
            buttons.push(<Button key={i} onClick={() => onClick(i)}>{`Band ${i + 1}`}</Button>);
        }
    }

    const sliderScale = linearScale(0, 1000);
    const frequencyScale = logarithmicScale(eq.minFreq, eq.maxFreq);
    const gainScale = linearScale(eq.minGain, eq.maxGain);
    const qScale = logarithmicScale(eq.minQ, eq.maxQ);

    const sliderFreqChange = (e, value) => {
        const val = sliderScale.convertTo(frequencyScale, value);
        eq.bands[activeBand].frequency = val;
        onInput(eq);
    }

    const sliderGainChange = (e, value) => {
        const val = sliderScale.convertTo(gainScale, value);
        eq.bands[activeBand].gain = val;
        onInput(eq);
    }

    const sliderQChange = (e, value) => {
        const val = sliderScale.convertTo(qScale, value);
        eq.bands[activeBand].q = val;
        onInput(eq);
    }

    const freqSliderValue = frequencyScale.convertTo(sliderScale, eq.bands[activeBand].frequency);
    const gainSliderValue = gainScale.convertTo(sliderScale, eq.bands[activeBand].gain);
    const qSliderValue = qScale.convertTo(sliderScale, eq.bands[activeBand].q);

    const frequencyLabel = formatFrequency(eq.bands[activeBand].frequency, true);
    const gainLabel = formatGain(eq.bands[activeBand].gain, true);
    const qLabel = formatQ(eq.bands[activeBand].q, true);

    return (
        <div>
            <ButtonGroup disableElevation variant="contained" >
                {buttons}
            </ButtonGroup>
            <div>
                <EqSlider label="Frequency" value={frequencyLabel} sliderValue={freqSliderValue} onChange={sliderFreqChange} />
                <EqSlider label="Gain" value={gainLabel} sliderValue={gainSliderValue} onChange={sliderGainChange} />
                <EqSlider label="Q" value={qLabel} sliderValue={qSliderValue} onChange={sliderQChange} />
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
                <TextField label={label} variant="outlined" value={value} />
            </Grid>
            <Grid item xs>
                <Slider min={0} max={1000} value={sliderValue} onChange={onChange} />
            </Grid>
        </Grid>
    );
}

export default SliderEQ;