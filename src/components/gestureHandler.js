export function useOnMouseDown(elementRef, callback) {

    if (!window.useOnMouseDown) {
        window.useOnMouseDown = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnMouseDown[element.id];

    if (!gestureHandler) {
        const newGestureHandler = { element, onMouseDown: { callback } };
        window.useOnMouseDown[element.id] = newGestureHandler;
        startHandlingGestures(newGestureHandler);
    }
}

export function useOnDragXY(elementRef, values, callback, converters) {

    if (!window.useOnDragXY) {
        window.useOnDragXY = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnDragXY[element.id];

    if (gestureHandler) {
        gestureHandler.values = values;
    } else {
        const newGestureHandler = { element, values, onDragXY: { callback, converters } };
        window.useOnDragXY[element.id] = newGestureHandler;
        startHandlingGestures(newGestureHandler);
    }
}

export function useOnDragY(elementRef, value, callback, converter) {

    if (!window.useOnDragY) {
        window.useOnDragY = new Map();
    }

    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = window.useOnDragY[element.id];

    if (gestureHandler) {
        gestureHandler.value = value;
    } else {
        const newGestureHandler = { element, value, onDragY: { callback, converter } };
        window.useOnDragY[element.id] = newGestureHandler;
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
    const { element, onMouseDown } = gestureHandler;
    const { callback } = onMouseDown;

    const listener = e => {
        const x = e.offsetX;
        const y = e.offsetY;
        callback(x, y);
        e.preventDefault();
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
        callback(newValue);
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
        callback(newValue);
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
    const { element, onDragXY } = gestureHandler;
    const { callback, converters } = onDragXY;
    const [converterX, converterY] = converters;

    const onMouseMove = e => {
        const values = [...gestureHandler.values];
        const dragX = e.pageX;
        const dragY = e.pageY;
        const valueX = dragX - gestureHandler.dragStartXOffset;
        const valueY = dragY - gestureHandler.dragStartYOffset;
        const convertedX = converterX ? converterX.toValue(valueX) : valueX;
        const convertedY = converterY ? converterY.toValue(valueY) : valueY;
        values.splice(0, 1, convertedX);
        values.splice(1, 1, convertedY);
        callback(values);
        e.preventDefault();
    };

    const onMouseDown = e => {
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
