import { CanvasContext } from './Canvas';
import { clamped, linearScale, logarithmicScale, uiConverter } from '../scales/scales';
import * as eqtils from './eqtils';
import { useOnDragXY, useOnMouseDown } from './gestureHandler';
import { useContext } from 'react';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEQ(props) {

    const canvasContext = useContext(CanvasContext);

    const eq = { ...props.eq };
    const onInput = props.onInput || ((v, i) => { });
    const x = props.x || 0;
    const y = props.y || 0;
    const width = props.width || 900;
    const height = props.height || 300;

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
    const freq = eq.bands[activeBand].frequency;
    const gain = eq.bands[activeBand].gain;

    const onMouseDown = (x, y) => {
        const band = eqtils.findClosestBand(eq, x, y, xMin, xMax, yMin, yMax);
        eq.activeBand = band;
        onInput(eq);
    }
    useOnMouseDown(canvasContext.canvasRef, onMouseDown);

    const onDrag = ([newFrequency, newGain, activeBand]) => {
        eq.bands[activeBand].frequency = newFrequency;
        eq.bands[activeBand].gain = newGain;
        onInput(eq);
    }
    useOnDragXY(canvasContext.canvasRef, [freq, gain, activeBand], onDrag, [xConverter, yConverter]);

    if (canvasContext.context) {
        const ctx = canvasContext.context;
        const minimal = props.minimal;
        const style = { background, bandStroke, sumStroke };
        eqtils.renderEq(eq, ctx, x, y, width, height, minimal, style);
    }

    return null;
}

export default ParametricEQ;
