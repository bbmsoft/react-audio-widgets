import { linearScale, logarithmicScale } from "../../scales/scales";
import { formatFrequency, formatGain, formatQ } from '../../scales/formatters';

export const BandType = {
    BELL: 0,
    LOW_SHELF: 1,
    HIGH_SHELF: 2,
    LOW_PASS: 3,
    HIGH_PASS: 4,
}

// const COEFFS = [
//     [1.0, 0.0, 0.0, 0.0, 0.0, 0.0],
//     [1.4142, 0.0, 0.0, 1.0, 0.0, 0.0],
//     [1.0, 1.0, 0.0, 0.0, 1.0, 0.0],
//     [1.8478, 0.7654, 0.0, 1.0, 1.0, 0.0],
//     [1.0, 1.6180, 0.6180, 0.0, 1.0, 1.0],
//     [1.3617, 1.3617, 0.0, 0.6180, 0.6180, 0.0],
//     [1.4142, 1.4142, 0.0, 1.0, 1.0, 0.0],
// ];

export function computeBandCurve(band, frequencies) {
    switch (band.type) {
        case BandType.BELL:
            return computeBellCurve(band, frequencies);
        case BandType.LOW_SHELF:
            return computeLowShelfCurve(band, frequencies);
        case BandType.HIGH_SHELF:
            return computeHighShelfCurve(band, frequencies);
        case BandType.LOW_PASS:
            return computeLowPassCurve(band, frequencies);
        case BandType.HIGH_PASS:
            return computeHighPassCurve(band, frequencies);
        default:
            return frequencies.map(f => 0);
    }
}

function computeBellCurve(band, frequencies) {
    return frequencies.map(f => computeBellGain(band, f));
}

function computeHighShelfCurve(band, frequencies) {
    return frequencies.map(f => computeHighShelfGain(band, f));
}

function computeLowShelfCurve(band, frequencies) {
    return frequencies.map(f => computeLowShelfGain(band, f));
}

function computeHighPassCurve(band, frequencies) {
    return frequencies.map(f => computeHighPassGain(band, f));
}

function computeLowPassCurve(band, frequencies) {
    return frequencies.map(f => computeLowPassGain(band, f));
}

function computeBellGain(band, f) {

    const p = toPower(band.gain);
    const pr = toPr(p);

    const f0 = band.frequency / f;
    const f1 = Math.pow(f0, 2);
    const f2 = Math.pow((1.0 - f1), 2);
    const q2 = Math.pow((1.0 / band.q), 2);

    const n = Math.pow(f2, 2) + Math.pow((q2 * pr * f1), 2) + (f2 * f1 * Math.pow(pr, 2) * q2) + (f2 * f1 * q2);
    const d = Math.pow((f2 + q2 * f1), 2);

    let pOut;
    if (p >= 1.0) {
        pOut = Math.sqrt(n / d);
    } else {
        pOut = Math.sqrt(d / n);
    };

    return toDecibel(pOut);
}

function computeHighShelfGain(band, f) {
    // TODO
    return 0;
}

function computeLowShelfGain(band, f) {
    // TODO
    return 0;
}

function computeHighPassGain(band, f) {
    // TODO
    return 0;
}

function computeLowPassGain(band, f) {
    // TODO
    return 0;
}

function toPower(gain) {
    return Math.pow(10.0, gain / 20.0);
}

function toPr(power) {
    if (power >= 1.0) {
        return power;
    } else {
        return 1.0 / power;
    }
}

function toDecibel(power) {
    return 20.0 * Math.log10(power);
}

