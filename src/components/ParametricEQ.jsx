import React, { useEffect } from 'react';
import { CanvasContext } from './Canvas';
import { linearScale, logarithmicScale } from '../scales/scales';
import { computeBandCurve } from './eqPlotter';
import { clamp } from './utils';

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

function findClosestBand(eq, x, y, xMin, xMax, yMin, yMax) {

    let closest = 0;
    let shortestDistance = 999999999;

    let frequencyScale = logarithmicScale(eq.minFreq, eq.maxFreq);
    let gainScale = linearScale(eq.minGain, eq.maxGain);
    let xScale = linearScale(xMin, xMax);
    let yScale = linearScale(yMin, yMax, true);

    for (let i = 0; i < eq.bands.length; i++) {
        const band = eq.bands[i];
        const bx = frequencyScale.convertTo(xScale, band.frequency);
        const by = gainScale.convertTo(yScale, band.gain);
        const dx = bx - (x - xMin);
        const dy = by - (y - yMin);
        const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (distance < shortestDistance) {
            shortestDistance = distance;
            closest = i;
        }
    }

    return closest;
}

function ParametricEQ(props) {

    const id = props.id;
    const eq = props.eq;

    const canvasContext = React.useContext(CanvasContext);

    if (!window.eqs) {
        window.eqs = new Map();
    }
    window.eqs[id] = eq;

    const x = props.x || 0;
    const y = props.y || 0;
    const width = props.width || 900;
    const height = props.height || 300;

    const xMin = x;
    const xMax = xMin + width;
    const yMin = y;
    const yMax = yMin + height;

    const maxBandCircleRadius = Math.min(Math.min(width, height) / 5, Math.max(width, height) / 20);
    const minBandCircleRadius = maxBandCircleRadius / 5;

    const frequencyScale = logarithmicScale(eq.minFreq, eq.maxFreq);
    const gainScale = linearScale(eq.minGain, eq.maxGain);
    const qScale = logarithmicScale(eq.minQ, eq.maxQ);
    const xScale = linearScale(xMin, xMax);
    const yScale = linearScale(yMin, yMax, true);
    const circleScale = linearScale(minBandCircleRadius, maxBandCircleRadius, true);

    useEffect(() => {

        if (!window.mouseUpHandlers) {
            window.mouseUpHandlers = new Map();
        }

        return () => {
            const mouseUpHandler = window.mouseUpHandlers[id];
            if (mouseUpHandler) {
                window.removeEventListener("mouseup", mouseUpHandler);
            }
        }
    }, []);

    useEffect(() => {

        if (canvasContext) {
            const { canvas } = canvasContext;
            const noop = (v, i) => { };
            const onUserInput = props.onUserInput || noop;

            const handleMouseMove = e => {

                const [lastX, lastY] = window.lastMousePosition;
                const { clientX, clientY } = e;

                const dx = clientX - lastX;
                const dy = clientY - lastY;

                window.lastMousePosition = [clientX, clientY];

                const eq = { ...window.eqs[id] };
                const band = eq.bands[eq.activeBand];

                const newFrequency = xScale.applyDeltaTo(frequencyScale, dx, band.frequency);
                const newGain = yScale.applyDeltaTo(gainScale, dy, band.gain);

                band.frequency = clamp(eq.minFreq, newFrequency, eq.maxFreq);
                band.gain = clamp(eq.minGain, newGain, eq.maxGain);

                onUserInput(eq);
            }

            const handleMouseDown = e => {
                const rect = canvas.getBoundingClientRect();
                const canvasX = rect.x;
                const canvasY = rect.y;
                const eq = { ...window.eqs[id] };
                const closestBand = findClosestBand(window.eqs[id], e.clientX - canvasX, e.clientY - canvasY, xMin, xMax, yMin, yMax);
                eq.activeBand = closestBand;
                onUserInput(eq);
                window.lastMousePosition = [e.clientX, e.clientY];
                window.addEventListener("mousemove", handleMouseMove);
            }

            const handleMouseUp = e => {
                window.removeEventListener("mousemove", handleMouseMove);
            }

            canvas.addEventListener("mousedown", handleMouseDown);

            const mouseUpHandler = window.mouseUpHandlers[id];
            if (mouseUpHandler) {
                window.removeEventListener("mouseup", mouseUpHandler);
            }
            window.mouseUpHandlers[id] = handleMouseUp;
            window.addEventListener("mouseup", handleMouseUp);
        }
    }, [canvasContext])

    if (canvasContext && eq) {

        const ctx = canvasContext.context;

        const minimal = props.minimal;

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


