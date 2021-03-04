import React, { useEffect, useRef } from 'react';
import { linearScale } from '../scales/scales';
import { clamp } from './utils';

function CircularSlider(props) {

    const { id, min, max, value, radius } = props;

    if (!window.circSliders) {
        window.circSliders = new Map();
    }

    window.circSliders[id] = value;

    const noop = () => { };
    const onInput = props.onInput || noop;

    const height = 2 * radius;
    const width = 2 * radius;
    const rectWidth = radius / 10;
    const rectHeight = radius / 1.8;
    const rectX = radius - rectWidth / 2;

    let valueScale = linearScale(min, max);
    let angleScale = linearScale(-135, 135);
    let angle = valueScale.convertTo(angleScale, value)

    const transform = `rotate(${angle} ${radius} ${radius})`;

    const ref = useRef(null);

    useEffect(() => {

        const svg = ref.current;

        const fadeHeight = 400;
        const fadeScale = linearScale(0, fadeHeight, true);

        const onMouseMove = e => {
            const { clientX, clientY } = e;
            const [lastX, lastY] = window.lastMousePosition;

            const dx = clientX - lastX;
            const dy = clientY - lastY;

            const newVal = fadeScale.applyDeltaTo(valueScale, dy, window.circSliders[id]);
            onInput(clamp(min, newVal, max));

            console.log(dx, dy);

            window.lastMousePosition = [clientX, clientY];
            e.preventDefault();
        };
        const onMouseDown = e => {
            const { clientX, clientY } = e;
            window.lastMousePosition = [clientX, clientY];
            window.addEventListener("mousemove", onMouseMove);
            e.preventDefault();
        }
        const onMouseUp = e => {
            window.removeEventListener("mousemove", onMouseMove);
            e.preventDefault();
        };

        window.addEventListener("mouseup", onMouseUp);
        svg.addEventListener("mousedown", onMouseDown);

        return () => {
            svg.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
        }
    }, []);

    return (
        <svg height={height} width={width} ref={ref}>
            <defs>
                <radialGradient id="grad">
                    <stop offset="10%" stop-color="#555" />
                    <stop offset="95%" stop-color="#000" />
                </radialGradient>
            </defs>
            <circle cx={radius} cy={radius} r={radius} fill="url('#grad')" />
            <rect x={rectX} y={0} width={rectWidth} height={rectHeight} transform={transform} fill="white" />
        </svg>
    );
}

export default CircularSlider;