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
    <div class="audit-option">
        <div
            class="checker-select"
        >
            <div>是否重新指派缺失改善人員</div>
            <v-select
                label="name"
                :options="assignTab"
                v-model="currentAssignTab"
                placeholder="請選擇"
                :reduce="type => type.index"
            >
            </v-select>
        </div>
        <div
            class="status-select"
        >
            <div>是否清除缺失改善記錄內容</div>
            <v-select
                label="name"
                :options="recordTab"
                v-model="currentRecordTab"
                placeholder="請選擇"
                :reduce="type => type.index"
            >
            </v-select>
        </div>
    </div> 
</float-dialog>
`

// 選擇退審狀態
export default {
    name: 'select-reject-status-compon',
    template,
    components: {
        'float-dialog': floatDialog,
        'v-select': VueSelect.VueSelect,
    },
    data() {
        return {
            // dialog
            elementID: 'select-reject-status-page',
            titleText: '退審狀態設定',
            bottomShow: true,
            showCloseBtn: false,
            loading: true,
            // this  
            assignTab: [
                {
                    name: '不重新指派',
                    index: 0,
                },
                {
                    name: '重新指派',
                    index: 1,
                },
            ],
            recordTab: [
                {
                    name: '保留填寫內容',
                    index: 0,
                },
                {
                    name: '刪除填寫內容',
                    index: 1,
                }
            ],
            currentAssignTab: 0,
            currentRecordTab: 0,
        };
    },
   
}