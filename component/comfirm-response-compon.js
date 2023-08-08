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
    >{{stringRemind}}</div>
    <div 
        class="string"
    >{{string}}</div>
</float-dialog>
`

// 缺失改善回覆確認
export default {
    name: 'confirm-response-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'confirm-response-page',
            titleText: '提示',
            bottomShow: true,
            showCloseBtn: false,
            // this
            decide: true,
        };
    },
    computed: {
        stringRemind() {
            return this.decide ? '是否將此管理紀錄設為「結案」?' : '是否確定將此管理紀錄設為「退審」?';

        },
        string() {
            return this.decide ? '*結案將會通知工地主任、主管與主辦往後將無法再編輯內容!': '*退審將會通知工地主任、主管與主辦';
        }
    },
}