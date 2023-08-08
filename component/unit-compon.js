import template from "../template/checklist-unit-temp.js";

export default {
    name: 'unit-compon',
    template,
    props: {
        data: {
            type: Object,
        },
        menuShow: {
            type: Number,
        },
        level: {
            type: Number,
            default: 0,
        },
        edit: {
            type: Boolean,
        },
    },
    data() {
        return {
            // 第二階以後預設縮折
            filpDown: this.level < 1,
            onDrag: false,
        };
    },
    computed: {
        menu() {
            let menu = [
                {
                    name: '增加階層',
                    fun: this.trans,
                },
                {
                    name: '新增子項',
                    fun: this.newChild,
                },
                {
                    name: '刪除項目',
                    fun: this.delete,
                },
            ];
            // 階層最多五層
            if (this.data['type'] == 1 && this.data['level'] == 4) {
                menu = menu.slice(2);
            } else if (this.data['type'] == 0) {
                menu = menu.slice(1);
            } else {
                menu.splice(1, 1);
            }

            return menu;
        },
        isMine() {
            return this.menuShow == this.data.keyIndex;
        },
        currentChild() {
            return this.data.child.filter(l => l.show);
        }
    },
    watch: {
        'data.name': function (newVal) {
            if (this.data.danger && newVal.length) this.data.danger = false;
        },
        'data.child': function () {
            this.$nextTick(() => {
                this.filpDown = true;
            });
        }
    },
    methods: {
        filpClick() {
            this.filpDown = !this.filpDown;
        },
        menuClick() {
            this.$emit('menu-click', this.data.keyIndex);
        },
        tagClick() {
            this.$emit('tag-click', this.data.uid);
        },
        // 新子項
        newChild() {
            this.$emit('new', [this.data.keyIndex]);
        },
        // 轉階層
        trans() {
            this.$emit('trans', [this.data.keyIndex]);
        },
        delete() {
            this.$emit('delete', [this.data.keyIndex]);
        },
        onNew(keyArr) {
            keyArr.push(this.data.keyIndex);
            this.$emit('new', keyArr);
        },
        onTrans(keyArr) {
            keyArr.push(this.data.keyIndex);
            this.$emit('trans', keyArr);
        },
        onDelete(keyArr) {
            keyArr.push(this.data.keyIndex);
            this.$emit('delete', keyArr);
        },
        onMenuClick(keyIndex) {
            this.$emit('menu-click', keyIndex);
        },
        onTagClick(uid) {
            this.$emit('tag-click', uid);
        },
        dragStart() {
            this.onDrag = true;
            this.$emit('on-drag-start');
        },
        dragEnd() {
            this.onDrag = false;
        },
        onDragStart() {
            this.$emit('on-drag-start');
        }
    },
}
