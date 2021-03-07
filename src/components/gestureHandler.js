export function handleMouseDown(id, elementRef, callback, bounds, state) {

    if (!window.useOnMouseDown) {
        window.useOnMouseDown = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnMouseDown[id];

    if (gestureHandler) {
        gestureHandler.state = state;
    } else {
        const newGestureHandler = { element, onMouseDown: { callback }, bounds, state };
        window.useOnMouseDown[id] = newGestureHandler;
        startHandlingGestures(newGestureHandler);
    }
}

export function handleDragX(id, elementRef, value, callback, converter, state) {

    if (!window.useOnDragX) {
        window.useOnDragX = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnDragX[id];

    if (gestureHandler) {
        gestureHandler.value = value;
        gestureHandler.state = state;
    } else {
        const newGestureHandler = { element, value, onDragX: { callback, converter }, state };
        window.useOnDragX[id] = newGestureHandler;
        startHandlingGestures(newGestureHandler);
    }
}

export function handleDragY(id, elementRef, value, callback, converter, state) {

    if (!window.useOnDragY) {
        window.useOnDragY = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnDragY[id];

    if (gestureHandler) {
        gestureHandler.value = value;
        gestureHandler.state = state;
    } else {
        const newGestureHandler = { element, value, onDragY: { callback, converter }, state };
        window.useOnDragY[id] = newGestureHandler;
        startHandlingGestures(newGestureHandler);
    }
}

export function handleDragXY(id, elementRef, values, callback, converters, bounds, state) {

    if (!window.useOnDragXY) {
        window.useOnDragXY = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnDragXY[id];

    if (gestureHandler) {
        gestureHandler.values = values;
        gestureHandler.state = state;
    } else {
        const newGestureHandler = { element, values, onDragXY: { callback, converters }, bounds, state };
        window.useOnDragXY[id] = newGestureHandler;
        startHandlingGestures(newGestureHandler);
    }
}

function startHandlingGestures(gestureHandler) {

    if (gestureHandler.onMouseDown) {
        watchMouseDown(gestureHandler);
    }

    if (gestureHandler.onDragX) {
        watchDragX(gestureHandler);
    }

    if (gestureHandler.onDragY) {
        watchDragY(gestureHandler);
    }

    if (gestureHandler.onDragXY) {
        watchDragXY(gestureHandler);
    }

    // TODO
}

function watchMouseDown(gestureHandler) {
    const { element, onMouseDown, bounds } = gestureHandler;
    const { callback } = onMouseDown;

    const listener = e => {

        if (isInBounds(e, bounds)) {
            const x = e.offsetX;
            const y = e.offsetY;
            callback(x, y, gestureHandler.state);
            e.preventDefault();
        }
    }

    element.addEventListener("mousedown", listener);
}

function watchDragX(gestureHandler) {
    const { element, onDragX } = gestureHandler;
    const { callback, converter } = onDragX;

    const onMouseMove = e => {
        const dragX = e.pageX;
        const valueX = dragX - gestureHandler.dragStartXOffset;
        const newValue = converter ? converter.toValue(valueX) : valueX;
        callback(newValue, gestureHandler.state);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const dragStartX = e.pageX;
        const dragStartValueX = converter ? converter.toUiCoordinate(gestureHandler.value) : gestureHandler.value;
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

function watchDragY(gestureHandler) {
    const { element, onDragY } = gestureHandler;
    const { callback, converter } = onDragY;

    const onMouseMove = e => {
        const dragY = e.pageY;
        const valueY = dragY - gestureHandler.dragStartYOffset;
        const newValue = converter ? converter.toValue(valueY) : valueY;
        callback(newValue, gestureHandler.state);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const dragStartY = e.pageY;
        const dragStartValueY = converter ? converter.toUiCoordinate(gestureHandler.value) : gestureHandler.value;
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

function watchDragXY(gestureHandler) {
    const { element, onDragXY, bounds } = gestureHandler;
    const { callback, converters } = onDragXY;
    const [converterX, converterY] = converters;

    const onMouseMove = e => {
        const dragX = e.pageX;
        const dragY = e.pageY;
        const valueX = dragX - gestureHandler.dragStartXOffset;
        const valueY = dragY - gestureHandler.dragStartYOffset;
        const convertedX = converterX ? converterX.toValue(valueX) : valueX;
        const convertedY = converterY ? converterY.toValue(valueY) : valueY;
        callback([convertedX, convertedY], gestureHandler.state);
        e.preventDefault();
    };

    const onMouseDown = e => {

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