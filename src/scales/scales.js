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

    return {
        toRatio,
        toAbsolute,
        convertTo,
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

    return {
        toRatio,
        toAbsolute,
        convertTo,
    }
}