import {Dimensions, PixelRatio} from 'react-native'

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
const guidelineWidth = 375;

export const scaleSize = size => {
    return (WINDOW_WIDTH/guidelineWidth) * size
};

export const scaleFont = size => (PixelRatio.getFontScale) * size;

function dimensions(top, right, bottom=top, left=right, property){
    const style = {};

    style[`${property}Top`] = top;
    style[`${property}Right`] = right;
    style[`${property}Bottom`] = bottom;
    style[`${property}Left`] = left;

    return style
}

export function margin(top, right, bottom, left){
    return dimensions(top, right, bottom, left, 'margin')
}

export function padding(top, right, bottom, left){
    return dimensions(top, right, bottom, left, 'padding')
}

export function boxShadow(value){
    return {
        elevation: value
    }
}


