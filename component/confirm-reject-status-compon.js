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
    <div>
        <div>
            <div>是否重新指派改善人員： </div>
            <div>{{assignStatusText}}</div>
        </div>
        <div>
            <div>是否保留紀錄內容： </div> 
            <div>{{recordStatusText}}</div>
        </div>
    </div>
</float-dialog>
`

// 確認退審狀態
export default {
    name: 'confirm-reject-status-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            // dialog
            elementID: 'confirm-reject-status-page',
            titleText: '退審狀態確認',
            bottomShow: true,
            showCloseBtn: false,
            assignStatus: 0,
            recordStatus: 0,
        };
    },
    computed: {
        assignStatusText() {
            return this.assignStatus ? '重新指派' : '不重新指派';
        },
        recordStatusText() {
            return this.recordStatus ? '刪除紀錄內容' : '保留紀錄內容';
        }
    },
}