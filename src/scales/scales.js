
export function clamped(scale) {
    const { min, max, toRatio, toAbsolute } = scale;

    return {
        ...scale,
        toRatio: v => clampedToRatio(v, toRatio),
        toAbsolute: r => clampedToAbsolute(r, min, max, toAbsolute),
    }
}

function clampedToRatio(value, toRatio) {
    return Math.max(0.0, Math.min(toRatio(value), 1.0));
}

function clampedToAbsolute(ratio, min, max, toAbsolute) {
    return Math.max(min, Math.min(toAbsolute(ratio), max));
}

function convertScaleTo(otherScale, a, toRatio) {
    const ratio = toRatio(a);
    return otherScale.toAbsolute(ratio);
}

function applyDeltaToScale(otherScale, delta, otherCurrent, toAbsolute, toRatio) {
    const currentRatio = otherScale.toRatio(otherCurrent);
    const currentAbs = toAbsolute(currentRatio);
    const newAbs = currentAbs + delta;
    const newRatio = toRatio(newAbs);
    return otherScale.toAbsolute(newRatio);
}

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
        return convertScaleTo(otherScale, a, toRatio);
    }

    const applyDeltaTo = (otherScale, delta, otherCurrent) => {
        return applyDeltaToScale(otherScale, delta, otherCurrent, toAbsolute, toRatio);
    }

    return {
        min,
        max,
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
        return convertScaleTo(otherScale, a, toRatio);
    }

    const applyDeltaTo = (otherScale, delta, otherCurrent) => {
        return applyDeltaToScale(otherScale, delta, otherCurrent, toAbsolute, toRatio);
    }

    return {
        min,
        max,
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

export function uiConverter(valueScale, uiScale) {
    return {
        toValue: v => uiScale.convertTo(valueScale, v),
        toUiCoordinate: v => valueScale.convertTo(uiScale, v),
    }
}

export function noopScaleConverter() {
    return {
        toInternal: v => v,
        toExternal: v => v,
    }
}