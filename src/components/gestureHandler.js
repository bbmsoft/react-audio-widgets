import { useRef } from "react";

export function useMouseDown(elementRef, callback, bounds) {

    const handlerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, callback, bounds };

    if (callback && !gestureHandler) {
        watchMouseDown(element, handlerRef);
    }
}

export function useDragX(elementRef, value, callback, converter) {

    const handlerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, value, callback, converter };

    if (callback && !gestureHandler) {
        watchDragX(element, handlerRef);
    }
}

export function useDragY(elementRef, value, callback, converter) {

    const handlerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, value, callback, converter };

    if (callback && !gestureHandler) {
        watchDragY(element, handlerRef);
    }
}

export function useDragXY(elementRef, values, callback, converters, bounds) {

    const handlerRef = useRef(null);
    const element = elementRef.current;

    if (!element) {
        return;
    }

    const gestureHandler = handlerRef.current;
    handlerRef.current = { ...gestureHandler, element, values, callback, converters, bounds };

    if (callback && !gestureHandler) {
        watchDragXY(element, handlerRef);
    }
}

function watchMouseDown(element, handlerRef) {

    console.log("watchMouseDown");

    const listener = e => {
        const { callback, bounds } = handlerRef.current;

        if (isInBounds(e, bounds)) {
            const x = e.offsetX;
            const y = e.offsetY;
            callback(x, y);
            e.preventDefault();
        }
    }

    element.addEventListener("mousedown", listener);
}

function watchDragX(element, handlerRef) {

    const onMouseMove = e => {
        const gestureHandler = handlerRef.current;
        const { callback, converter, dragStartXOffset } = gestureHandler;
        const dragX = e.pageX;
        const valueX = dragX - dragStartXOffset;
        const newValue = converter ? converter.toValue(valueX) : valueX;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const gestureHandler = handlerRef.current;
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

function watchDragY(element, handlerRef) {

    const onMouseMove = e => {
        const gestureHandler = handlerRef.current;
        const { callback, converter, dragStartYOffset } = gestureHandler;
        const dragY = e.pageY;
        const valueY = dragY - dragStartYOffset;
        const newValue = converter ? converter.toValue(valueY) : valueY;
        callback(newValue);
        e.preventDefault();
    };

    const onMouseDown = e => {
        const gestureHandler = handlerRef.current;
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

function watchDragXY(element, handlerRef) {

    const onMouseMove = e => {
        const gestureHandler = handlerRef.current;
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
        const gestureHandler = handlerRef.current;
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