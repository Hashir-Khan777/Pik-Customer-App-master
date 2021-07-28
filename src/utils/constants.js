import {Dimensions, Platform} from 'react-native';

export VehicleTypes from '../../../node-back/src/constants/VehicleTypes.js';
export OrderStatuses from '../../../node-back/src/constants/OrderStatuses.js';
export DriverStatuses from '../../../node-back/src/constants/DriverStatuses.js';

/** ** DEVICE CONSTANTS  *** */

export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

const DEVICE_SMALL_AREA = 240000;

export const DEVICE_TYPE =
    WINDOW_WIDTH * WINDOW_HEIGHT <= DEVICE_SMALL_AREA ? 'small' : 'large';
export const DEVICE_LARGE = DEVICE_TYPE === 'large';
export const DEVICE_SMALL = DEVICE_TYPE === 'small';
export const DEVICE_OS = Platform.OS;
export const DEVICE_ANDROID = DEVICE_OS === 'android';
export const DEVICE_IOS = DEVICE_OS === 'ios';

export const INPUT_HEIGHT = 48;
export const PAGE_PADDING = 15;

/** ** THEME CONSTANTS  *** */
export const BLACK = '#1a1919';
export const GRAY = '#4e4b4b';
export const GRAY_LIGHT = '#9b9797';
export const GRAY_LIGHT_EXTRA = '#f0efef';
export const ORANGE = '#e58e37';
export const GREEN = '#74e68d';
export const GREEN_LIGHT = '#c9eddb';
export const BLUE = '#377de5';
export const RED = '#e64436';
export const RED_LIGHT = '#edcbcb';

export const SIZE_HEADLINE_1 = 40;
export const SIZE_HEADLINE_2 = 32;
export const SIZE_HEADLINE_3 = 24;
export const SIZE_HEADLINE_4 = 22;
export const SIZE_HEADLINE_5 = 20;
export const SIZE_SUBHEADLINE_1 = 18;
export const SIZE_PARAGRAPH_1 = 16;
export const SIZE_PARAGRAPH_2 = 14;
export const SIZE_CAPTION_1 = 12;

export const COLOR_BACKGROUND = '#E5E5E5';

export const COLOR_PRIMARY_900 = '#1A1919';
export const COLOR_PRIMARY_800 = '#75420F';
export const COLOR_PRIMARY_700 = '#A25C15';
export const COLOR_PRIMARY_600 = '#D0751B';
export const COLOR_PRIMARY_500 = '#E58E37';
export const COLOR_PRIMARY_400 = '#EBA866';
export const COLOR_PRIMARY_300 = '#F1C293';
export const COLOR_PRIMARY_200 = '#FDF5ED';
export const COLOR_PRIMARY_1000 = '#FAFAFA';

export const COLOR_NEUTRAL_WHITE = '#FFFFFF';
export const COLOR_NEUTRAL_GRAY = '#9B9797';

export const COLOR_SECONDARY_800 = '#094848';
export const COLOR_SECONDARY_700 = '#0F7575';
export const COLOR_SECONDARY_600 = '#15A2A2';
export const COLOR_SECONDARY_500 = '#1BD0D0';
export const COLOR_SECONDARY_400 = '#37E5E5';
export const COLOR_SECONDARY_300 = '#66EBEB';
export const COLOR_SECONDARY_200 = '#93F1F1';
export const COLOR_SECONDARY_100 = '#EDFDFD';

export const COLOR_TERTIARY_SUCCESS = '#37E58E';
export const COLOR_TERTIARY_WARNING = '#FFC107';
export const COLOR_TERTIARY_ERROR = '#E53737';
export const COLOR_TERTIARY_HYPERLINK = '#377DE5';

// Base Gradient
const BG = {colors: ['#f00', '#00f'], locations: [0, 1], start: {x: 0, y: 0}, end: {x: 1, y: 1}};
// 'linear-gradient(137.17deg, #E58E37 -24.26%, #FDA085 93.7%)'
export const GRADIENT_1 = {...BG, colors: ['#E58E37', '#FDA085']};
// 'linear-gradient(135.21deg, #F12711 -36.55%, #F5AF19 75.09%)'
export const GRADIENT_2 = {...BG, colors: ['#F12711', '#F5AF19']};
// 'linear-gradient(162.35deg, #FF9966 12.07%, #FF5E62 120.08%)'
export const GRADIENT_3 = {...BG, colors: ['#FF9966', '#FF5E62']};
// export const COLOR_GRADIENT   = 'linear-gradient(167.56deg, #D0751B 9.04%, #E58E37 68.77%)'
export const GRADIENT = {...BG, colors: ['#D0751B', '#E58E37']};
// export const COLOR_GRADIENT_5 = 'linear-gradient(163.34deg, #F7A426 11.51%, #E58E37 95.49%)'
export const GRADIENT_5 = {...BG, colors: ['#F7A426', '#E58E37']};
// export const COLOR_GRADIENT_6 = 'linear-gradient(180deg, #F39C47 0%, #F4B15D 100%)'
export const GRADIENT_6 = {...BG, colors: ['#F39C47', '#F4B15D']};
export const GRADIENT_7 = {...BG, colors: ['rgba(0,0,0,0.9)', 'rgba(255,255,255,0)']};
export const GRADIENT_8 = {...BG, colors: ['#ddd', '#fafafa']};

export const REGEX_CREDIT_CARD_EXPIRE_DATE = /^((0[1-9])|(1[0-2]))\/((0[1-9])|([1-2][0-9])|(3[0-1]))$/;
