import {scaleFont} from './mixins'

const FONT_SANS = 'OpenSans';
const FONT_PLAY = 'Play';

const FONT_WEIGHT_BOLD = 'bold';
const FONT_WEIGHT_REGULAR = 'normal';

export const FONT_SIZE_16 = scaleFont(16);
export const FONT_SIZE_14 = scaleFont(14);
export const FONT_SIZE_12 = scaleFont(12);
export const FONT_SIZE_10 = scaleFont(10);

export const FONT_SANS_REGULAR = {
    fontFamily: FONT_SANS,
    fontWeight: FONT_WEIGHT_REGULAR
};

export const FONT_PLAY_REGULAR = {
    fontFamily: FONT_PLAY,
    fontWeight: FONT_WEIGHT_REGULAR
};

export const FONT_SANS_BOLD = {
    fontFamily: FONT_SANS,
    fontWeight: FONT_WEIGHT_BOLD
};

export const FONT_PLAY_BOLD = {
    fontFamily: FONT_PLAY,
    fontWeight: FONT_WEIGHT_BOLD
};