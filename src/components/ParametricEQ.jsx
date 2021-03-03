import React, { useContext } from 'react';
import { CanvasContext } from './Canvas';
import { linearScale, logarithmicScale } from '../scales/scales';
import { computeBandCurve } from './eqPlotter';
import { EqContext } from './EQ';

export const BandType = {
    BELL: 0,
    LOW_SHELF: 1,
    HIGH_SHELF: 2,
    LOW_PASS: 3,
    HIGH_PASS: 4,
}

function newArray(from, to) {
    const array = [];
    for (let i = from; i < to; i++) {
        array.push(i);
    }
    return array;
}

function drawBandCurve(ctx, xs, ys, xMin, xMax, yMin, yMax) {

    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
        let x = xs[i];
        let y = ys[i];
        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function ParametricEQ(props) {

    const eq = useContext(EqContext);
    const ctx = React.useContext(CanvasContext);

    if (ctx && eq) {
        const x = props.x;
        const y = props.y;
        const width = props.width || 900;
        const height = props.height || 300;

        const xMin = x;
        const xMax = x + width;
        const yMin = y;
        const yMax = y + height;

        const frequencyScale = logarithmicScale(eq.minFreq, eq.maxFreq);
        const gainScale = linearScale(eq.minGain, eq.maxGain);
        const xScale = linearScale(xMin, xMax);
        const yScale = linearScale(yMin, yMax, true);

        // const y0 = gainScale.convertTo(yScale, 0);

        const xs = newArray(xMin, xMax);
        const frequencies = xs.map(x => xScale.convertTo(frequencyScale, x));


        ctx.clearRect(x, y, x + width, y + height);

        eq.bands.forEach(b => {
            const gains = computeBandCurve(b, frequencies);
            console.log(gains);
            const ys = gains.map(g => gainScale.convertTo(yScale, g));
            drawBandCurve(ctx, xs, ys, xMin, xMax, yMin, yMax);
        });
    }

    return null;
}

export default ParametricEQ;


