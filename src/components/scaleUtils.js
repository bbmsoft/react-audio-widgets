import { linearScale, uiConverter } from "../scales/scales";

export function renderScale(valueScale, majorTickMarks, minorTickMarks, bounds, ctx, vertical) {

    const uiMin = vertical ? bounds.y : bounds.x;
    const uiMax = vertical ? bounds.y + bounds.height : bounds.x + bounds.width;

    const uiScale = linearScale(uiMin, uiMax, vertical);

    const minX = bounds.x;
    const maxX = bounds.x + bounds.width;
    const minY = bounds.y;
    const maxY = bounds.y + bounds.height;

    const converter = uiConverter(valueScale, uiScale);

    ctx.strokeStyle = '#444';
    if (vertical) {
        renderYTicks(minorTickMarks, ctx, converter, minX, maxX);
    } else {
        renderXTicks(minorTickMarks, ctx, converter, minY, maxY);
    }

    ctx.strokeStyle = '#666';
    if (vertical) {
        renderYTicks(majorTickMarks, ctx, converter, minX, maxX);
    } else {
        renderXTicks(majorTickMarks, ctx, converter, minY, maxY);
    }
}

function renderXTicks(ticks, ctx, converter, minY, maxY) {
    ctx.beginPath();
    for (const tick of ticks) {
        const x = Math.floor(converter.toUiCoordinate(tick)) + 0.5;
        ctx.moveTo(x, minY);
        ctx.lineTo(x, maxY);
    }
    ctx.stroke();
}

function renderYTicks(ticks, ctx, converter, minX, maxX) {
    ctx.beginPath();
    for (const tick of ticks) {
        const y = Math.floor(converter.toUiCoordinate(tick)) + 0.5;
        ctx.moveTo(minX, y);
        ctx.lineTo(maxX, y);
    }
    ctx.stroke();
}