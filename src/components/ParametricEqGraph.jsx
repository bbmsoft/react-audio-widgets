import { CanvasContext } from './Canvas';
import * as eqtils from './eqtils';
import { useContext } from 'react';
import './ParametricEqThumbnail.css';
import DivContext from './divContext';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEqGraph(props) {

    const canvasContext = useContext(CanvasContext);

    const div = useContext(DivContext);

    const eq = { ...props.eq };

    const divBounds = div?.getBoundingClientRect();
    const x = divBounds ? divBounds.x : 0;
    const y = divBounds ? divBounds.y : 0;
    const width = divBounds ? divBounds.width : 900;
    const height = divBounds ? divBounds.height : 300;

    const bounds = { x, y, width, height };

    if (canvasContext.context) {
        const ctx = canvasContext.context;
        const style = { background, bandStroke, sumStroke };
        eqtils.renderEq(eq, ctx, bounds, props.minimal, style);
    }

    return null;
}

export default ParametricEqGraph;
