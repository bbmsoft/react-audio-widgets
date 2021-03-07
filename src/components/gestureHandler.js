export function handleMouseDown(id, elementRef, callback, bounds) {

    if (!window.mouseDown) {
        window.mouseDown = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.mouseDown[id];
    window.mouseDown[id] = { ...gestureHandler, element, callback, bounds };

    if (!gestureHandler) {
        watchMouseDown(element, id);
    }
}

export function handleDragX(id, elementRef, value, callback, converter) {

    if (!window.dragX) {
        window.dragX = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.dragX[id];
    window.dragX[id] = { ...gestureHandler, element, value, callback, converter };

    if (!gestureHandler) {
        watchDragX(element, id);
    }
}

export function handleDragY(id, elementRef, value, callback, converter) {

    if (!window.dragY) {
        window.dragY = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.dragY[id];
    window.dragY[id] = { ...gestureHandler, element, value, callback, converter };

    if (!gestureHandler) {
        watchDragY(element, id);
    }
}

export function handleDragXY(id, elementRef, values, callback, converters, bounds) {

    if (!window.dragXY) {
        window.dragXY = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.dragXY[id];
    window.dragXY[id] = { ...gestureHandler, element, values, callback, converters, bounds };

    if (!gestureHandler) {
        watchDragXY(element, id);
    }
}

function watchMouseDown(element, id) {

    const listener = e => {
        const { callback, bounds } = window.mouseDown[id];

        if (isInBounds(e, bounds)) {
            const x = e.offsetX;
            const y = e.offsetY;
            callback(x, y);
            e.preventDefault();
        }
    }

    element.addEventListener("mousedown", listener);
}

function watchDragX(element, id) {

    const onMouseMove = e => {
        const gestureHandler = window.dragX[id];
        const { callback, converter, dragStartXOffset } = gestureHandler;
        const dragX = e.pageX;
        const valueX = dragX - dragStartXOffset;
        const newValue = converter ? converter.toValue(valueX) : valueX;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const gestureHandler = window.dragX[id];
        const { converter, value } = gestureHandler;
        const dragStartX = e.pageX;
        const dragStartValueX = converter ? converter.toUiCoordinate(value) : value;
        gestureHandler.dragStartXOffset = dragStartX - dragStartValueX;
        window.addEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }
    const onMouseUp = e => {
        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    window.addEventListener("mouseup", onMouseUp);
    element.addEventListener("mousedown", onMouseDown);
}

function watchDragY(element, id) {

    const onMouseMove = e => {
        const gestureHandler = window.dragY[id];
        const { callback, converter, dragStartYOffset } = gestureHandler;
        const dragY = e.pageY;
        const valueY = dragY - dragStartYOffset;
        const newValue = converter ? converter.toValue(valueY) : valueY;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const gestureHandler = window.dragY[id];
        const { value, converter } = gestureHandler;
        const dragStartY = e.pageY;
        const dragStartValueY = converter ? converter.toUiCoordinate(value) : value;
        gestureHandler.dragStartYOffset = dragStartY - dragStartValueY;
        window.addEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }
    const onMouseUp = e => {
        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    window.addEventListener("mouseup", onMouseUp);
    element.addEventListener("mousedown", onMouseDown);
}

function watchDragXY(element, id) {

    const onMouseMove = e => {
        const gestureHandler = window.dragXY[id];
        const { callback, converters, dragStartXOffset, dragStartYOffset } = gestureHandler;
        const [converterX, converterY] = converters;
        const dragX = e.pageX;
        const dragY = e.pageY;
        const valueX = dragX - dragStartXOffset;
        const valueY = dragY - dragStartYOffset;
        const convertedX = converterX ? converterX.toValue(valueX) : valueX;
        const convertedY = converterY ? converterY.toValue(valueY) : valueY;
        callback(convertedX, convertedY);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const gestureHandler = window.dragXY[id];
        const { converters, bounds } = gestureHandler;
        const [converterX, converterY] = converters;

        if (!isInBounds(e, bounds)) {
            return;
        }

        const [valueX, valueY] = gestureHandler.values;
        const dragStartX = e.pageX;
        const dragStartY = e.pageY;
        const dragStartValueX = converterX ? converterX.toUiCoordinate(valueX) : valueX;
        const dragStartValueY = converterY ? converterY.toUiCoordinate(valueY) : valueY;
        gestureHandler.dragStartXOffset = dragStartX - dragStartValueX;
        gestureHandler.dragStartYOffset = dragStartY - dragStartValueY;
        window.addEventListener("mousemove", onMouseMove);
        e.preventDefault();
    }
    const onMouseUp = e => {
        window.removeEventListener("mousemove", onMouseMove);
        e.preventDefault();
    };

    window.addEventListener("mouseup", onMouseUp);
    element.addEventListener("mousedown", onMouseDown);
}

function isInBounds(e, bounds) {

    const x = e.offsetX;
    const y = e.offsetY;
    return bounds.xMin <= x && x <= bounds.xMax && bounds.yMin <= y && y <= bounds.yMax;
}