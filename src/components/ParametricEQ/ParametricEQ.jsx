import './ParametricEq.css';
import { clamped, linearScale, logarithmicScale, uiConverter } from '../../scales/scales';
import * as eqtils from './eqtils';
import { useDragXY, useMouseDown, useMouseUp, useContextMenu } from '../hooks/gestureHandler';
import { useEffect, useRef, useState } from 'react';
import Scale from '../Scale/Scale';
import ParametricEqGraph from './ParametricEqGraph';
import DivContext from '../divContext';
import Tooltip from '../Tooltip/Tooltip';

function ParametricEQ(props) {

    const divRef = useRef();
    const [div, setDiv] = useState(null);
    const [touched, setTouched] = useState(null);

    useEffect(() => {
        setDiv(divRef.current);
    }, [])

    const eq = { ...props.eq };
    const onInput = props.onInput;

    const divBounds = div?.getBoundingClientRect();
    const x = divBounds ? divBounds.x : 0;
    const y = divBounds ? divBounds.y + window.scrollY : 0;
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
        const band = eqtils.findClosestBand(eq, x, y, 0, width, 0, height);
        eq.activeBand = band;
        setTouched(true);
        onInput(eq);
    };
    useMouseDown(divRef, onMouseDown);

    const onMouseUp = (x, y) => {
        const band = eqtils.findClosestBand(eq, x, y, 0, width, 0, height);
        eq.activeBand = band;
        setTouched(false);
        onInput(eq);
    };
    useMouseUp(divRef, onMouseUp);

    const onDrag = (newFrequency, newGain) => {
        let band = eq.bands[eq.activeBand];
        if (band) {
            band.frequency = newFrequency;
            band.gain = newGain;
            onInput(eq);
        }
    };
    useDragXY(divRef, [freq, gain], onDrag, [xConverter, yConverter]);

    const onContextMenu = (x, y) => {
        if (touched) {
            return;
        }
        const closest = eqtils.findClosestBand(eq, x, y, 0, width, 0, height);
        const band = eq.bands[closest];
        if (band) {
            band.active = !band.active;
            onInput(eq);
        }
    }
    useContextMenu(divRef, onContextMenu);

    const majorFrequencyTickMarks = eqtils.majorFrequencyTickMarks(eq);
    const minorFrequencyTickMarks = eqtils.minorFrequencyTickMarks(eq);
    const majorGainTickMarks = eqtils.majorGainTickMarks(eq);
    const minorGainTickMarks = eqtils.minorGainTickMarks(eq);

    const tooltipRef = useRef(null);
    const { tooltipX, tooltipY, tooltipContent } = eqtils.tooltip(tooltipRef, eq, { x, y, width, height });
    const visibility = touched ? "visible" : "hidden";

    return (
        <div className="parametric-eq" ref={divRef}>
            <DivContext.Provider value={div}>
                <Scale
                    scaleX={frequencyScale} majorTickMarksX={majorFrequencyTickMarks} minorTickMarksX={minorFrequencyTickMarks}
                    scaleY={gainScale} majorTickMarksY={majorGainTickMarks} minorTickMarksY={minorGainTickMarks}
                />
                <ParametricEqGraph eq={eq} minimal={false} />
                <Tooltip x={tooltipX} y={tooltipY} ref={tooltipRef} visibility={visibility}>
                    {tooltipContent}
                </Tooltip>
            </DivContext.Provider>
        </div>
    );
}

export default ParametricEQ;
