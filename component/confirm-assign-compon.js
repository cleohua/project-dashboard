import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import template from "../template/confirm-assign-temp.js";

// 確認責任工程師及改善缺失人員
export default {
    name: 'confirm-assign-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'confirm-assign-page',
            titleText: '缺失指派狀況',
            bottomShow: true,
            showCloseBtn: false,
            // this
            checkerData: [],
        };
    },
    computed: {
        checkerText() {
            return this.checkerData.checker[0].text;
        },
    },
}