export function renderEq(eq, ctx, bounds, minimal, style) {

    const ratio = Math.ceil(window.devicePixelRatio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const { x, y, width, height } = bounds;

    ctx.save();
    let clip = new Path2D();
    clip.rect(x, y, width, height);
    ctx.clip(clip);
    ctx.clearRect(x, y, width, height);

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

    const y0 = gainScale.convertTo(yScale, 0);

    const xs = range(xMin, xMax);
    const frequencies = xs.map(x => xScale.convertTo(frequencyScale, x));

    let sum;

    eq.bands.forEach(b => {
        const gains = computeBandCurve(b, frequencies);
        sum = add(sum, gains);
        if (!minimal) {
            const ys = gains.map(g => gainScale.convertTo(yScale, g));
            drawBandCurve(ctx, xs, ys, style.bandStroke);
            const radius = qScale.convertTo(circleScale, b.q);
            const bx = frequencyScale.convertTo(xScale, b.frequency);
            const by = gainScale.convertTo(yScale, b.gain);
            drawBandCircle(ctx, bx, by, radius, style.bandStroke);
        }
    });

    const ys = sum?.map(g => gainScale.convertTo(yScale, g)) || [];
    drawSum(ctx, xs, ys, y0, style.sumStroke, style.bandStroke);

    ctx.restore();
}

export function tooltip(tooltipRef, eq, bounds) {

    const { x, y, width, height } = bounds;
    const tooltip = tooltipRef.current;

    const xMin = x;
    const xMax = x + width;
    const yMin = y;
    const yMax = y + height;
    const maxBandCircleRadius = Math.min(Math.min(width, height) / 5, Math.max(width, height) / 20);
    const frequencyScale = logarithmicScale(eq.minFreq, eq.maxFreq);
    const gainScale = linearScale(eq.minGain, eq.maxGain);
    const xScale = linearScale(xMin, xMax);
    const yScale = linearScale(yMin, yMax, true);

    const activeBand = eq.activeBand;
    const band = eq.bands[activeBand];
    const freq = band ? band.frequency : eq.minFreq;
    const gain = band ? band.gain : eq.minGain;
    const q = band ? band.q : eq.minQ;

    const tooltipBounds = tooltip?.getBoundingClientRect();
    const tooltipWidth = tooltipBounds ? tooltipBounds.width : 0;
    const tooltipHeight = tooltipBounds ? tooltipBounds.height : 0;

    const tooltipRawY = gainScale.convertTo(yScale, gain) - tooltipHeight - (maxBandCircleRadius / 2);
    const tooltipY = Math.min(Math.max(8, tooltipRawY), document.body.clientHeight - 8);
    const yOffset = Math.min(2 * (tooltipY - tooltipRawY), (tooltipWidth + maxBandCircleRadius) / 2);
    const tooltipRawX = frequencyScale.convertTo(xScale, freq) - tooltipWidth / 2;
    const tooltipX = Math.min(Math.max(8, tooltipRawX - yOffset), document.body.clientWidth - 8);

    const keyStyle = {
        fontWeight: "bold",
        textAlign: "left",
        paddingRight: "0.5em"
    }
    const valueStyle = {
        textAlign: "right"
    }
    const unitStyle = {
        textAlign: "left"
    }

    const freqLabel = formatFrequency(freq, false);
    const gainLabel = formatGain(gain, false);
    const qLabel = formatQ(q);

    const freqUnit = freq >= 999.5 ? "kHz" : "Hz";
    const gainUnit = "dB";
    const qUnit = "";

    return {
        tooltipX,
        tooltipY,
        tooltipContent: (<>
            <table>
                <tbody>
                    <tr><td style={keyStyle}>Freq:</td><td style={valueStyle}>{freqLabel}</td><td style={unitStyle}>{freqUnit}</td></tr>
                    <tr><td style={keyStyle}>Gain:</td><td style={valueStyle}>{gainLabel}</td><td style={unitStyle}>{gainUnit}</td></tr>
                    <tr><td style={keyStyle}>Q:</td><td style={valueStyle}>{qLabel}</td><td style={unitStyle}>{qUnit}</td></tr>
                </tbody>
            </table>
        </>)
    }
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

function drawBandCurve(ctx, xs, ys, stroke) {

    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
        let x = xs[i];
        let y = ys[i];
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = stroke;
    ctx.stroke();
}

function drawBandCircle(ctx, x, y, radius, fill) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = fill;
    ctx.fill();
}

function drawSum(ctx, xs, ys, y0, stroke, fill) {

    ctx.beginPath();
    ctx.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
        let x = xs[i];
        let y = ys[i];
        ctx.lineTo(x, y);
    }
    ctx.strokeStyle = stroke;
    ctx.stroke();

    ctx.lineTo(xs[xs.length - 1], y0);
    ctx.lineTo(xs[0], y0);
    ctx.closePath();

    ctx.fillStyle = fill;
    ctx.fill();
}

export function findClosestBand(eq, x, y, xMin, xMax, yMin, yMax) {

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

export function majorFrequencyTickMarks(eq) {

    const min = eq.minFreq;
    const minExp = Math.ceil(Math.log10(min));

    const max = eq.maxFreq;
    const maxExp = Math.ceil(Math.log10(max));

    const output = [];

    for (let exp = minExp; exp < maxExp; exp++) {
        output.push(Math.pow(10, exp));
    }

    return output;
}

export function minorFrequencyTickMarks(eq) {

    const min = eq.minFreq;
    const minExp = Math.floor(Math.log10(min));

    const max = eq.maxFreq;
    const maxExp = Math.ceil(Math.log10(max));

    const output = [];

    for (let exp = minExp; exp < maxExp; exp++) {
        for (let multiplier = 1; multiplier < 10; multiplier++) {
            const tick = multiplier * Math.pow(10, exp);
            if (eq.minFreq < tick && tick < eq.maxFreq) {
                output.push(tick);
            }
        }
    }

    return output;
}


export function majorGainTickMarks(eq) {

    const max = eq.maxGain;

    const output = [];

    for (let tick = 0; tick < max; tick += 6) {
        output.push(tick);
        if (tick !== -tick) {
            output.push(-tick);
        }
    }

    return output;
}

export function minorGainTickMarks(eq) {

    const max = eq.maxGain;

    const output = [];

    for (let tick = 3; tick < max; tick += 6) {
        output.push(tick);
        if (tick !== -tick) {
            output.push(-tick);
        }
    }

    return output;
}
