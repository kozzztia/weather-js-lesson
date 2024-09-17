export function createElement(tag) {
    return document.createElement(tag);
}

export function styled(element, style) {
    for (let key in style) {
        element.style[key] = style[key];
    }
}