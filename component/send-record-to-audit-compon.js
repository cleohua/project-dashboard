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
    >是否確定提交缺失改善紀錄?</div>
    <div 
        class="string"
    >*此缺失將由指派者進行審核</div>
</float-dialog>
`

// 提交缺失改善報告
export default {
    name: 'send-record-to-audit-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'send-record-to-audit-page',
            titleText: '提示',
            bottomShow: true,
            showCloseBtn: false,
        };
    },
    //或許要代入指派者姓名
}