import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";

var template = /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :showCloseBtn="showCloseBtn"
    :allowBgClick="allowBgClick"
    :bottomShow="bottomShow"
    @nextBtnClick="nextBtnClick"
    ref="dialog"
>
    <div>
        <div>工地走動管理檢查表</div>
        <div
            class="rate-select-area"
        >
            <div>規模權重</div>
            <div>
                <div
                    v-for="(scope, index) in scopeRate"
                    :class="{'active': index == curS}"
                    @click="scopeClick(index)"
                >{{scope}}</div>
            </div>
        </div>
        <div
            class="rate-select-area"
        >
            <div>進度權重</div>
            <div>
                <div
                    v-for="(progress, index) in progressRate"
                    :class="{'active': index == curP}"
                    @click="progressClick(index)"
                >{{progress}}</div>
            </div>
        </div>
    </div>
</float-dialog>
`;

export default {
    name: 'sh-score-rate-compon',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            titleText: '評分設定',
            elementID: 'sh-score-rate-page',
            showCloseBtn: false,
            allowBgClick: true,
            bottomShow: true,
            curS: 1,
            curP: 1,
            scopeRate: ['', '', ''],
            progressRate: ['', '', ''],
            sureCall: () => {},
        }
    },
    methods: {
        nextBtnClick() {
            this.sureCall(_.cloneDeep({
                uid: this.uid,
                select_scope: this.curS,
                select_progress: this.curP,
                shData: this.shData,
            }));
            this.$refs.dialog.onDialogClose();
        },
        scopeClick(index) {
            this.curS = index;
        },
        progressClick(index) {
            this.curP = index;
        }
    }
}