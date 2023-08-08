import { unitTemp, listTemp } from "../template/checklist-sh-unit-temp.js";

var listCompon = {
    name: 'list-compon',
    template: listTemp,
    props: {
        limit: {
            type: String,
        },
        listData: {
            type: Object,
        },
        edit: {
            type: Boolean,
        }
    },
    methods: {
        removeClick() {
            this.$emit('remove');
        },
        pointChange(e) {
            let val = parseInt(e.target.value);
            if (val < 0) {
                this.listData.point = '0';
            } else if (val > parseInt(this.limit)) {
                this.listData.point = this.limit;
                floatMsgRemind('已超過配分上限');
            }
            this.$emit('pointchange');
        },
        tagClick() {
            this.$emit('tag-click', this.listData.uid);
        },
        inputFocus() {
            this.$emit('input-focus');
        }
    }
}

export default {
    name: 'unit-compon',
    template: unitTemp,
    components: {
        'list-compon': listCompon,
    },
    props: {
        edit: {
            type: Boolean,
            default: true,
        },
        unitData: {
            type: Object,
            default: () => ({ typeName: '', point: '0', list: [], init: true, }),
        },
        limit: {
            type: String,
            default: '100',
        },
        editable: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            keyIndex: this.unitData.list?.length || 0,
            activeList: null,
            unitLimit: '0',
        }
    },
    computed: {
        nameText() {
            return `${this.unitData.typeName} (${this.unitData.point}%)`;
        },

        remindText() {
            return `剩餘可分配 ${this.limit}%`;
        },
        sureText() {
            return this.unitData.init ? '建立' : '修改';
        },
        pointNumberStlye() {
            let rangeInput = this.$refs.rangeInput;
            let w = rangeInput?.offsetWidth || 0;
            let parsent = parseInt(this.unitData.point) / 100;
            let px = w * parsent;
            // 25 > 34
            let offsetX = 9 * parsent;
            return `left: ${px}px;  transform: translateX(-${25 + offsetX}px);`;
        },
        rangeStyle() {
            return `background: -webkit-linear-gradient(left ,#ecce2a 0%,#ecce2a ${this.unitData.point}%,#1A1A1A ${this.unitData.point}%,#1A1A1A 100%)`;
        },
    },
    watch: {
        'unitData.point': function (val) {
            this.unitData.point = parseInt(val) > parseInt(this.limit) ? this.limit : val;
            this.calUnitLimit();
        },
    },
    methods: {
        cancelClick() {
            if (this.unitData.init) {
                this.$emit('remove');
            } else {
                this.unitData.showList = true;
                this.$emit('editfinish');
            }
        },
        sureClick() {
            if (!this.unitData.typeName.length) {
                floatMsgRemind('請輸入類別名稱');
                return;
            }
            if (this.unitData.init) {
                this.unitData.init = false;
            } else {
                let count = 0;
                this.unitData.list.forEach(({ point }) => count += parseInt(point));
                if (count > parseInt(this.unitData.point)) {
                    floatMsgRemind('配分已超過上限，請重新分配');
                    this.unitData.list.forEach(list => list.point = '0');
                }
            }
            this.$emit('editfinish');
            this.unitData.showList = true;
        },
        infoEditClick() {
            this.unitData.showList = false;
            this.$emit('onedit');
            // 確保 point-number-text 位置正確
            this.$nextTick(() => {
                let point = parseInt(this.unitData.point);
                if (point > 0) {
                    this.unitData.point = '0';
                    this.unitData.point = point + '';
                }
            });
        },
        removeClick() {
            this.$emit('remove');
        },
        addList() {
            let listData = {
                name: '輸入新項目名稱',
                point: '0',
                keyIndex: this.keyIndex,
            };
            this.unitData.list.push(listData);
            this.keyIndex++;
        },
        removeList(index) {
            this.unitData.list.splice(index, 1);
            this.calUnitLimit();
        },
        inputFocus(index) {
            this.activeList = index;
            this.calUnitLimit();
        },
        pointChange() {
            this.calUnitLimit();
        },
        calUnitLimit() {
            this.unitLimit = this.unitData.list.reduce((limit, list, index) => {
                if (this.activeList != index) {
                    limit -= parseInt(list.point);
                }
                return limit > 0 ? limit : 0;
            }, parseInt(this.unitData.point)) + '';
        },
        onTagClick(uid) {
            this.$emit('tag-click', uid);
        }
    },
    created() {
        if (this.unitData.list.length) {
            this.calUnitLimit();
        }
    }
}