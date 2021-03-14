import { linearScale, uiConverter } from "../scales/scales";

export function renderXScale(valueScale, majorTickMarks, minorTickMarks, bounds, ctx) {

    const uiScale = linearScale(bounds.x, bounds.x + bounds.width);

    const minY = bounds.y;
    const maxY = bounds.y + bounds.height;

    const converter = uiConverter(valueScale, uiScale);

    ctx.strokeStyle = 'gray';
    renderXTicks(minorTickMarks, ctx, converter, minY, maxY);

    ctx.strokeStyle = 'white';
    renderXTicks(majorTickMarks, ctx, converter, minY, maxY);
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