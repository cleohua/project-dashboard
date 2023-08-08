import floatDialogSlotCompon from "../../../vue/assets/float-dialog-slot-compon.js";
import { template, controlPanelTemp } from "../template/edit-picture-temp.js";

var svgList = {
    drag: `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><g transform="translate(0,128) scale(0.1,-0.1)" fill="#000000" stroke="none"><path d="M544 1266 c-17 -8 -44 -30 -60 -49 -22 -27 -33 -34 -44 -27 -8 5 -39 10 -68 10 -48 0 -57 -4 -95 -39 l-42 -40 -3 -118 -4 -118 -54 -57 c-82 -85 -94 -119 -94 -263 0 -164 10 -184 171 -340 138 -134 201 -174 325 -205 182 -47 349 -3 480 125 63 62 93 111 125 204 17 48 19 87 19 366 0 308 0 313 -23 346 -41 61 -106 80 -192 54 -15 -4 -24 2 -37 24 -23 42 -70 64 -127 59 -25 -3 -53 -8 -61 -11 -10 -5 -20 3 -32 23 -19 33 -87 70 -128 69 -14 0 -39 -6 -56 -13z m112 -87 c16 -18 20 -40 22 -138 3 -91 7 -119 19 -128 11 -9 21 -9 34 -2 16 8 19 22 19 73 0 79 14 120 46 135 35 16 47 14 78 -10 24 -19 26 -26 26 -96 0 -57 4 -81 17 -95 9 -10 20 -18 24 -18 19 0 39 35 39 68 0 75 85 112 129 56 20 -25 21 -39 21 -289 0 -286 -7 -351 -50 -435 -108 -212 -369 -282 -605 -163 -64 33 -281 244 -306 298 -14 29 -19 64 -19 130 0 97 18 153 59 189 l21 19 0 -42 c0 -45 19 -63 49 -44 14 9 17 40 21 207 5 193 6 198 29 217 32 26 67 24 96 -6 22 -21 25 -33 25 -99 0 -54 4 -79 16 -90 19 -20 29 -20 48 0 13 12 16 39 16 130 0 101 2 116 20 134 27 27 81 26 106 -1z"/></g></svg>`,
    brightness: `<svg xmlns="http://www.w3.org/2000/svg" width="33" height="32.85" viewBox="0 0 33 32.85"><path d="M10.14,7.26,7.44,4.575,5.325,6.69,8.01,9.375ZM6,15.75H1.5v3H6ZM19.5.825h-3V5.25h3V.825ZM30.675,6.69,28.56,4.575,25.875,7.26,27.99,9.375,30.675,6.69ZM25.86,27.24l2.685,2.7,2.115-2.115-2.7-2.685-2.1,2.1ZM30,15.75v3h4.5v-3ZM18,8.25a9,9,0,1,0,9,9A9.007,9.007,0,0,0,18,8.25ZM16.5,33.675h3V29.25h-3ZM5.325,27.81,7.44,29.925l2.685-2.7L8.01,25.11l-2.685,2.7Z" transform="translate(-1.5 -0.825)"/></svg>`,
    rotate: `<svg xmlns="http://www.w3.org/2000/svg" width="32.758" height="31.858" viewBox="0 0 32.758 31.858"><g transform="translate(-905.006 -950.999)"><path d="M20.219,14.584H18.562V3.978a1.326,1.326,0,0,0-1.326-1.326H7.955V6.629h6.629v13.59a1,1,0,0,0,.994.994h1.989a1,1,0,0,0,.994-.994V18.562h1.657a1,1,0,0,0,.994-.994V15.579A.994.994,0,0,0,20.219,14.584ZM6.629.994A.994.994,0,0,0,5.635,0H3.646a.994.994,0,0,0-.994.994V2.652H.994A.994.994,0,0,0,0,3.646V5.635a1,1,0,0,0,.994.994H2.652V17.236a1.326,1.326,0,0,0,1.326,1.326h9.281V14.584H6.629Z" transform="translate(916.551 961.644)"/><path d="M30.689,4.614A19.229,19.229,0,0,0,19.757,20.142H17.01A21.963,21.963,0,0,1,38.892,0L40.1.055,33.124,7.031,30.689,4.614Z" transform="translate(887.996 950.999)"/></g></svg>`,
    stamp: `<svg xmlns="http://www.w3.org/2000/svg" width="30.67" height="32.358" viewBox="0 0 30.67 32.358"><g transform="translate(-1103.109 -789.5)"><path d="M256.617-204.076H230.66a.619.619,0,0,1-.618-.618v-2.472a.619.619,0,0,1,.618-.618.619.619,0,0,1,.618.618v1.854H256v-1.854a.619.619,0,0,1,.618-.618.619.619,0,0,1,.618.618v2.472A.619.619,0,0,1,256.617-204.076Z" transform="translate(874.805 1025.933)"/><path d="M.619,27.155A.623.623,0,0,1,0,26.537V22.828a3.093,3.093,0,0,1,3.091-3.091H9.084c4.073-2.836,2.2-6.944.7-10.254A9.386,9.386,0,0,1,8.655,6.139,5.967,5.967,0,0,1,14.837,0a5.968,5.968,0,0,1,6.181,6.138A9.516,9.516,0,0,1,19.9,9.476c-1.5,3.317-3.367,7.432.691,10.261h5.992a3.092,3.092,0,0,1,3.091,3.091v3.709a.618.618,0,0,1-.618.618Zm.618-1.237h27.2v0ZM18.77,8.968a16.429,16.429,0,0,0-1.869,6.39,16.429,16.429,0,0,1,1.869-6.39,9.425,9.425,0,0,0,1.011-2.829A9.425,9.425,0,0,1,18.77,8.968ZM9.891,6.139a9.608,9.608,0,0,0,1.018,2.836,16.29,16.29,0,0,1,1.873,6.38,16.29,16.29,0,0,0-1.873-6.38A9.608,9.608,0,0,1,9.891,6.139Zm.007-.31a4.713,4.713,0,0,1,4.938-4.591A4.713,4.713,0,0,0,9.9,5.829Z" transform="translate(1103.608 789.999)"/></g></svg>`,
    graphics: `<svg xmlns="http://www.w3.org/2000/svg" width="28.768" height="29.016" viewBox="0 0 28.768 29.016"><g transform="translate(-1141.829 -948.869)"><path d="M10.207,20.005H1.885A2,2,0,0,1,.157,17L9.586.834a2,2,0,0,1,3.455,0l5.589,9.581H13.207a3,3,0,0,0-3,3V20Z" transform="translate(1141.947 949.027)"/><rect width="16.968" height="16.968" rx="2" transform="translate(1153.63 960.917)"/></g></svg>`,
    draw: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><path d="M16.752,5.372l7.376,7.376L8.111,28.766l-6.577.726A1.383,1.383,0,0,1,.008,27.964L.74,21.383,16.752,5.372Zm11.938-1.1L25.227.811a2.767,2.767,0,0,0-3.913,0L18.056,4.069l7.376,7.376L28.69,8.187a2.767,2.767,0,0,0,0-3.913Z"/></svg>`,
    text: `<svg xmlns="http://www.w3.org/2000/svg" width="28.858" height="28.858" viewBox="0 0 28.858 28.858"><path d="M0,0V7.215H1.8A3.618,3.618,0,0,1,5.411,3.607h5.411v19.84a1.786,1.786,0,0,1-1.8,1.8h-1.8v3.607H21.644V25.251h-1.8a1.786,1.786,0,0,1-1.8-1.8V3.607h5.411a3.618,3.618,0,0,1,3.607,3.607h1.8V0Z"/></svg>`,
    earse: `<svg xmlns="http://www.w3.org/2000/svg" width="32.203" height="28.178" viewBox="0 0 32.203 28.178"><path d="M31.319,17.467a3.019,3.019,0,0,0,0-4.27L21.255,3.134a3.019,3.019,0,0,0-4.27,0l-16.1,16.1a3.019,3.019,0,0,0,0,4.27l6.038,6.038a3.019,3.019,0,0,0,2.135.884H31.448a.755.755,0,0,0,.755-.755V27.157a.755.755,0,0,0-.755-.755H22.384l8.935-8.935ZM12.285,13.528l8.64,8.64L16.691,26.4H9.474L4.442,21.371l7.842-7.842Z" transform="translate(0 -2.25)"/></svg>`,
    clear: `<svg xmlns="http://www.w3.org/2000/svg" width="30.438" height="30.438" viewBox="0 0 30.438 30.438"><path d="M15.809.562A15.167,15.167,0,0,1,26.294,4.777l2.192-2.192A1.473,1.473,0,0,1,31,3.627v8.227a1.473,1.473,0,0,1-1.473,1.473H21.3a1.473,1.473,0,0,1-1.041-2.514L22.821,8.25a10.309,10.309,0,1,0-.251,15.29.735.735,0,0,1,1,.034l2.434,2.434a.738.738,0,0,1-.03,1.07A15.219,15.219,0,1,1,15.809.562Z" transform="translate(-0.563 -0.563)"/></svg>`,
    undo: `<svg xmlns="http://www.w3.org/2000/svg" width="33.094" height="26.391" viewBox="0 0 33.094 26.391"><path d="M-203.653-317.442c0-1.448.309-7.162-4.2-11.7-3.034-3.05-6.92-4.6-12.349-4.843v-6.92l-16.539,11.03,16.547,11.031v-6.877a22.028,22.028,0,0,1,8.359,1.724c2.664,1.188,4.766,3.791,6.533,6.6l1.654,2.882h0C-203.644-315.379-203.653-316.676-203.653-317.442Z" transform="translate(236.738 340.9)"/></svg>`,
    redo: `<svg xmlns="http://www.w3.org/2000/svg" width="33.094" height="26.391" viewBox="0 0 33.094 26.391"><path d="M-236.73-317.442c0-1.448-.309-7.162,4.2-11.7,3.034-3.05,6.92-4.6,12.349-4.843v-6.92l16.539,11.03-16.547,11.031v-6.877a22.028,22.028,0,0,0-8.359,1.724c-2.664,1.188-4.766,3.791-6.533,6.6l-1.654,2.882h0C-236.738-315.379-236.73-316.676-236.73-317.442Z" transform="translate(236.738 340.9)"/></svg>`,
    arrow: `<svg xmlns="http://www.w3.org/2000/svg" width="22.463" height="22.463" viewBox="0 0 22.463 22.463"><path d="M9.622,27.7,25.146,12.175v6.712a1.872,1.872,0,0,0,3.744,0V7.656a1.869,1.869,0,0,0-1.872-1.871H15.786a1.872,1.872,0,1,0,0,3.744H22.5L6.975,25.052A1.872,1.872,0,0,0,9.622,27.7Z" transform="translate(-6.427 -5.784)"/></svg>`,
    dashArrow: `<svg xmlns="http://www.w3.org/2000/svg" width="36.205" height="35.66" viewBox="0 0 36.205 35.66"><g transform="translate(2.828 2)"><path d="M3.952,11.463l8.677-8.67A1.639,1.639,0,0,0,10.308.479L.477,10.3a1.636,1.636,0,0,0-.048,2.26L10.3,22.454a1.639,1.639,0,1,0,2.321-2.314Z" transform="translate(33.377 14.215) rotate(135)"/><line x1="22.775" y2="22.331" transform="translate(0 8.5)" fill="none" stroke="black" stroke-linecap="round" stroke-width="4" stroke-dasharray="9"/></g></svg>`,
    rect: `<svg xmlns="http://www.w3.org/2000/svg" width="26.224" height="26.224" viewBox="0 0 26.224 26.224"><g fill="rgba(255,255,255,0)" stroke="#000" stroke-width="3"><rect width="26.224" height="26.224" stroke="none"/><rect x="1.5" y="1.5" width="23.224" height="23.224"/></g></svg>`,
    circle: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="26.224" height="26.224" viewBox="0 0 26.224 26.224"><defs><clipPath id="a"><rect width="26.224" height="26.224" fill="none"/></clipPath></defs><g clip-path="url(#a)"><g transform="translate(-1041.271 -5553)"><g transform="translate(1041.271 5553)" fill="rgba(255,255,255,0)" stroke="#000" stroke-width="3"><circle cx="13.112" cy="13.112" r="13.112" stroke="none"/><circle cx="13.112" cy="13.112" r="11.612" fill="none"/></g></g></g></svg>`,
    flipY: `<svg xmlns="http://www.w3.org/2000/svg" width="22.286" height="34.15" viewBox="0 0 22.286 34.15"><g transform="translate(1.5 1.5)"><line x2="18.89" transform="translate(0 15.575)" fill="none" stroke="black" stroke-linecap="round" stroke-width="3"/><path d="M8.744,0,0,8.744l8.744,8.744" transform="translate(18.664 0) rotate(90)" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M0,0,8.744,8.744,0,17.488" transform="translate(18.664 22.406) rotate(90)" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></svg>`,
    flipX: `<svg xmlns="http://www.w3.org/2000/svg" width="35.532" height="24.616" viewBox="0 0 35.532 24.616"><g transform="translate(1.499 1.5)"><line y1="21.616" transform="translate(16.267 0)" fill="none" stroke="black" stroke-linecap="round" stroke-width="3"/><path d="M-11732.788,4874.042l-9.45,9.45,9.45,9.449" transform="translate(11742.238 -4872.766)" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path d="M-11742.238,4874.042l9.45,9.45-9.45,9.449" transform="translate(11765.321 -4872.766)" fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/></g></svg>`,
    retato90: `<svg xmlns="http://www.w3.org/2000/svg" width="35.03" height="38.018" viewBox="0 0 35.03 38.018"><path d="M13.5,4.5A13.5,13.5,0,0,1,27,18h4.5l-6,6-6-6H24a10.507,10.507,0,1,0-4.41,8.55l2.13,2.16A13.5,13.5,0,1,1,13.5,4.5Z" transform="translate(-4.303 28.808) rotate(-73)"/></svg>`,
    thumbsUp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M15.543,7l.182-1.072a3.39,3.39,0,0,0-.035-1.46A3.451,3.451,0,0,0,9.226,3.8L7.59,7H3a3,3,0,0,0-3,3v9a3,3,0,0,0,3,3H22.02L24,11.345,24.025,7ZM3,10H7v9H3Zm18,.934L19.5,19H10V8.861L11.919,5.1a.446.446,0,0,1,.4-.243.445.445,0,0,1,.438.52L11.974,10H21Z"/></svg>`,
    bolt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M12.566,24H8.719l2-8H6.586a2.561,2.561,0,0,1-2.451-3.3L7.976,0h9.467l-3,8h4.023a2.533,2.533,0,0,1,2.11,3.932Z"/></svg>`,
    interrogation: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path d="M18.581,2.14,12.316.051a1,1,0,0,0-.632,0L5.418,2.14A4.993,4.993,0,0,0,2,6.883V12c0,7.563,9.2,11.74,9.594,11.914a1,1,0,0,0,.812,0C12.8,23.74,22,19.563,22,12V6.883A4.993,4.993,0,0,0,18.581,2.14ZM12,19a1,1,0,1,1,1-1A1,1,0,0,1,12,19Zm1.928-6.443A1.987,1.987,0,0,0,13,14a1,1,0,0,1-2,0,3.953,3.953,0,0,1,1.963-3.195,1.994,1.994,0,0,0,1-2.124,2.024,2.024,0,0,0-1.6-1.6A2,2,0,0,0,10,9.052a1,1,0,0,1-2,0A4,4,0,0,1,9.429,5.987a4,4,0,1,1,4.5,6.57Z"/></svg>`,
    megaphone: `<svg height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m22.293 15.707-2.288-2.288 1.414-1.414 2.288 2.288zm1.414-10-1.414-1.414-2.25 2.25 1.414 1.414zm.293 3.293h-3v2h3zm-15.63 8h-5.631l3.111 7h1.4a2.752 2.752 0 0 0 2.514-3.868zm9.63-17v20h-2a5.006 5.006 0 0 0 -5-5h-8a3 3 0 0 1 -3-3v-4a3 3 0 0 1 3-3h8a5.006 5.006 0 0 0 5-5z"/></svg>`,
    cross: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 512.021 512.021" style="enable-background:new 0 0 512.021 512.021;" xml:space="preserve" width="512" height="512"><g><path d="M301.258,256.01L502.645,54.645c12.501-12.501,12.501-32.769,0-45.269c-12.501-12.501-32.769-12.501-45.269,0l0,0   L256.01,210.762L54.645,9.376c-12.501-12.501-32.769-12.501-45.269,0s-12.501,32.769,0,45.269L210.762,256.01L9.376,457.376   c-12.501,12.501-12.501,32.769,0,45.269s32.769,12.501,45.269,0L256.01,301.258l201.365,201.387   c12.501,12.501,32.769,12.501,45.269,0c12.501-12.501,12.501-32.769,0-45.269L301.258,256.01z"/></g></svg>`,
    exclamation: `<svg height="512" viewBox="0 0 24 24" width="512" xmlns="http://www.w3.org/2000/svg"><path d="m18.581 2.14-6.265-2.089a1 1 0 0 0 -.632 0l-6.266 2.089a4.993 4.993 0 0 0 -3.418 4.743v5.117c0 7.563 9.2 11.74 9.594 11.914a1 1 0 0 0 .812 0c.394-.174 9.594-4.351 9.594-11.914v-5.117a4.993 4.993 0 0 0 -3.419-4.743zm-6.581 16.86a1 1 0 1 1 1-1 1 1 0 0 1 -1 1zm1-5a1 1 0 0 1 -2 0v-8a1 1 0 0 1 2 0z"/></svg>`
}

