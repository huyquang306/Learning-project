import {momentVN, TIME_SECONDS_FORMAT} from "./timer";
import moment from "moment";
import {currencyFormat} from "./number";

export const PUB_SUB_KEY = {
    DEACTIVE_SHOP: 'deactive_shop',
    RING_ALARM: 'RING_ALARM',
    // Refresh orderGroups data
    KEY_FRESH_UPDATE_ORDER: 'publishKeyFreshUpdatedOrders',
    KEY_FRESH_NEW_ORDER: 'publishKeyFreshNewOrderData',
    KEY_FRESH_PAYMENT_ORDERGROUP: 'publishKeyFreshPaymentData',
};

export const IS_ACTIVE_SHOP_KEY = 'is-active-shop';
export const TIME_WAITING_FOR_RESEND = 60000;

export const ALARM_AUDIO_PATH = `${process.env.MIX_ASSETS_PATH}sounds/audiostock_16791.wav`;

export const ON_BOARDING_CONFIG = {
    USER_GROUP_ID: {
        CUSTOMER: 'customer',
        SHOP: 'shop',
    },
    USER_GROUP_NAME: {
        CUSTOMER: 'customer',
        SHOP: 'shop',
    },
};

export const ROUND_DOWN = 0;
export const ROUND_UP = 1;

export const round = (number, decimals) => {
    decimals = decimals || 0;
    
    return Math.round((number * Math.pow(10, decimals))) / Math.pow(10, decimals);
};

export const roundUp = (number, decimals) => {
    decimals = decimals || 0;
    
    return Math.ceil((number * Math.pow(10, decimals))) / Math.pow(10, decimals);
};

export const roundDown = (number, decimals) => {
    decimals = decimals || 0;
    
    return Math.floor((number * Math.pow(10, decimals))) / Math.pow(10, decimals);
};
export const hanldePriceFractionMode = (value, decimals, roundType) => {
    switch(roundType) {
        case ROUND_DOWN:
            return roundDown(value, decimals)
        case ROUND_UP:
            return roundUp(value, decimals)
        default:
            return round(value, decimals)
    }
};

export const getPositiveNumber = (value) => {
    return Number(value) === 0
      ? value.replace(/[^1-9]/g, '').replace(/(\..*?)\..*/g, '$1')
      : value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');
};

export const ORDER_HISTORY_PAGINATION = 20;

export const CHARCODE_NUMBER_ZERO = 48;

export const CHARCODE_NUMBER_NINE = 57;

export const CHARCODE_MINUS = 45;

export const ENTER_KEY_CODE = 13;

export const S3_URL = process.env.MIX_AWS_S3_BUCKET
  ? `https://${process.env.MIX_AWS_S3_BUCKET}.s3.${process.env.MIX_AWS_S3_REGION}.amazonaws.com/`
  : `${window.location.origin}/`;

export const MENU_STATUS = {
    STATUS_ONSALE: 'onsale',
    STATUS_OFFSALE: 'not_onsale',
};

export const NO_IMAGE_URL = 'img/shared/noimage.png';

export const TAX_OPTIONS = [
    {
        tax_rate: 0.1,
        name: 'Standard tax',
    },
    {
        tax_rate: 0.08,
        name: 'Reduced tax',
    },
    {
        tax_rate: 0,
        name: 'No tax',
    },
];

export const INITIAL_ORDER_FLG_OFF = 0;
export const HOURS_PRICE_FLG_ON = 1;

export const getHourPriceNearestNow = (menu) => {
    const now = moment(momentVN().format('HH:mm:ss'), TIME_SECONDS_FORMAT);
    let hourPrice = null;
    if (menu?.m_shop_business_hour_prices?.length) {
        hourPrice = menu?.m_shop_business_hour_prices?.filter(block => {
            if (block?.m_shop_business_hour) {
                const blockStartTime = moment(block.m_shop_business_hour.start_time, TIME_SECONDS_FORMAT);
                const blockFinishTime = moment(block.m_shop_business_hour.finish_time, TIME_SECONDS_FORMAT);
                
                return blockStartTime < now && now < blockFinishTime && block?.display_flg === HOURS_PRICE_FLG_ON;
            }
            
            return false;
        });
    }
    
    return hourPrice?.length ? currencyFormat(Number(hourPrice[0]?.price)) : null;
};

export const CURRENCY_UNIT = [5, 10, 50, 100, 500, 1000, 2000, 5000, 10000];

export const makeRandomId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_=';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const showtaxValue = (value, currencyName, isShowAttachText = true) => {
    
    return isShowAttachText
      ? `(${value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} ${currencyName})`
      : `${value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} ${currencyName}`;
};

export const formatPriceWhileTyping = (num) => {
    let output = parseFloat(String(num).replace(/,/g, ''));
    
    return !isNaN(output) ? String(output).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : '';
};

