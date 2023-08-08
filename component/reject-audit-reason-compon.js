import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";

var template = /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :showCloseBtn="showCloseBtn"
    :bottomShow="bottomShow"
    @nextBtnClick="nextBtnClick"
    ref="dialog"
>
    <textarea
    class="reason"
    v-model= "reasonText"
    placeholder="退審原因說明"
    ></textarea>
</float-dialog>
`

// 缺失改善紀錄退審
export default {
    name: 'reject-audit-reason-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'reject-audit-reason-page',
            titleText: '請描述退審原因',
            bottomShow: true,
            showCloseBtn: false,
            reasonText: '',
        };
    },
}