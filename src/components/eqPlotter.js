import { BandType } from './ParametricEQ';

const COEFFS = [
    [1.0, 0.0, 0.0, 0.0, 0.0, 0.0],
    [1.4142, 0.0, 0.0, 1.0, 0.0, 0.0],
    [1.0, 1.0, 0.0, 0.0, 1.0, 0.0],
    [1.8478, 0.7654, 0.0, 1.0, 1.0, 0.0],
    [1.0, 1.6180, 0.6180, 0.0, 1.0, 1.0],
    [1.3617, 1.3617, 0.0, 0.6180, 0.6180, 0.0],
    [1.4142, 1.4142, 0.0, 1.0, 1.0, 0.0],
];

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