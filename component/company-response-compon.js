import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import template from "../template/company-response-temp";

// 公司端缺失改善回覆
export default {
    name: 'company-response-compon',
    template,
    components: {
        'float-dialog': floatDialog,
        'v-select': VueSelect.VueSelect,
    },
    data() {
        return {
            // dialog
            loading: true,
            elementID: 'company-response-page',
            titleText: '缺失改善回覆',
            bottomShow: true,
            showCloseBtn: false,
            // this
            auditResult: ['結案', '退審'],
            scoreTab: [],
            currentResultTab: 0,
            currentScoreTab: null,
            noteText: '',
            // 0: 安衛, 1: 品質, 2: 技師
            checkitemType: 0,
        };
    },
    methods: {
        resultTabClick(index) {
            this.currentResultTab = index;
        },
        output() {
            return {
                decide: Boolean(!this.currentResultTab),
                score_id: this.currentScoreTab?.uid,
                remark: this.noteText
            };
        },
        check() {
            if (this.checkitemType && !this.currentScoreTab) {
                floatMsgRemind('請選擇回覆內容');
                return false;
            } else {
                return true;
            }
        }
    },
}