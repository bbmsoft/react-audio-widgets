import React, { useContext } from 'react';
import { linearScale, uiConverter } from '../scales/scales';
import DivContext from './divContext';

function renderScale(valueScale, tickMarks, width, height, vertical, className) {

    const uiMin = 0;
    const uiMax = vertical ? height : width;

    const uiScale = linearScale(uiMin, uiMax, vertical);

    const minX = 0;
    const maxX = width;
    const minY = 0;
    const maxY = height;

    const converter = uiConverter(valueScale, uiScale);

    if (vertical) {
        return renderYTicks(tickMarks, converter, minX, maxX, className);
    } else {
        return renderXTicks(tickMarks, converter, minY, maxY, className);
    }
}

function renderXTicks(ticks, converter, minY, maxY, className) {
    const tickMarks = []
    for (const tick of ticks) {
        const x = Math.floor(converter.toUiCoordinate(tick)) + 0.5;
        const line = <line key={tick} x1={x} y1={minY} x2={x} y2={maxY} className={className} />
        tickMarks.push(line);
    }
    return tickMarks;
}

function renderYTicks(ticks, converter, minX, maxX, className) {
    const tickMarks = []
    for (const tick of ticks) {
        const y = Math.floor(converter.toUiCoordinate(tick)) + 0.5;
        const line = <line key={tick} x1={minX} y1={y} x2={maxX} y2={y} className={className} />
        tickMarks.push(line);
    }
    return tickMarks;
}

function Scale(props) {

    const {
        scaleX, majorTickMarksX, minorTickMarksX,
        scaleY, majorTickMarksY, minorTickMarksY
    } = props;

    const div = useContext(DivContext);
    const width = div?.clientWidth || 100;
    const height = div?.clientHeight || 100;

    const minorVerticalTicks = renderScale(scaleX, minorTickMarksX, width, height, false, "tickmark-minor");
    const minorHorizontalTicks = renderScale(scaleY, minorTickMarksY, width, height, true, "tickmark-minor");
    const majorVerticalTicks = renderScale(scaleX, majorTickMarksX, width, height, false, "tickmark-major");
    const majorHorizontalTicks = renderScale(scaleY, majorTickMarksY, width, height, true, "tickmark-major");

    return (
        <svg width={width} height={height} className="scale">
            <rect width={width} height={height} className="background" />
            {minorVerticalTicks}
            {minorHorizontalTicks}
            {majorVerticalTicks}
            {majorHorizontalTicks}
        </svg>
    );
}

export default Scale;