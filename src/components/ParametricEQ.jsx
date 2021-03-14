import './ParametricEq.css';
import { clamped, linearScale, logarithmicScale, uiConverter } from '../scales/scales';
import * as eqtils from './eqtils';
import { useDragXY, useMouseDown } from './gestureHandler';
import { useContext, useRef } from 'react';
import XScale from './XScale';
import ParametricEqGraph from './ParametricEqGraph';
import DivContext from './divContext';
import { CanvasContext } from './Canvas';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEQ(props) {

    const canvasContext = useContext(CanvasContext);
    const ctx = canvasContext?.context;

    const divRef = useRef();

    const div = divRef.current;

    const eq = { ...props.eq };
    const onInput = props.onInput;

    const divBounds = div?.getBoundingClientRect();
    const x = divBounds ? divBounds.x : 0;
    const y = divBounds ? divBounds.y : 0;
    const width = divBounds ? divBounds.width : 900;
    const height = divBounds ? divBounds.height : 300;

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

    const onMouseDown = (x, y) => {
        const band = eqtils.findClosestBand(eq, x, y, 0, xMax - xMin, 0, yMax - yMin);
        eq.activeBand = band;
        onInput(eq);
    };
    useMouseDown(divRef, onMouseDown);

    const onDrag = (newFrequency, newGain) => {
        let band = eq.bands[eq.activeBand];
        if (band) {
            band.frequency = newFrequency;
            band.gain = newGain;
            onInput(eq);
        }
    };
    useDragXY(divRef, [freq, gain], onDrag, [xConverter, yConverter]);

    const majorTickMarks = eqtils.majorTickMarks(eq);
    const minorTickMarks = eqtils.minorTickMarks(eq);

    if (ctx) {
        const bounds = { x, y, width, height };
        eqtils.clearEq(ctx, bounds, background);
    }

    return (
        <div className="parametric-eq" ref={divRef}>
            <DivContext.Provider value={divRef}>
                <XScale />
                <ParametricEqGraph eq={eq} minimal={false} />
            </DivContext.Provider>
        </div>
    );
}

export default ParametricEQ;
