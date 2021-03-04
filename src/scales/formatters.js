export function formatGain(val, withUnit) {
    const digits = Math.round(Math.abs(val) * 10) >= 100 ? 0 : 1;
    return formatGainWithDigits(val, digits, withUnit);
}

export function formatFrequency(val, withUnit) {
    let digits;
    if (val < 99.95) {
        digits = 1;
    } else if (val < 999.5) {
        digits = 0;
    } else if (val <= 9995.0) {
        digits = 2;
    } else {
        digits = 1;
    };
    return formatFrequencyWithDigits(val, digits, withUnit);
}

export function formatQ(val) {
    const rounded = Math.round(val);
    return `${rounded}`;
}


function formatFrequencyWithDigits(val, digits, withUnit) {
    const kilo = val >= 999.5;
    const unit = kilo ? "kHz" : "Hz";
    const value = kilo ? val / 1000.0 : val;

    return withUnit ? `${value.toFixed(digits)} ${unit}` : value.toFixed(digits);
}

function formatGainWithDigits(val, digits, withUnit) {
    const abs = Math.abs(val);

    let sign;

    if (Math.round(abs * 10.0) === 0.0) {
        sign = "";
    } else if (val < 0.0) {
        sign = "-";
    } else {
        sign = "+";
    };

    return withUnit ? `${sign}${abs.toFixed(digits)} dB` : `${sign}${abs.toFixed(digits)}`;
}