var controlPanelCompon = {
    name: 'contral-panel-compon',
    template: controlPanelTemp,
    props: {
        level: {
            type: Number,
            default: 0,
        },
        menu: {
            type: Array,
            default: [],
        },
        current: {
            type: Number,
        },
        type: {
            type: String,
            default: 'default',
        }
    },
    computed: {
        isActive() {
            return (index, current, name) => {
                switch (name) {
                    case 'earse':
                    case 'clear':
                    case 'undo':
                    case 'redo':
                        return false;
                    default:
                        return index == current;
                }
            }
        },
        colorStyle() {
            return (color) => {
                return {
                    'background-color': color,
                }
            }
        },
        levelClass() {
            return `lv${this.level + 1}`;
        },
        rangeStyle() {
            return (tool) => {
                const { min, max, value } = tool;
                let fMin = parseFloat(min);
                let fMax = parseFloat(max);
                let fValue = parseFloat(value) - fMin;
                let unit = (fMax - fMin) / 100;
                let point = fValue / unit;

                return `background: -webkit-linear-gradient(left ,#686868 0%,#686868 ${point}%,#393939 ${point}%, #393939 100%)`;
            }
        },
    },
    methods: {
        handleTools(name, index) {
            this.$emit('handle-tools', this.level, name, index);
        },
        pickColor(index) {
            this.$emit('pick-color', this.level, index);
        },
        inputChange(e, tool) {
            let value = e.target.value;
            tool.value = value;
            this.$emit('value-change', tool.name, parseFloat(value));
        },
    },
}

