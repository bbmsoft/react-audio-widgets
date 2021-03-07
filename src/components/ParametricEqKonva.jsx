import React from 'react';
import { Stage, Layer, Shape } from 'react-konva';

const background = "#333";
const bandStroke = "#f808";
const sumStroke = "#f80";

function ParametricEqKonva(props) {

    const { eq, width, height } = props;
    const style = { background, bandStroke, sumStroke };
    const minimal = props.minimal;

    return (
        <Stage width={width} height={height}>
            <Layer>
                <Shape
                    sceneFunc={(context, shape) => {
                        context.beginPath();
                        context.moveTo(20, 50);
                        context.lineTo(220, 80);
                        context.quadraticCurveTo(150, 100, 260, 170);
                        context.closePath();
                        // (!) Konva specific method, it is very important
                        context.fillStrokeShape(shape);
                    }}
                    fill="#00D2FF"
                    stroke="black"
                    strokeWidth={4}
                />
            </Layer>
        </Stage>
    );
}


function EqBandCurve(props) {

    return (
        <Shape
            sceneFunc={(context, shape) => {
                context.beginPath();
                context.moveTo(20, 50);
                context.lineTo(220, 80);
                context.quadraticCurveTo(150, 100, 260, 170);
                context.closePath();
                // (!) Konva specific method, it is very important
                context.fillStrokeShape(shape);
            }}
            fill="#00D2FF"
            stroke="black"
            strokeWidth={4}
        />
    );

}

export default ParametricEqKonva;