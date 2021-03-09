import { CanvasContext } from './Canvas';
import * as eqtils from './eqtils';
import { useContext, useRef } from 'react';
import './ParametricEqThumbnail.css';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEQThumbnail(props) {

    const divRef = useRef();
    const canvasContext = useContext(CanvasContext);

    const div = divRef.current;

    const eq = { ...props.eq };

    const divBounds = div?.getBoundingClientRect();
    const x = divBounds ? divBounds.x : 0;
    const y = divBounds ? divBounds.y : 0;
    const width = divBounds ? divBounds.width : 900;
    const height = divBounds ? divBounds.height : 300;

    if (canvasContext.context) {
        const ctx = canvasContext.context;
        const style = { background, bandStroke, sumStroke };
        eqtils.renderEq(eq, ctx, x, y, width, height, true, style);
    }

    return <div className="parametric-eq-thumbnail" ref={divRef}></div>;
}

export default ParametricEQThumbnail;
