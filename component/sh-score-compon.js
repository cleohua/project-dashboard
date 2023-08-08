import * as callapi from "../callAPI.js";

import fullsizeDialog from "../../../vue/assets/fullsize-dialog-slot-compon.js";
import miniSelectCompon from "./mini-select-compon.js";
import { pageTemp, listTemp } from "../template/sh-score-temp.js";
import edit from "../view/index.js";

var customFullDialog = {
    mixins: [fullsizeDialog],
    methods: {
        returnBtnClick() {
            this.$emit('close');
        }
    }
}

var listCompon = {
    name: 'list-compon',
    template: listTemp,
    props: {
        list: {
            type: Object,
        },
        editMode: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            inputStep: 0.1,
        }
    },
    computed: {
        statusText() {
            return this.list.status == 2 ? '不計' : this.list.status == 1 ? '缺失' : '合格';
        },
        statusClass() {
            return this.list.status == 2 ? 'ignore' : this.list.status == 1 ? 'bad' : 'good';
        },
        listCount() {
            return this.list.report.length ? `(${this.list.report.length})` : '';
        },
        inputEditable() {
            return this.editMode && this.list.report.length && this.list.status != 2;
        },
        inputReadOnly() {
            return !this.editMode || (this.list.report.length && this.list.status == 2);
        },
        inputMini() {
            // 缺失可扣分
            return this.list.status == 1 ? this.list.limit * -1 : 0;
        }
    },
    methods: {
        viewRecord(report) {
            if (report.length) {
                this.$emit('view-record', report);
            }
        },
        statusClick() {
            if (!this.editMode) return;
            // 0: 合格、 1: 缺失, 2: 不計
            let status = this.list.status + 1;
            if (status == 3) status = 0;
            if (status == 1 && !this.list.report.length) {
                // 未記錄僅有合格與不計兩種
                status = 2;
            }
            if (status == 2) this.list.point = 0;
            this.list.status = status;
        },
        valueCheck($event) {
            let str = $event.target.value;

            if (str.length) {
                let number = parseFloat(str);
                let limit = this.list.limit * -1;
                if (this.list.status == 1 && limit > number) {
                    number = limit;
                } else if (this.list.status != 1 && number < 0) {
                    number = 0;
                }
                this.list.point = number;
            }
        },
        blur($event) {
            if (!$event.target.value) this.list.point = 0;
        }
    },
}

export default {
    name: 'sh-score-compon',
    template: pageTemp,
    components: {
        'full-size': customFullDialog,
        'mini-select': miniSelectCompon,
        'list-compon': listCompon,
    },
    data() {
        return {
            // dialog
            titleText: '建立安衛評分記錄',
            nextBtnText: '儲存',
            loading: true,
            elementID: 'sh-score-page',
            // content
            editMode: true,
            name: '',
            point: '86',
            scope_rate: ['', '', ''],
            progress_rate: ['', '', ''],
            select_scope: 1,
            select_progress: 1,
            content: [],
            miniSelectShow: false,
            dataChange: false,
            searchText: '',
            currentType: 0,
        };
    },
    computed: {
        minus() {
            let point = this.content.reduce((p, unit) => {
                let p1 = unit.list.reduce((p, list) => {
                    if (list.point) p += parseFloat(list.point);
                    return p;
                }, p);
                return p1;
            }, 0);
            return point.toFixed(1);
        },
        minusText() {
            return this.minus > 0 ? `+${this.minus}` : `${this.minus}`;
        },
        score() {
            let sRate = parseFloat(this.scopeRateText);
            let pRate = parseFloat(this.progressRateText);
            let point = parseInt(this.point);
            let sum = Math.round((point + this.minus * sRate * pRate) * 10) / 10;
            return sum > 0 ? sum : 0;
        },
        scopeRateText() {
            return this.scope_rate[this.select_scope];
        },
        progressRateText() {
            return this.progress_rate[this.select_progress];
        },
        typeList() {
            let list = this.content.map((type, i) => ({ text: type.typeName, index: i + 1 }));
            return [{ text: '所有類別', index: 0 }, ...list];
        },
        typeText() {
            return this.typeList[this.currentType]['text'];
        },
        currentUnit() {
            let str = this.searchText;

            const listMatch = (list) => {
                let include = false;

                list.forEach(l => {
                    if (!str || l.name.includes(str)) {
                        l.show = true;
                        if (!include) include = true;
                    } else {
                        l.show = false;
                    }
                });
                return include;
            }

            this.content.forEach((unit, index) => {
                if (this.currentType) {
                    if (this.currentType == index + 1) {
                        unit.show = true;
                        unit.show = listMatch(unit.list);
                    } else {
                        unit.show = false;
                    }
                } else {
                    unit.show = true;
                    unit.show = listMatch(unit.list);
                }
            });

            return this.content;
        },
    },
    methods: {
        typeSelect(index) {
            this.currentType = index;
            this.miniSelectShow = false;
        },
        async viewRecord(uidArr) {
            edit.viewRecordFloat({ paperID: this.uid, recordIdArr: uidArr });
        },
        async nextBtnClick() {
            let content = this.content.map(unit => {
                return unit.list.map(list => {
                    return {
                        status: list.status,
                        point: list.point,
                    }
                });
            });

            let sendData = {
                uid: this.uid,
                'select_scope': this.select_scope,
                'select_progress': this.select_progress,
                content,
            }

            let rsStatus = await callapi.editSHScore(sendData);
            if (rsStatus) {
                this.sureCall();
                this.$refs.dialog.onDialogClose();
            } else {
                floatMsgRemind('新增失敗');
            }
        },
        closeClick() {
            this.$refs.dialog.onDialogClose();
        },
    },

}