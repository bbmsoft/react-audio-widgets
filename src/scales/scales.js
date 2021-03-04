export function linearScale(min, max, inverted) {

    const range = (max - min);

    const toRatio = a => {
        const r = (a - min) / range;
        if (inverted) {
            return 1.0 - r;
        } else {
            return r;
        }
    };

    const toAbsolute = r => {
        if (inverted) {
            return min + (1.0 - r) * range;
        } else {
            return min + r * range;
        }
    };

    const convertTo = (otherScale, a) => {
        const ratio = toRatio(a);
        return otherScale.toAbsolute(ratio);
    }

    const applyDeltaTo = (otherScale, delta, otherCurrent) => {
        const currentRatio = otherScale.toRatio(otherCurrent);
        const currentAbs = toAbsolute(currentRatio);
        const newAbs = currentAbs + delta;
        const newRatio = toRatio(newAbs);
        return otherScale.toAbsolute(newRatio);
    }

    return {
        toRatio,
        toAbsolute,
        convertTo,
        applyDeltaTo
    }
}

export function logarithmicScale(min, max, inverted) {

    const logMin = Math.log10(min);
    const logMax = Math.log10(max);
    const logRange = (logMax - logMin);

    const toRatio = a => {
        const logAbs = Math.log10(a);
        const r = (logAbs - logMin) / logRange;
        if (inverted) {
            return 1.0 - r;
        } else {
            return r;
        }
    };

    const toAbsolute = r => {
        if (inverted) {
            const logAbs = logMin + (1.0 - r) * logRange;
            return Math.pow(10, logAbs);
        } else {
            const logAbs = logMin + r * logRange;
            return Math.pow(10, logAbs);
        }
    };

    const convertTo = (otherScale, a) => {
        const ratio = toRatio(a);
        return otherScale.toAbsolute(ratio);
    }

    const applyDeltaTo = (otherScale, delta, otherCurrent) => {
        const currentRatio = otherScale.toRatio(otherCurrent);
        const currentAbs = toAbsolute(currentRatio);
        const newAbs = currentAbs + delta;
        const newRatio = toRatio(newAbs);
        return otherScale.toAbsolute(newRatio);
    }

    return {
        toRatio,
        toAbsolute,
        convertTo,
        applyDeltaTo
    }
}

export function noopScale() {
    return {
        toRatio: v => v,
        toAbsolute: v => v,
        convertTo: (other, v) => v,
        applyDeltaTo: (other, d, c) => c + d,
    }
}

export function scaleConverter(external, internal) {
    return {
        toInternal: v => external.convertTo(internal, v),
        toExternal: v => internal.convertTo(external, v),
    }
}

export function noopScaleConverter() {
    return {
        toInternal: v => v,
        toExternal: v => v,
    }
}