export default {
    name: 'edit-picture-compon',
    template,
    components: {
        'float-dialog': floatDialogSlotCompon,
        'control-panel': controlPanelCompon,
    },
    data() {
        return {
            type: 2,
            showReturnBtn: true,
            returnBtnText: '取消',
            showNextBtn: true,
            nextBtnText: '儲存',
            elementID: 'edit-picture',
            titleText: '照片編輯',
            loading: true,
            url: '',
            menu: [
                {
                    name: 'drag',
                    svg: svgList.drag,
                },
                {
                    name: 'brightness',
                    svg: svgList.brightness,
                    type: 'range',
                    menu: [
                        {
                            name: 'brightness',
                            text: '亮度',
                            value: 0,
                            step: 0.05,
                            max: 1,
                            min: -1,
                        },
                        {
                            name: 'contrast',
                            text: '對比',
                            value: 0,
                            step: 0.05,
                            max: 1,
                            min: -1,
                        },
                    ],
                },
                {
                    name: 'rotate',
                    svg: svgList.rotate,
                    type: 'default',
                    current: null,
                    menu: [
                        {
                            name: 'rotate90',
                            svg: svgList.retato90,
                        },
                        {
                            name: 'flipX',
                            svg: svgList.flipX,
                        },
                        {
                            name: 'flipY',
                            svg: svgList.flipY,
                        },
                    ],
                },
                {
                    name: 'stamp',
                    svg: svgList.stamp,
                    type: 'default',
                    current: 0,
                    menu: [
                        {
                            name: 'thumbsUp',
                            svg: svgList.thumbsUp,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                        {
                            name: 'bolt',
                            svg: svgList.bolt,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                        {
                            name: 'interrogation',
                            svg: svgList.interrogation,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                        {
                            name: 'megaphone',
                            svg: svgList.megaphone,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                        {
                            name: 'cross',
                            svg: svgList.cross,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                        {
                            name: 'exclamation',
                            svg: svgList.exclamation,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                    ],
                },
                {
                    name: 'graphics',
                    svg: svgList.graphics,
                    type: 'default',
                    current: 0,
                    menu: [
                        {
                            name: 'arrow',
                            svg: svgList.arrow,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                        {
                            name: 'dashArrow',
                            svg: svgList.dashArrow,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                        {
                            name: 'rectangle',
                            svg: svgList.rect,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                        {
                            name: 'circle',
                            svg: svgList.circle,
                            type: 'color',
                            current: 0,
                            menu: [
                                '#FFFFFF',
                                '#FF1D1D',
                                '#FF973B',
                                '#3FD881',
                                '#60AFFF',
                            ]
                        },
                    ]
                },
                {
                    name: 'draw',
                    svg: svgList.draw,
                    type: 'color',
                    current: 0,
                    menu: [
                        '#FFFFFF',
                        '#FF1D1D',
                        '#FF973B',
                        '#3FD881',
                        '#60AFFF',
                    ]
                },
                {
                    name: 'text',
                    svg: svgList.text,
                    type: 'color',
                    current: 0,
                    menu: [
                        '#FFFFFF',
                        '#FF1D1D',
                        '#FF973B',
                        '#3FD881',
                        '#60AFFF',
                    ]
                },
                {
                    name: 'earse',
                    svg: svgList.earse,
                },
                {
                    name: 'clear',
                    svg: svgList.clear,
                },
                {
                    name: 'undo',
                    svg: svgList.undo,
                },
                {
                    name: 'redo',
                    svg: svgList.redo,
                },
            ],
            canvas: null,
            fabricHistoryJson: [],
            idx: [],
            currentTool: null,
            doDrawing: false,
            mouseFrom: {},
            mouseTo: {},
            mods: -1,
            moveCount: 1,
            drawingObject: null,
            offsetX: 20,
            offsetY: 20,
            drawWidth: 2,
            // 拖拉平移用
            onTouchMove: false,
            dragging: false,
            canvasRect: {},
            // 濾鏡變更
            onFiltersChange: false,
            // 照片裁切旋轉映射
            onImgChange: false,
        }
    },
    computed: {
        panelArray() {
            let array = [{
                menu: this.menu,
                type: 'default',
                current: this.idx[0],
            }];

            this.idx.reduce((target, val) => {
                if (target[val]?.menu) {
                    let obj = {
                        menu: target[val].menu,
                        current: target[val].current,
                        type: target[val].type,
                    }
                    array.push(obj);
                    return target[val].menu;
                }
            }, this.menu);
            return array;
        },
        subPanelStyle() {
            switch (this.currentTool) {
                case 'brightness':
                    return 'bar';
                case 'stamp':
                    return 'bigIcon';
            }
        },
        group1() {
            return this.canvas.getObjects()[0];
        },
        image() {
            return this.group1.getObjects()[0];
        },
        flipRect() {
            return this.canvas.getObjects().find(e => e.id == 'flipRect');
        },
        shade() {
            return this.canvas.getObjects().find(e => e.id == 'shade');
        },
        filterMenu() {
            return this.menu.find(i => i.name == 'brightness');
        }
    },
    methods: {
        setEvent() {
            this.canvas.on({
                'mouse:wheel': (opt) => {
                    if (this.currentTool == 'rotate') {
                        return;
                    }
                    const getNewZoom = (curVal, dir) => {
                        let arr = [0.5, 0.8, 1, 1.2, 1.5, 2, 2.5];
                        let index = 0;
                        let min;
                        arr.forEach((v, i) => {
                            let minus = Math.abs(curVal - v);
                            if (i == 0) min = minus;
                            if (i > 0 && minus < min) {
                                min = minus;
                                index = i;
                            }
                        });

                        if (index > 0 && index < 6) {
                            return arr[index + dir];
                        }
                        if (index == 0) {
                            return arr[index + (dir > 0 ? dir : 0)];
                        }
                        if (index == 6) {
                            return arr[index + (dir < 0 ? dir : 0)];
                        }
                    }
                    const e = opt.e;
                    let direct = e.deltaY > 0 ? -1 : 1;
                    let newZoom = getNewZoom(this.canvas.getZoom(), direct);
                    this.canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, newZoom);
                    this.boundingCheck(e.target);
                },
                'mouse:down': (opt) => {
                    this.onTouchMove = false;
                    // 移除
                    if (this.currentTool == 'earse' && opt.target) {
                        let target = this.findGroupChild(this.group1, opt.absolutePointer);
                        if (target) {
                            this.group1.remove(target);
                            this.canvas.renderAll();
                            this.updateModifications();
                        }
                        return;
                    }

                    const e = opt.e;
                    const et = e.type.includes('mouse');
                    const { clientX, clientY } = et ? e : e.touches[0];
                    this.canvasRect = e.target.getBoundingClientRect();
                    const { x: canX, y: canY } = this.canvasRect;
                    if (et) {
                        this.onMouseDown({ clientX, clientY, canX, canY });
                    } else {
                        // 是觸控等待是否是雙指縮放
                        setTimeout(() => {
                            if (!this.onTouchMove) this.onMouseDown({ clientX, clientY, canX, canY });
                        }, 100);
                    }
                },
                'mouse:up': async () => {
                    // 平移
                    if (this.currentTool == 'drag') {
                        this.dragging = false;
                        return;
                    }

                    let drawTool = [
                        'line',
                        'arrow',
                        'dashArrow',
                        'rectangle',
                        'circle',
                    ];
                    if (drawTool.includes(this.currentTool)) {
                        this.updateModifications();
                        this.drawingObject = null;
                    }
                    this.doDrawing = false;
                    this.moveCount = 1;
                },
                'mouse:move': (opt) => {
                    const e = opt.e;
                    const et = e.type.includes('mouse');
                    const { clientX, clientY } = et ? e : e.touches[0];
                    const { width: canWidth, height: canHeight, x: canX, y: canY } = this.canvasRect;
                    // 手勢縮放
                    if (!et && e.touches.length > 1 && !this.dragging) {
                        if (this.moveCount % 2) {
                            this.moveCount++;
                            return;
                        } else {
                            this.moveCount++;
                            this.onGesture({
                                touches: e.touches,
                                canX,
                                canY,
                                target: e.target,
                            });
                            return;
                        }
                    }

                    // 平移
                    if (this.dragging) {
                        if (this.moveCount % 2) {
                            this.moveCount++;
                            return;
                        } else {
                            this.onDrgging({
                                clientX,
                                clientY,
                                canWidth,
                                canHeight
                            });
                            return;
                        }
                    }

                    if (!this.doDrawing) {
                        return;
                    }
                    if (this.doDrawing && this.moveCount % 2) {
                        this.moveCount++;
                        return;
                    }

                    const toolArr = [
                        'line',
                        'arrow',
                        'dashArrow',
                        'rectangle',
                        'circle'
                    ];

                    if (toolArr.includes(this.currentTool)) {
                        this.moveCount++;
                        let offsetX = clientX - canX;
                        let offsetY = clientY - canY;
                        const { x, y } = this.transformMouse(offsetX, offsetY);
                        this.mouseTo.x = x;
                        this.mouseTo.y = y;
                        this.drawing();
                    }
                },
                // 裁切矩形強制focus
                'selection:cleared': () => {
                    const list = ['rotate', 'rotate90', 'flipX', 'flipY'];
                    if (list.includes(this.currentTool) && this.flipRect) {
                        this.canvas.setActiveObject(this.flipRect);
                    }
                },
                // 文字輸入
                'text:changed': (opt) => {
                    // 強制更新觸發游標移動
                    this.textboxObj.set({ text: opt.target.text + ' ' });
                    this.canvas.renderAll();
                },
                // free drawing object created
                'path:created': ({ path }) => {
                    this.freeDrawProcess(path);
                },
                // 裁切區變更
                // FIXME: 反向出界
                'object:scaling': (opt) => {
                    const target = opt.target;
                    const zoom = this.canvas.viewportTransform[0];
                    let { left: gl, top: gt, width: gw, height: gh } = this.group1.getBoundingRect();
                    let fix_p = this.transformMouse(gl, gt);
                    gl = fix_p.x;
                    gt = fix_p.y;
                    gw = gw / zoom;
                    gh = gh / zoom;

                    const { left: tl, top: tt, width: tw, height: th, scaleX: tsx, scaleY: tsy } = target;
                    const minSize = 100;
                    let setObj = {};
                    // left, top
                    if (tl < gl) setObj['left'] = gl;
                    if (tt < gt) setObj['top'] = gt;
                    // gl + gw = tl + tw * tsx
                    // gt + gh = tt + th * tsy
                    const maxSacleX = (p => {
                        let num = Math.round((gl + gw - p) * 100) / Math.round(tw * 100);
                        return parseFloat(num.toFixed(3));
                    })(setObj.left ?? tl);
                    const maxScaleY = (p => {
                        let num = Math.round((gt + gh - p) * 100) / Math.round(th * 100);
                        return parseFloat(num.toFixed(3));
                    })(setObj.top ?? tt);
                    // 最大
                    if (tsx > maxSacleX) {
                        setObj['scaleX'] = maxSacleX;
                    }
                    if (tsy > maxScaleY) {
                        setObj['scaleY'] = maxScaleY;
                    }
                    // 最小
                    if (tw * tsx < minSize) {
                        setObj['scaleX'] = minSize / tw;
                    }
                    if (th * tsy < minSize) {
                        setObj['scaleY'] = minSize / th;
                    }

                    let path = this.setShade({
                        left: setObj.left ?? tl,
                        top: setObj.top ?? tt,
                        width: tw * (setObj.scaleX ?? tsx),
                        height: th * (setObj.scaleY ?? tsy),
                    });

                    target.set(setObj);
                    target.setCoords();
                    this.canvas.add(path);
                    this.canvas.renderAll();
                    if (!this.onImgChange) this.onImgChange = true;
                },
                // 裁切區移動
                'object:moving': (opt) => {
                    const target = opt.target;
                    const zoom = this.canvas.viewportTransform[0];
                    let { left: gl, top: gt, width: gw, height: gh } = this.group1.getBoundingRect();
                    let fix_p = this.transformMouse(gl, gt);
                    gl = fix_p.x;
                    gt = fix_p.y;
                    gw = gw / zoom;
                    gh = gh / zoom;

                    const { left: tl, top: tt, width: tw, height: th, scaleX: tsx, scaleY: tsy } = target;
                    const width = tw * tsx;
                    const height = th * tsy;

                    let setObj = {};
                    // 邊界檢查
                    if (tl < gl) setObj['left'] = gl;
                    if (tt < gt) setObj['top'] = gt;
                    if (tl + width > gl + gw) setObj['left'] = gl + gw - width;
                    if (tt + height > gt + gh) setObj['top'] = gt + gh - height;

                    let path = this.setShade({
                        left: setObj['left'] ?? tl,
                        top: setObj['top'] ?? tt,
                        width,
                        height,
                    });

                    target.set(setObj);
                    target.setCoords();
                    this.canvas.add(path);
                    this.canvas.renderAll();
                    if (!this.onImgChange) this.onImgChange = true;
                },
                // 'object:modified': (opt) => {
                //     console.log('object:modified');
                // },
            });
        },
        async onMouseDown({ clientX, clientY, canX, canY }) {
            // 平移tool
            if (this.currentTool == 'drag') {
                this.dragging = true;
                this.mouseFrom.x = clientX;
                this.mouseFrom.y = clientY;
                return;
            }

            let offsetX = clientX - canX;
            let offsetY = clientY - canY;
            const { x, y } = this.transformMouse(offsetX, offsetY);
            this.mouseFrom.x = x;
            this.mouseFrom.y = y;

            //清除舊文字輸入框
            if (this.textboxObj) {
                const checkEmpty = (textArr) => {
                    return !textArr.map(text => text.trim().length > 0).includes(true);
                }

                this.textboxObj.exitEditing();
                if (checkEmpty(this.textboxObj.textLines)) {
                    this.group1.remove(this.textboxObj);
                }
                this.textboxObj = null;
                this.updateModifications();
            }
            // 文字編輯
            if (this.currentTool == 'text') {
                this.drawText();
                return;
            }
            this.doDrawing = true;
            // 貼圖
            const svgList = [
                'thumbsUp',
                'bolt',
                'interrogation',
                'megaphone',
                'cross',
                'exclamation'
            ];

            if (svgList.includes(this.currentTool)) {
                let svg = await this.drawSVG(this.currentTool, this.getActiveColor());
                this.group1.add(svg);
                this.canvas.renderAll();
                this.updateModifications();
            }
        },
        // 雙指縮放
        onGesture({ touches, canX, canY, target }) {
            const { clientX: p1x, clientY: p1y } = touches[0];
            const { clientX: p2x, clientY: p2y } = touches[1];
            let distX = Math.abs(p1x - p2x);
            let distY = Math.abs(p1y - p2y);

            if (this.onTouchMove) {
                const { x, y } = this.mouseFrom;
                let value = x + y < distX + distY ? 0.05 : -0.05;
                // 0.5 <> 2.5
                let newZoom = this.canvas.getZoom() + value;
                if (newZoom < 0.5) newZoom = 0.5;
                if (newZoom > 2.5) newZoom = 2.5;

                let point = {
                    x: (p1x + p2x) / 2 - canX,
                    y: (p1y + p2y) / 2 - canY,
                };
                this.canvas.zoomToPoint(point, newZoom);
                this.boundingCheck(target);
            } else {
                this.onTouchMove = true;
            }
            this.mouseFrom.x = distX;
            this.mouseFrom.y = distY;
        },
        // 平移
        onDrgging({ clientX, clientY, canWidth, canHeight }) {
            // console.log('onDrgging', canWidth, canHeight);
            let vpt = this.canvas.viewportTransform;
            const { left: gl, top: gt, width: gw, height: gh } = this.clipPathTrans();
            // console.log('clipPathTrans', gl, gt, gw, gh);
            const moveX = clientX - this.mouseFrom.x;
            const moveY = clientY - this.mouseFrom.y;
            this.mouseFrom.x = clientX;
            this.mouseFrom.y = clientY;
            const limitValue = 3;
            const limitWidth = canWidth / limitValue;
            const limitHeight = canHeight / limitValue;
            const newLeft = gl * vpt[0] + moveX + vpt[4];
            const newTop = gt * vpt[0] + moveY + vpt[5];

            let case1 = (newLeft + gw * vpt[0]) < limitWidth;
            let case2 = newLeft > (canWidth - limitWidth);
            let case3 = (newTop + gh * vpt[0]) < limitHeight;
            let case4 = newTop > (canHeight - limitHeight);
 
            if (case1 || case2 || case3 || case4) return;

            vpt[4] += moveX;
            vpt[5] += moveY;

            this.canvas.setViewportTransform(vpt);
            this.group1.setCoords();
            this.group1.clipPath.setCoords();
        },
        // 縮放後邊界檢查
        boundingCheck(target) {
            let vpt = this.canvas.viewportTransform;
            this.canvas.setViewportTransform(vpt);
            this.group1.setCoords();
            this.group1.clipPath.setCoords();
            // 邊界檢查
            const { width: canWidth, height: canHeight } = target.getBoundingClientRect();
            const { left: gl, top: gt, width: gw, height: gh } = this.clipPathTrans();
            let case1 = gl < gw / 3 * -1;
            let case2 = gl + gw > canWidth + gw / 3;
            let case3 = gt < gh / 3 * -1;
            let case4 = gt + gh > canHeight + gh / 3;
            if (case1) vpt[4] -= gl + gw / 3;
            if (case2) vpt[4] -= gl + gw - canWidth - gw / 3;
            if (case3) vpt[5] -= gt + gh / 3;
            if (case4) vpt[5] -= gt + gh - canHeight - gh / 3;
            this.canvas.setViewportTransform(vpt);
            this.group1.setCoords();
            this.group1.clipPath.setCoords();
        },
        updateModifications() {
            let log = {
                json: JSON.stringify(this.canvas),
                filterValue: this.filterMenu.menu.map(f => f.value),
            }
            this.fabricHistoryJson.push(log);
            this.mods++;
        },
        transformMouse(mouseX, mouseY) {
            const [zoom, , , , tx, ty] = this.canvas.viewportTransform;
            return { x: mouseX / zoom - tx / zoom, y: mouseY / zoom - ty / zoom };
        },
        // 找移除物件
        findGroupChild(group, point) {
            const { x, y } = this.transCoords(point);
            let targetList = group.getObjects().filter((obj, i) => {
                if (i > 0) {
                    const { left: l, top: t, width: w, height: h } = obj.getBoundingRect();
                    return l <= x && x <= l + w && t <= y && y <= t + h;
                } else {
                    return false;
                }
            });

            let length = targetList.length;
            if (length && length == 1) {
                return targetList[0];
            } else if (length) {
                let index;
                let min;
                targetList.forEach((obj, i) => {
                    const { width: w, height: h } = obj.getBoundingRect();
                    let size = w * h;
                    if (i == 0 || min > size) {
                        index = i;
                        min = size;
                    }
                });
                return targetList[index];
            } else {
                return false;
            }
        },
        undo() {
            let state = this.fabricHistoryJson;
            if (this.mods > 0) {
                this.mods -= 1;
                this.canvas.clear();
                const { json, filterValue } = state[this.mods];
                this.canvas.loadFromJSON(json, this.setFilterVaule.bind(this, filterValue));
            }
        },
        redo() {
            let state = this.fabricHistoryJson;
            if (this.mods < state.length - 1) {
                this.mods += 1;
                this.canvas.clear();
                const { json, filterValue } = state[this.mods];
                this.canvas.loadFromJSON(json, this.setFilterVaule.bind(this, filterValue));
            }
        },
        setFilterVaule(filterValue) {
            this.filterMenu.menu.forEach((f, i) => {
                f.value = filterValue[i];
                if (i == 0) this.image.filters[0].brightness = filterValue[i];
                if (i == 1) this.image.filters[1].contrast = filterValue[i];
            });
            this.image.applyFilters();
            this.canvas.renderAll();
        },
        resetObj(name) {
            this.canvas.isDrawingMode = false;
            this.canvas.selectable = false;
            this.canvas.selection = false
            this.canvas.skipTargetFind = true;
            this.group1.set({
                evented: false,
            });

            // 清除與裁切group
            const exceptList = ['rotate90', 'flipX', 'flipY'];
            if (this.currentTool == 'rotate' && !exceptList.includes(name)) {
                if (name == 'rotate') {
                    // reset
                    let img = this.group1.getObjects()[0];
                    this.group1.clipPath.set(img.getBoundingRect());
                    this.group1.clipPath.setCoords();
                } else {
                    // cut
                    let { left: fl, top: ft, width: fw, height: fh } = this.flipRect.getBoundingRect();
                    const zoom = this.canvas.viewportTransform[0];
                    let fix_p = this.transformMouse(fl, ft);
                    fl = fix_p.x;
                    ft = fix_p.y;
                    fw = fw / zoom;
                    fh = fh / zoom;
                    const { x, y } = this.transCoords({ x: fl, y: ft });
                    const { width: w, height: h } = this.lengthFix({ width: fw, height: fh });
                    let left = x + (w < 0 ? w : 0);
                    let top = y + (h < 0 ? h : 0);
                    let width = Math.abs(w);
                    let height = Math.abs(h);

                    this.group1.clipPath.set({
                        left,
                        top,
                        width,
                        height,
                    });
                    this.group1.clipPath.setCoords();
                }

                // // 強制更新clipPath
                let badRect = new fabric.Rect({ left: 0, top: 0 });
                this.group1.add(badRect);
                this.group1.remove(badRect);

                if (this.flipRect) {
                    this.canvas.remove(this.flipRect);
                    this.canvas.remove(this.shade);
                }
                this.group1.setCoords();
            }

            // 儲存濾鏡history
            if (this.onFiltersChange && name != 'brightness') {
                this.updateModifications();
                this.onFiltersChange = false;
            }

            // 儲存照片編輯history
            if (this.onImgChange && name != 'rotate') {
                this.updateModifications();
                this.onImgChange = false;
            }

            //清除文字
            if (this.textboxObj) {
                this.textboxObj.exitEditing();
                this.textboxObj = null;
            }
        },
        // 裁切旋轉狀態
        rotateMode() {
            // this.currentZoom = 2;
            this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
            this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            this.group1.setCoords();
            this.group1.clipPath.setCoords();
            this.canvas.selectable = true;
            this.canvas.selection = true;
            this.canvas.skipTargetFind = false;
        },
        // group縮放平移調整
        async setGroupPosition() {
            const canvasWidth = this.$refs.canvasArea.offsetWidth;
            const canvasHeight = this.$refs.canvasArea.offsetHeight;
            const maxWidth = canvasWidth - this.offsetX * 2;
            const maxHeight = canvasHeight - this.offsetY * 2 - 60;
            const { width: gw, height: gh } = this.group1.getBoundingRect();

            if (gw > maxWidth || gh > maxHeight) {
                let direct = gw > maxWidth;
                let zoom = (direct ? maxWidth : maxHeight) / (direct ? gw : gh);
                let point = this.canvas.getVpCenter();
                this.canvas.zoomToPoint(point, zoom);
                this.canvas.setViewportTransform(this.canvas.viewportTransform);
                this.group1.setCoords();

                // 照片位準對齊檢查
                let { left, top } = this.group1.getBoundingRect();
                let vpt = this.canvas.viewportTransform;
                if (direct && left > this.offsetX) {
                    vpt[4] -= left - this.offfsetX;
                    this.canvas.setViewportTransform(vpt);
                    this.group1.setCoords();
                }
                if (!direct && top > this.offsetY) {
                    vpt[5] -= top - this.offsetY;
                    this.canvas.setViewportTransform(vpt);
                    this.group1.setCoords();
                }

                this.group1.clipPath.setCoords();
            }
        },
        handleTools(level, name, index) {
            // console.log(level, name, index);
            this.resetObj(name);

            const pushIndex = () => {
                if (this.idx[level] != index) {
                    let newArr = [];
                    if (level > 0) {
                        let oldArr = this.idx.slice(0);
                        oldArr.splice(level);
                        oldArr.push(index);
                        newArr = oldArr;
                    } else {
                        newArr = [index];
                    }

                    let start = newArr.reduce((t, v, i) => {
                        // 更新
                        if (level == i && i > 0) t.current = v;
                        return t.menu[v];
                    }, this.$data);

                    const childMenu = (arr, target) => {
                        const { menu, current, type } = target;
                        if (menu?.length && current != null && current != undefined) {
                            arr.push(current);
                            let newArr = childMenu(arr, menu[current]);
                            if (type == 'default') {
                                this.currentTool = menu[current].name;
                            }
                            return newArr;
                        } else {
                            this.currentTool = name;
                            return arr;
                        }
                    }

                    this.idx = childMenu(newArr, start);
                }
            }

            switch (name) {
                case 'rotate':
                    this.rotateMode();
                    this.setFlipRect();
                    pushIndex();
                    break;
                case 'rotate90':
                    this.rotateMode();
                    this.rotate90();
                    this.onImgChange = true;
                    break;
                case 'flipX': {
                    this.rotateMode();
                    let angle = this.group1.angle;
                    let target = angle == 90 || angle == 270 ? 'flipY' : 'flipX';

                    this.group1.set({
                        [target]: !this.group1[target],
                    });
                    this.canvas.renderAll();
                    this.onImgChange = true;
                    break;
                }
                case 'flipY': {
                    this.rotateMode();
                    let angle = this.group1.angle;
                    let target = angle == 0 || angle == 180 ? 'flipY' : 'flipX';

                    this.group1.set({
                        [target]: !this.group1[target],
                    });
                    this.canvas.renderAll();
                    this.onImgChange = true;
                    break;
                }
                case 'clear':
                    this.idx = [];
                    this.fabricHistoryJson = [];
                    this.mods = 0;
                    this.currentTool = null;
                    this.canvas.clear();
                    this.filterMenu.menu.forEach(f => f.value = 0);
                    this.loadMap(this.url);
                    break;
                case 'redo':
                    this.idx = [];
                    this.currentTool = null;
                    this.redo();
                    break;
                case 'undo':
                    this.idx = [];
                    this.currentTool = null;
                    this.undo();
                    break;
                case 'draw':
                    pushIndex();
                    this.canvas.isDrawingMode = true;
                    this.canvas.freeDrawingBrush.color = this.getActiveColor();
                    break;
                case 'earse':
                    pushIndex();
                    this.canvas.selection = true;
                    this.canvas.skipTargetFind = false;
                    this.canvas.selectable = true;
                    this.group1.set({
                        evented: true,
                    });
                    this.canvas.renderAll();
                    break;
                case 'graphics':
                    pushIndex();
                    break;
                default:
                    pushIndex();
                    break;
            }
        },
        onPickColor(level, index) {
            this.idx[level] = index;
            this.idx.reduce((target, val, i) => {
                if (i == level) {
                    target.current = index;
                } else {
                    return target.menu[val];
                }
            }, this.$data);

            if (this.currentTool == 'draw') {
                this.canvas.freeDrawingBrush.color = this.getActiveColor();
            }
        },
        // 亮度對比調正
        valueChange(name, value) {
            switch (name) {
                case 'brightness':
                    this.image.filters[0].brightness = value;
                    break;
                case 'contrast':
                    this.image.filters[1].contrast = value;
                    break;
            }
            this.image.applyFilters();
            this.canvas.renderAll();
            this.onFiltersChange = true;
        },
        getActiveColor() {
            let color = this.idx.reduce((target, val) => {
                return target.menu[val];
            }, this.$data);
            return color;
        },
        async drawing() {
            if (this.drawingObject) {
                this.group1.remove(this.drawingObject);
            }

            let fabricObject = null;
            const { x: fx, y: fy } = this.transCoords(this.mouseFrom);
            const { x: tx, y: ty } = this.transCoords(this.mouseTo);

            switch (this.currentTool) {
                case 'line':
                    fabricObject = new fabric.Line([fx, fy, tx, ty], {
                        stroke: this.getActiveColor(),
                        strokeWidth: this.drawWidth,
                    });
                    break;
                case 'arrow':
                    fabricObject = new fabric.Path(this.drawArrow(fx, fy, tx, ty, 15.5, 15.5), {
                        stroke: this.getActiveColor(),
                        fill: "rgba(255,255,255,0)",
                        strokeWidth: this.drawWidth,
                    });
                    break;
                case 'dashArrow':
                    fabricObject = new fabric.Path(this.drawArrow(fx, fy, tx, ty, 15.5, 15.5), {
                        stroke: this.getActiveColor(),
                        fill: "rgba(255,255,255,0)",
                        strokeWidth: this.drawWidth,
                        strokeDashArray: [10, 3],
                    });
                    break;
                case 'rectangle':
                    fabricObject = this.drawRectangle();
                    break;
                case 'circle':
                    fabricObject = this.drawCircle();
                    break;
                default:
                    break;
            }

            if (fabricObject) {
                this.group1.add(fabricObject);
                this.canvas.renderAll();
                this.drawingObject = fabricObject;
            }
        },
        drawArrow(fromX, fromY, toX, toY, theta = 30, headlen = 10) {
            let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
                angle1 = (angle + theta) * Math.PI / 180,
                angle2 = (angle - theta) * Math.PI / 180,
                topX = headlen * Math.cos(angle1),
                topY = headlen * Math.sin(angle1),
                botX = headlen * Math.cos(angle2),
                botY = headlen * Math.sin(angle2);
            let arrowX = fromX - topX,
                arrowY = fromY - topY;
            let path = " M " + fromX + " " + fromY;
            path += " L " + toX + " " + toY;
            arrowX = toX + topX;
            arrowY = toY + topY;
            path += " M " + arrowX + " " + arrowY;
            path += " L " + toX + " " + toY;
            arrowX = toX + botX;
            arrowY = toY + botY;
            path += " L " + arrowX + " " + arrowY;
            return path;
        },
        drawDoshedLine() {
            const { x: fx, y: fy } = this.transCoords(this.mouseFrom);
            const { x: tx, y: ty } = this.transCoords(this.mouseTo);

            return new fabric.Line([fx, fy, tx, ty], {
                strokeDashArray: [10, 3],
                stroke: this.getActiveColor(),
                strokeWidth: this.drawWidth
            })
        },
        drawRectangle() {
            const { x: left, y: top } = this.transCoords(this.mouseFrom);
            const { width, height } = this.lengthFix({
                width: this.mouseTo.x - this.mouseFrom.x,
                height: this.mouseTo.y - this.mouseFrom.y
            }, this.group1);

            return new fabric.Rect({
                left,
                top,
                width,
                height,
                fill: "transparent",
                stroke: this.getActiveColor(),
                strokeWidth: this.drawWidth
            });
        },
        drawCircle() {
            const { x: tx, y: ty } = this.mouseTo;
            const { x: fx, y: fy } = this.mouseFrom;
            let radius = Math.sqrt((tx - fx) * (tx - fx) + (ty - fy) * (ty - fy)) / 2;
            const { x: left, y: top } = this.transCoords(this.mouseFrom);

            return new fabric.Circle({
                left,
                top,
                stroke: this.getActiveColor(),
                fill: "rgba(255, 255, 255, 0)",
                originX: 'center',
                originY: 'center',
                radius: radius,
                strokeWidth: this.drawWidth
            });
        },
        drawSVG(tool, color) {
            const { x: left, y: top } = this.transCoords(this.mouseFrom);
            const { flipX, flipY, angle } = this.group1;
            const rotation = ((t) => t == 1 || t == 3)(Math.floor(angle / 90));
            return new Promise(resolve => {
                fabric.loadSVGFromString(svgList[tool], objects => {
                    let group = new fabric.Group(objects, {
                        left,
                        top,
                        flipX: rotation ? flipY : flipX,
                        flipY: rotation ? flipX : flipY,
                    });

                    if (group.width > group.height) {
                        group.scaleToWidth(30);
                    } else {
                        group.scaleToHeight(30);
                    }
                    if (angle > 0) group.rotate(angle * -1);
                    group.getObjects().forEach(path => {
                        path.set({
                            fill: color,
                        });
                    });

                    resolve(group);
                });
            });
        },
        drawText(target = this.group1) {
            const { x: left, y: top } = this.transCoords(this.mouseFrom);
            const { flipX: fx, flipY: fy, angle } = this.group1;
            const rotation = ((t) => t == 1 || t == 3)(Math.floor(angle / 90));
            let flipX = fx && !rotation || fy && rotation || fx && fy;
            let flipY = fy && !rotation || fx && rotation || fx && fy;
            let originX = flipX ? 'right' : 'left';

            this.textboxObj = new fabric.IText(" ", {
                left,
                top,
                angle: rotation ? angle * -1 : angle,
                flipX,
                flipY,
                originX,
                fontSize: 30,
                fill: this.getActiveColor(),
            });

            target.add(this.textboxObj);
            this.textboxObj.enterEditing();
            this.textboxObj.hiddenTextarea.focus();
            this.updateModifications(true);
        },
        async rotate90(positive = 1) {
            let angle = (this.group1.angle + positive * 90) % 360;
            this.group1.rotate(angle);
            this.group1.setCoords();
            await this.setGroupPosition();
            this.flipRect.setCoords();

            // 檢查裁切區
            let { left: gl, top: gt, width: gw, height: gh } = this.group1.getBoundingRect();
            let { left: fl, top: ft, width: fw, height: fh } = this.flipRect.getBoundingRect();

            // left
            if (fl < gl) {
                fl = gl;
                if (fw > gw) {
                    fw = gw;
                }
            } else if (fl + fw > gl + gw) {
                if (fw > gw) {
                    fl = gl;
                    fw = gw;
                } else {
                    fl = gl + gw - fw;
                }
            }
            // top
            if (ft < gt) {
                ft = gt;
                if (fh > gh) {
                    fh = gh;
                }
            } else if (ft + fh > gt + gh) {
                if (fh > gh) {
                    fh = gh;
                    ft = gt;
                } else {
                    ft = gh + gt - fh;
                }
            }

            const vptWhFix = (wh) => {
                const zoom = this.canvas.getZoom();
                return {
                    width: wh.width / zoom,
                    height: wh.height / zoom,
                };
            }

            let fix_p = this.transformMouse(fl, ft);
            let fix_wh = vptWhFix({ width: fw, height: fh });

            this.flipRect.set({
                left: fix_p.x,
                top: fix_p.y,
                width: fix_wh.width,
                height: fix_wh.height,
                scaleX: 1,
                scaleY: 1,
            });
            this.flipRect.setCoords();

            let path = this.setShade({
                left: fix_p.x,
                top: fix_p.y,
                width: fix_wh.width,
                height: fix_wh.height,
            });

            this.canvas.add(path);
            this.canvas.renderAll();
        },
        // canvas座標轉group座標
        transCoords(point, toGroupCoords = true) {
            const { x, y } = this.group1.getCenterPoint();
            const { flipX, flipY, angle } = this.group1;
            // origin center
            //    3 | 4
            //  ---------
            //    2 | 1
            // ++, -+, --, +-,
            // angle 0: 1, 1
            // angle 90: -1, 1 , x <> y
            // angle 180: -1, -1
            // angel 270: 1, -1, x <> y
            // flipX: -1, 1
            // flipY: 1, -1
            const coordsFix = (point) => ({ x: point.x - x, y: point.y - y });
            const angleFix = (point, type) => {
                let arr = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
                const rotation = type == 1 || type == 3;
                let x = arr[type][0] * point.x;
                let y = arr[type][1] * point.y;
                return {
                    x: rotation ? y : x,
                    y: rotation ? x : y,
                }
            };
            const flipFix = (point, fx, fy) => {
                return {
                    x: point.x * (fx ? -1 : 1),
                    y: point.y * (fy ? -1 : 1),
                }
            }
            let point_fix = toGroupCoords ? coordsFix(point) : point;
            point_fix = angleFix(point_fix, Math.floor(angle / 90));
            point_fix = flipFix(point_fix, flipX, flipY);
            return point_fix;
        },
        // canvas座標轉group座標
        lengthFix(wh, target = this.group1, options = { angle: true, flip: true }) {
            const { flipX, flipY, angle } = target;
            const angleFix = (wh, type) => {
                const arr = [[1, 1], [-1, 1], [-1, -1], [1, -1]];
                const rotation = type == 1 || type == 3;
                let fw = arr[type][0] * wh.width;
                let fh = arr[type][1] * wh.height;
                return {
                    width: rotation ? fh : fw,
                    height: rotation ? fw : fh,
                }
            };
            const flipFix = (wh, fx, fy) => {
                return {
                    width: wh.width * (fx ? -1 : 1),
                    height: wh.height * (fy ? -1 : 1),
                }
            }
            let wh_fix = wh;
            if (options.angle) wh_fix = angleFix(wh_fix, Math.floor(angle / 90));
            if (options.flip) wh_fix = flipFix(wh_fix, flipX, flipY);
            return wh_fix;
        },
        freeDrawProcess(freeDrawObj) {
            const { x: left, y: top } = this.transCoords({ x: freeDrawObj.left, y: freeDrawObj.top });
            const { flipX: fx, flipY: fy, angle } = this.group1;
            const rotation = (t => t == 1 || t == 3)(Math.floor(angle / 90));
            let flipX = fx && !rotation || fy && rotation || fx && fy;
            let flipY = fy && !rotation || fx && rotation || fx && fy;
            let originX = fx && !rotation || fy && rotation ? 'right' : 'left';
            let originY = fy && !rotation || fx && rotation ? 'bottom' : 'top';

            freeDrawObj.set({
                left,
                top,
                angle: rotation ? angle * -1 : angle,
                flipX,
                flipY,
                originX,
                originY,
            });

            this.group1.add(freeDrawObj);
            freeDrawObj.setCoords();
            this.canvas.remove(freeDrawObj);
            this.canvas.renderAll();
            this.updateModifications();
        },
        // group clipPath座標轉canvas座標
        clipPathTrans(target = this.group1) {
            const { left: pl, top: pt, width: pw, height: ph } = target.clipPath.getBoundingRect();
            const { flipX, flipY, angle } = target;
            const type = Math.floor(angle / 90);
            const vpt = target.getViewportTransform();

            const vptFix = (point, vpt) => {
                const [zx, , , zy, dx, dy] = vpt;
                return {
                    x: point.x / zx - (dx / zx),
                    y: point.y / zy - (dy / zy),
                }
            }
            const pointFlipFix = (point, fx, fy) => {
                return {
                    x: point.x * (fx ? -1 : 1),
                    y: point.y * (fy ? -1 : 1),
                }
            };
            const angleFix = (point, type) => {
                const arr = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
                const rotation = type == 1 || type == 3;
                let x = arr[type][0] * point.x;
                let y = arr[type][1] * point.y;
                return {
                    x: rotation ? y : x,
                    y: rotation ? x : y,
                }
            };
            const coordsFix = (point) => {
                const { x: cx, y: cy } = target.getCenterPoint();
                return {
                    x: (point.x + cx),
                    y: (point.y + cy),
                };
            };

            const whFix = (wh, type) => {
                const arr = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
                const rotation = type == 1 || type == 3;
                let w = arr[type][0] * wh.w;
                let h = arr[type][1] * wh.h;
                return {
                    w: rotation ? h : w,
                    h: rotation ? w : h,
                }
            };
            const lengthFlipFix = (wh, fx, fy) => {
                return {
                    w: wh.w * (fx ? -1 : 1),
                    h: wh.h * (fy ? -1 : 1),
                }
            };
            const zoomFix = (wh, zoom) => {
                return {
                    w: wh.w / zoom,
                    h: wh.h / zoom,
                };
            }

            let p_fix = { x: pl, y: pt };
            p_fix = vptFix(p_fix, vpt);
            p_fix = pointFlipFix(p_fix, flipX, flipY);
            p_fix = angleFix(p_fix, type);
            p_fix = coordsFix(p_fix);

            let wh_fix = { w: pw, h: ph };
            wh_fix = lengthFlipFix(wh_fix, flipX, flipY);
            wh_fix = whFix(wh_fix, type);
            wh_fix = zoomFix(wh_fix, vpt[0]);

            let left = p_fix.x + (wh_fix.w < 0 ? wh_fix.w : 0);
            let top = p_fix.y + (wh_fix.h < 0 ? wh_fix.h : 0);
            let width = Math.abs(wh_fix.w);
            let height = Math.abs(wh_fix.h);
            return { left, top, width, height };
        },
        async setFlipRect() {
            await this.setGroupPosition();
            const bounding = this.clipPathTrans();

            let rect = new fabric.Rect({
                ...bounding,
                fill: "transparent",
                strokeWidth: 0,
                selectable: true,
                hasBorders: true,
                hasControls: true,
                borderColor: 'black',
                cornerColor: 'black',
                transparentCorners: false,
                cornerSize: 15,
                borderScaleFactor: 2,
                id: 'flipRect',
            });

            rect.setControlsVisibility({
                // ml: false,
                // mb: false,
                // mr: false,
                // mt: false,
                mtr: false,
            });

            this.canvas.add(rect).setActiveObject(rect);
            rect.setCoords();

            this.canvas.add(this.setShade({ ...bounding }));

            let img = this.group1.getObjects()[0];
            this.group1.clipPath.set(img.getBoundingRect());
            this.group1.clipPath.setCoords();
            // 強制更新clipPath
            let badRect = new fabric.Rect({ left: 0, top: 0 });
            this.group1.add(badRect);
            this.group1.remove(badRect);
            this.canvas.renderAll();
        },
        setShade({ left, top, width, height } = {}) {
            if (this.shade) this.canvas.remove(this.shade);
            const vpt = this.canvas.viewportTransform;
            let cw = this.canvas.width / vpt[0];
            let ch = this.canvas.height / vpt[0];
            let ox = vpt[4] / vpt[0];
            let oy = vpt[5] / vpt[0];

            let d = `M-${ox} -${oy} h${cw} v${ch} h-${cw}z M${left} ${top} v${height} h${width} v-${height}z`;

            return new fabric.Path(d, {
                fill: 'rgba(145, 145, 145, 0.7)',
                id: 'shade',
                selectable: false,
                evented: false,
                selection: false,
            });
        },
        loadMap(url) {
            return new Promise((resolve) => {
                fabric.Image.fromURL(url, (img) => {
                    const pictH = img.width;
                    const pictW = img.height;
                    const canvasWidth = this.$refs.canvasArea.offsetWidth;
                    const canvasHeight = this.$refs.canvasArea.offsetHeight;
                    const maxWidth = canvasWidth - this.offsetX * 2;
                    const maxHeight = canvasHeight - this.offsetY * 2 - 60;
                    let left, top;
                    if (pictH > pictW) {
                        // 直向
                        img.scaleToHeight(maxHeight);
                        if (img.getScaledWidth() > maxWidth) {
                            img.scaleToWidth(maxWidth);
                            left = this.offsetY;
                            top = (canvasHeight - img.getScaledHeight()) / 2;
                        } else {
                            left = (canvasWidth - img.getScaledWidth()) / 2;
                            top = this.offsetY;
                        }
                    } else {
                        // 橫向 or 正方
                        img.scaleToWidth(maxWidth);
                        if (img.getScaledHeight() > maxHeight) {
                            img.scaleToHeight(maxHeight);
                            left = (canvasWidth - img.getScaledWidth()) / 2;
                            top = this.offsetY;
                        } else {
                            left = this.offsetX;
                            top = (canvasHeight - img.getScaledHeight()) / 2;
                        }
                    }

                    img.set({
                        left,
                        top,
                        selectable: false,
                        evented: false,
                    });

                    const f = fabric.Image.filters;
                    img.filters = [
                        new f.Brightness({ brightness: 0 }),
                        new f.Contrast({ contrast: 0 }),
                    ];
                    img.applyFilters();

                    let group = new fabric.Group([img], {
                        selectable: false,
                        evented: false,
                        selection: false,
                    });
                    group.clipPath = new fabric.Rect({
                        strokeWidth: 0,
                        ...img.getBoundingRect()
                    });
                    this.canvas.add(group);

                    this.updateModifications();
                    resolve(true);
                });
            });
        },
        resizeCanvas() {
            let width = this.$refs.canvasArea.offsetWidth;
            let height = this.$refs.canvasArea.offsetHeight;
            this.canvas?.setDimensions({ width, height });
            this.canvas?.renderAll();
        },
        filterBackendInit() {
            fabric.textureSize = 4096;
            fabric.filterBackend = fabric.initFilterBackend();
            let webglBackend;
            try {
                webglBackend = new fabric.WebglFilterBackend();
                fabric.filterBackend = webglBackend;
            } catch (e) {
                fabric.filterBackend = new fabric.Canvas2dFilterBackend();
            }
        },
        output() {
            if (this.currentTool == 'rotate') {
                this.handleTools(0, 'drag', 0);
            }

            this.canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
            this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
            this.group1.setCoords();
            this.group1.clipPath.setCoords();
            
            let bounding = this.clipPathTrans();
            let multiplier = 1;
            if (Math.max(bounding.width, bounding.height) < 400) {
                multiplier = 1.5;
            }

            return this.canvas.toDataURL({
                ...bounding,
                multiplier,
                format: 'jpeg',
                quality: 1,
            });
        },
        nextBtnClick() { },
        closeClick() { },
        afterLeave() {
            window.removeEventListener('resize', this.resizeCanvas);
        },
    },
    async mounted() {
        this.canvas = new fabric.Canvas('canvas', {
            isDrawingMode: false,
            devicePixelRatio: true,
        });

        this.canvas.setHeight(this.$refs.canvasArea.offsetHeight);
        this.canvas.setWidth(this.$refs.canvasArea.offsetWidth);
        this.canvas.freeDrawingBrush.width = this.drawWidth;

        this.setEvent();
        this.filterBackendInit();
        window.addEventListener('resize', this.resizeCanvas, false);
        this.url = await this.getUrl;
            await this.loadMap(this.url);
        // set default tool
        this.handleTools(0, 'drag', 0);
        this.loading = false;
        // console.log(this);
    },
}