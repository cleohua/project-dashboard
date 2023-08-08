
import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import template from "../template/not-assign-bottom-temp";

// 不指派缺失人員由工地主任或副手負責
export default {
    name: 'not-assign-bottom-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'not-assign-bottom-page',
            titleText: '提示',
            bottomShow: true,
            showCloseBtn: false,
        };
    },
    computed: {
        text() {
            // FIXME: 需確認不指派的話要給誰
            return userLoginInfo.userName;
        },
    },
 
}