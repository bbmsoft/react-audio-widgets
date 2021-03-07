import React, { useEffect } from 'react';
import { CanvasContext } from './Canvas';
import { clamped, linearScale, logarithmicScale } from '../scales/scales';
import * as eqtils from './eqtils';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEQ(props) {

    const id = props.id;
    const eq = props.eq;

    const canvasContext = React.useContext(CanvasContext);

    if (!window.eqs) {
        window.eqs = new Map();
    }
    window.eqs[id] = eq;

    const x = props.x || 0;
    const y = props.y || 0;
    const width = props.width || 900;
    const height = props.height || 300;

    const xMin = x;
    const xMax = xMin + width;
    const yMin = y;
    const yMax = yMin + height;

    const maxBandCircleRadius = Math.min(Math.min(width, height) / 5, Math.max(width, height) / 20);
    const minBandCircleRadius = maxBandCircleRadius / 5;

    const frequencyScale = clamped(logarithmicScale(eq.minFreq, eq.maxFreq));
    const gainScale = clamped(linearScale(eq.minGain, eq.maxGain));
    const qScale = clamped(logarithmicScale(eq.minQ, eq.maxQ));
    const xScale = linearScale(xMin, xMax);
    const yScale = linearScale(yMin, yMax, true);
    const circleScale = linearScale(minBandCircleRadius, maxBandCircleRadius, true);

    if (!window.mouseUpHandlers) {
        window.mouseUpHandlers = new Map();
    }

    if (!window.mouseDownHandlers) {
        window.mouseDownHandlers = new Map();
    }

    useEffect(() => {

        if (canvasContext) {
            const { canvas } = canvasContext;
            const noop = (v, i) => { };
            const onUserInput = props.onUserInput || noop;

            const handleMouseMove = e => {

                const [lastX, lastY] = window.lastMousePosition;
                const { clientX, clientY } = e;

                const dx = clientX - lastX;
                const dy = clientY - lastY;

                window.lastMousePosition = [clientX, clientY];

                const eq = { ...window.eqs[id] };
                const band = eq.bands[eq.activeBand];

                const newFrequency = xScale.applyDeltaTo(frequencyScale, dx, band.frequency);
                const newGain = yScale.applyDeltaTo(gainScale, dy, band.gain);

                band.frequency = newFrequency;
                band.gain = newGain;

                e.preventDefault();

                onUserInput(eq);
            }

            const handleMouseDown = e => {
                const rect = canvas.getBoundingClientRect();
                const canvasX = rect.x;
                const canvasY = rect.y;
                const eq = { ...window.eqs[id] };
                const closestBand = eqtils.findClosestBand(window.eqs[id], e.clientX - canvasX, e.clientY - canvasY, xMin, xMax, yMin, yMax);
                eq.activeBand = closestBand;
                onUserInput(eq);
                window.lastMousePosition = [e.clientX, e.clientY];
                window.addEventListener("mousemove", handleMouseMove);
                e.preventDefault();
            }

            const handleMouseUp = e => {
                window.removeEventListener("mousemove", handleMouseMove);
                e.preventDefault();
            }

            const mouseUpHandler = window.mouseUpHandlers[id];
            if (mouseUpHandler) {
                window.removeEventListener("mouseup", mouseUpHandler);
            }
            window.mouseUpHandlers[id] = handleMouseUp;

            const mouseDownHandler = window.mouseDownHandlers[id];
            if (mouseDownHandler) {
                canvas.removeEventListener("mousedown", mouseDownHandler);
            }
            window.mouseDownHandlers[id] = handleMouseDown;

            window.addEventListener("mouseup", handleMouseUp);
            canvas.addEventListener("mousedown", handleMouseDown);
        }
        return () => {
            const mouseUpHandler = window.mouseUpHandlers[id];
            if (mouseUpHandler) {
                window.removeEventListener("mouseup", mouseUpHandler);
            }
        }
    }, [canvasContext])

    if (canvasContext && eq) {
        const ctx = canvasContext.context;
        const minimal = props.minimal;
        const style = { background, bandStroke, sumStroke };
        eqtils.renderEq(eq, ctx, x, y, width, height, minimal, style);
    }

    return null;
}

export default ParametricEQ;


