import React, { useContext } from 'react';
import { CanvasContext } from './Canvas';
import { linearScale, logarithmicScale } from '../scales/scales';
import { computeBandCurve } from './eqPlotter';
import { EqContext } from './EQ';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

export const BandType = {
    BELL: 0,
    LOW_SHELF: 1,
    HIGH_SHELF: 2,
    LOW_PASS: 3,
    HIGH_PASS: 4,
}

function range(from, to) {
    const array = [];
    for (let i = from; i < to; i++) {
        array.push(i);
    }
    return array;
}

function add(a, b) {
    if (!a) {
        return b;
    }
    if (!b) {
        return a;
    }
    const output = [];
    for (let i = 0; i < a.length; i++) {
        output.push(a[i] + b[i]);
    }
    return output;
}

function drawBandCurve(ctx, xs, ys) {

    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
        let x = xs[i];
        let y = ys[i];
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = bandStroke;
    ctx.stroke();
}

function drawBandCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = bandStroke;
    ctx.fill();
}

function drawSum(ctx, xs, ys, y0) {

    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
        let x = xs[i];
        let y = ys[i];
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = sumStroke;
    ctx.stroke();

    ctx.lineTo(xs[xs.length - 1], y0);
    ctx.lineTo(xs[0], y0);
    ctx.closePath();

    ctx.fillStyle = bandStroke;
    ctx.fill();
}

function ParametricEQ(props) {

    const eq = useContext(EqContext);
    const ctx = React.useContext(CanvasContext);

    if (ctx && eq) {

        const x = props.x || 0;
        const y = props.y || 0;
        const width = props.width || 900;
        const height = props.height || 300;

        const xMin = x;
        const xMax = xMin + width;
        const yMin = y;
        const yMax = yMin + height;

        const minimal = props.minimal;

        const maxBandCircleRadius = Math.min(Math.min(width, height) / 5, Math.max(width, height) / 20);
        const minBandCircleRadius = maxBandCircleRadius / 5;

        const frequencyScale = logarithmicScale(eq.minFreq, eq.maxFreq);
        const gainScale = linearScale(eq.minGain, eq.maxGain);
        const qScale = logarithmicScale(eq.minQ, eq.maxQ);
        const xScale = linearScale(xMin, xMax);
        const yScale = linearScale(yMin, yMax, true);
        const circleScale = linearScale(minBandCircleRadius, maxBandCircleRadius, true);

        const y0 = gainScale.convertTo(yScale, 0);

        const xs = range(xMin, xMax);
        const frequencies = xs.map(x => xScale.convertTo(frequencyScale, x));

        let sum;

        ctx.clearRect(xMin, yMin, xMax, yMax);
        ctx.fillStyle = background;
        ctx.fillRect(xMin, yMin, xMax, yMax);

        eq.bands.forEach(b => {
            const gains = computeBandCurve(b, frequencies);
            sum = add(sum, gains);
            if (!minimal) {
                const ys = gains.map(g => gainScale.convertTo(yScale, g));
                drawBandCurve(ctx, xs, ys);
                const radius = qScale.convertTo(circleScale, b.q);
                const bx = frequencyScale.convertTo(xScale, b.frequency);
                const by = gainScale.convertTo(yScale, b.gain);
                drawBandCircle(ctx, bx, by, radius);
            }
        });

        const ys = sum.map(g => gainScale.convertTo(yScale, g));
        drawSum(ctx, xs, ys, y0);
    }

    return null;
}

export default ParametricEQ;


