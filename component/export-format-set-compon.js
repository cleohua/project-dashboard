import floatDialogSlotCompon from "../../dailyreport/component/float-dialog-slot-compon";

var template = /*html*/ `
<float-dialog
    ref="dialog"
    :elementID="elementID"
    :titleText="titleText"
    :bottomShow="bottomShow"
    :bottomCancelShow="bottomCancelShow"
    :bottomFinishClass="bottomFinishClass"
    :allowBgClick="allowBgClick"
    :showCloseBtn="showCloseBtn"
    @nextBtnClick="nextBtnClick"
>
    <div>
        <div>檔案類型</div>
        <div>
            <div
                v-for="(text, index) in fileOption"
                :key="index"
                @click="curFileOpt = index"
            >
                <div
                    :class="{'selected': curFileOpt == index}"
                ></div>
                <div>{{text}}</div>
            </div>
        </div>
    </div>
    <div>
        <div>改善內容</div>
        <div>
            <div
                v-for="(text, index) in replyOption"
                :key="index"
                @click="curReplyOpt = index"
            >
                <div
                    :class="{'selected': curReplyOpt == index}"
                ></div>
                <div>{{text}}</div>
            </div>
        </div>
    </div>
</float-dialog>`;

export default {
    name: 'export-format-set-compon',
    template,
    components: {
        'float-dialog': floatDialogSlotCompon,
    },
    data() {
        return {
            // dialog
            showCloseBtn: true,
            bottomShow: true,
            allowBgClick: false,
            elementID: 'export-format-set',
            titleText: '套表設定',
            bottomCancelShow: false,
            bottomFinishClass: ['bottom-finish-btn', 'full-size'],
            fileOption: ['Excel', 'PDF'],
            replyOption: ['匯出', '不匯出'],
            curFileOpt: 0,
            curReplyOpt: 0,
        }
    },
}