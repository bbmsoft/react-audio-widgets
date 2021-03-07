import React from 'react';
import CircularSlider from './CircularSlider';
import { noopScaleConverter } from '../scales/scales';

function LabelledCircularSlider(props) {

    const { id, min, max, value, radius, onInput, label } = props;
    const converter = props.converter || noopScaleConverter();
    const formatter = props.formatter || (v => v);
    const formatted = formatter(value);
    const val = converter.toUiCoordinates(value);

    const onRangedInput = v => onInput(converter.toValue(v));

    return (
        <div style={{ display: "inline-block" }}>
            <div>{label}</div>
            <div><CircularSlider id={id} min={min} max={max} value={val} radius={radius} onInput={onRangedInput} /></div>
            <div><input type="text" value={formatted} readOnly style={{ width: "6em" }} /></div>
        </div >
    );
}

export default LabelledCircularSlider;