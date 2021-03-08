import { CanvasContext } from './Canvas';
import * as eqtils from './eqtils';
import { useContext } from 'react';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEQThumbnail(props) {

    const canvasContext = useContext(CanvasContext);

    if (!props.eq) {
        return null;
    }

    const eq = { ...props.eq };
    const x = props.x || 0;
    const y = props.y || 0;
    const width = props.width || 90;
    const height = props.height || 30;


    if (canvasContext.context) {
        const ctx = canvasContext.context;
        const style = { background, bandStroke, sumStroke };
        eqtils.renderEq(eq, ctx, x, y, width, height, true, style);
    }

    return null;
}

export default ParametricEQThumbnail;
