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
    <div 
        class="string-remind"
    >是否設為「通過」並提交缺失回覆?</div>
    <div 
        class="string"
    >*此缺失回覆將送回安保中心審核</div>
</float-dialog>
`

// 卻失改善紀錄通過審核
export default {
    name: 'pass-audit-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'pass-audit-page',
            titleText: '提示',
            bottomShow: true,
            showCloseBtn: false,
        };
    },
}