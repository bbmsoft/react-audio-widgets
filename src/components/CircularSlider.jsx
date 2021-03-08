import React, { useRef } from 'react';
import { clamped, linearScale, uiConverter } from '../scales/scales';
import { useDragY } from './gestureHandler';
import * as uuid from 'uuid';


function CircularSlider(props) {

    const { value } = props;

    const min = props.min || 0;
    const max = props.max || 100;
    const radius = props.radius || 25;

    const onInput = props.onInput;

    const height = 2 * radius;
    const width = 2 * radius;
    const rectWidth = radius / 10;
    const rectHeight = radius / 1.8;
    const rectX = radius - rectWidth / 2;

    let valueScale = clamped(linearScale(min, max));
    let angleScale = linearScale(-135, 135);
    let angle = valueScale.convertTo(angleScale, value)

    const transform = `rotate(${angle} ${radius} ${radius})`;

    const ref = useRef(null);
    const id = useRef(uuid.v4());

    const fadeHeight = 400;
    const fadeScale = linearScale(0, fadeHeight, true);
    const converter = uiConverter(valueScale, fadeScale);
    useDragY(id.current, ref, value, onInput, converter);


    return (
        <svg height={height} width={width} ref={ref}>
            <defs>
                <radialGradient id="grad">
                    <stop offset="10%" stopColor="#555" />
                    <stop offset="95%" stopColor="#000" />
                </radialGradient>
            </defs>
            <circle cx={radius} cy={radius} r={radius} fill="url('#grad')" />
            <rect x={rectX} y={0} width={rectWidth} height={rectHeight} transform={transform} fill="white" />
        </svg>
    );
}

export default CircularSlider;
