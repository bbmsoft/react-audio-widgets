import { CanvasContext } from './Canvas';
import { clamped, linearScale, logarithmicScale, uiConverter } from '../scales/scales';
import * as eqtils from './eqtils';
import { useDragXY, useMouseDown } from './gestureHandler';
import { useContext } from 'react';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEQ(props) {

    const canvasContext = useContext(CanvasContext);

    const eq = { ...props.eq };
    const onInput = props.onInput;
    const x = props.x || 0;
    const y = props.y || 0;
    const width = props.width || 900;
    const height = props.height || 300;
    const minimal = props.minimal;

    const xMin = x;
    const xMax = xMin + width;
    const yMin = y;
    const yMax = yMin + height;

    const frequencyScale = clamped(logarithmicScale(eq.minFreq, eq.maxFreq));
    const gainScale = clamped(linearScale(eq.minGain, eq.maxGain));
    const xScale = linearScale(xMin, xMax);
    const yScale = linearScale(yMin, yMax, true);

    const xConverter = uiConverter(frequencyScale, xScale);
    const yConverter = uiConverter(gainScale, yScale);

    const activeBand = eq.activeBand;
    const band = eq.bands[activeBand];
    const freq = band ? band.frequency : eq.minFreq;
    const gain = band ? band.gain : eq.minGain;
    const bounds = { xMin, yMin, xMax, yMax };

    const onMouseDown = (x, y) => {
        const band = eqtils.findClosestBand(eq, x, y, xMin, xMax, yMin, yMax);
        eq.activeBand = band;
        onInput(eq);
    };
    useMouseDown(canvasContext.canvasRef, onMouseDown, bounds);

    const onDrag = (newFrequency, newGain) => {
        let band = eq.bands[eq.activeBand];
        if (band) {
            band.frequency = newFrequency;
            band.gain = newGain;
            onInput(eq);
        }
    };
    useDragXY(canvasContext.canvasRef, [freq, gain], onDrag, [xConverter, yConverter], bounds);

    if (canvasContext.context) {
        const ctx = canvasContext.context;
        const style = { background, bandStroke, sumStroke };
        eqtils.renderEq(eq, ctx, x, y, width, height, minimal, style);
    }

    return null;
}

export default ParametricEQ;
