import React, { useContext } from 'react';
import { linearScale } from '../scales/scales';
import { CanvasContext } from './Canvas';
import DivContext from './divContext';
import * as scaleUtils from './scaleUtils';

function Scale(props) {

    const scale = props.scale || linearScale(0, 100);
    const majorTickMarks = props.majorTickMarks || [25, 50, 75];
    const minorTickMarks = props.minorTickMarks || [12.5, 37.5, 62.5, 87.5];

    const divRef = useContext(DivContext);
    const canvasContext = useContext(CanvasContext);

    const divBounds = divRef.current?.getBoundingClientRect();
    const canvasBounds = canvasContext.canvasRef.current?.getBoundingClientRect();
    const ctx = canvasContext.context;

    if (divBounds && canvasBounds && ctx) {

        const x = divBounds.x - canvasBounds.x;
        const y = divBounds.y - canvasBounds.y;
        const width = divBounds.width;
        const height = divBounds.height;

        const bounds = { x, y, width, height };

        scaleUtils.renderScale(scale, majorTickMarks, minorTickMarks, bounds, ctx, props.vertical);
    }

    return null;
}

export default Scale;