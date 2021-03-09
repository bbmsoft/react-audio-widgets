import { useRef } from "react";

export function useMouseDown(id, elementRef, callback, bounds) {

    const handlers = useRef(new Map()).current;
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlers[id];
    handlers[id] = { ...gestureHandler, element, callback, bounds };

    if (callback && !gestureHandler) {
        watchMouseDown(element, id, handlers);
    }
}

export function useDragX(id, elementRef, value, callback, converter) {

    const handlers = useRef(new Map()).current;
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlers[id];
    handlers[id] = { ...gestureHandler, element, value, callback, converter };

    if (callback && !gestureHandler) {
        watchDragX(element, id, handlers);
    }
}

export function useDragY(id, elementRef, value, callback, converter) {

    const handlers = useRef(new Map()).current;
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlers[id];
    handlers[id] = { ...gestureHandler, element, value, callback, converter };

    if (callback && !gestureHandler) {
        watchDragY(element, id, handlers);
    }
}

export function useDragXY(id, elementRef, values, callback, converters, bounds) {

    const handlers = useRef(new Map()).current;
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlers[id];
    handlers[id] = { ...gestureHandler, element, values, callback, converters, bounds };

    if (callback && !gestureHandler) {
        watchDragXY(element, id, handlers);
    }
}

function watchMouseDown(element, id, handlers) {

    const listener = e => {
        const { callback, bounds } = handlers[id];

        if (isInBounds(e, bounds)) {
            const x = e.offsetX;
            const y = e.offsetY;
            callback(x, y);
            e.preventDefault();
        }
    }

    element.addEventListener("mousedown", listener);
}

function watchDragX(element, id, handlers) {

    const onMouseMove = e => {
        const gestureHandler = handlers[id];
        const { callback, converter, dragStartXOffset } = gestureHandler;
        const dragX = e.pageX;
        const valueX = dragX - dragStartXOffset;
        const newValue = converter ? converter.toValue(valueX) : valueX;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const gestureHandler = handlers[id];
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

function watchDragY(element, id, handlers) {

    const onMouseMove = e => {
        const gestureHandler = handlers[id];
        const { callback, converter, dragStartYOffset } = gestureHandler;
        const dragY = e.pageY;
        const valueY = dragY - dragStartYOffset;
        const newValue = converter ? converter.toValue(valueY) : valueY;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const gestureHandler = handlers[id];
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

function watchDragXY(element, id, handlers) {

    const onMouseMove = e => {
        const gestureHandler = handlers[id];
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
        const gestureHandler = handlers[id];
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