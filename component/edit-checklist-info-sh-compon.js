import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";

var template = /*html*/ `
<float-dialog
    :elementID="elementID"
    :titleText="titleText"
    :showCloseBtn="showCloseBtn"
    :allowBgClick="allowBgClick"
    :bottomShow="bottomShow"
    @nextBtnClick="nextBtnClick"
    @closeClick="closeClick"
    ref="dialog"
>
    <div>
        <div
            class="dark-theme"
            :class="{'danger': notice.name}"
        >
            <div>名稱</div>
            <div
                type="name"
            >
                <input
                    type="text"
                    v-model="name"
                >
            </div>
        </div>
        <div
            class="dark-theme"
            :class="{'danger': notice.point}"
        >
            <div>基準分</div>
            <div
                type="point"
            >
                <input
                    type="number"
                    min="0"
                    max="100"
                    v-model="point"
                >
                <span>分</span>
            </div>
        </div>
        <div
            class="dark-theme"
            :class="{'danger': notice.scope}"
        >
            <div>規模權重</div>
            <div
                type="rate"
            >
                <div>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        v-model="scope_rate[0]"
                        placeholder="低"
                    >
                </div>
                <div>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        v-model="scope_rate[1]"
                        placeholder="中"
                    >
                </div>
                <div>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        v-model="scope_rate[2]"
                        placeholder="高"
                    >
                </div>
            </div>
        </div>
        <div
            class="dark-theme"
            :class="{'danger': notice.progress}"
        >
            <div>進度權重</div>
            <div
                type="rate"
            >
                <div>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        v-model="progress_rate[0]"
                        placeholder="低"
                    >
                </div>
                <div>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        v-model="progress_rate[1]"
                        placeholder="中"
                    >
                </div>
                <div>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        v-model="progress_rate[2]"
                        placeholder="高"
                    >
                </div>
            </div>
        </div>
    </div>
</float-dialog>
`;

export default {
    name: 'edit-name-sh-comopn',
    template,
    components: {
        'float-dialog': floatDialog,
    },
    data() {
        return {
            elementID: 'edit-checklist-name-sh',
            titleText: '新增自檢表',
            dialogType: 2,
            showCloseBtn: false,
            placeholder: '請輸入群組名稱',
            allowBgClick: false,
            bottomShow: true,
            name: '',
            point: '86',
            scope_rate: ['', '', ''],
            progress_rate: ['', '', ''],
            notice: {
                name: false,
                point: false,
                scope: false,
                projress: false,
            }
        }
    },
    watch: {
        name() {
            if (this.notice.name && this.name.length) this.notice.name = false;
        },
        point() {
            if (this.notice.point && this.point.length) this.notice.point = false;
        },
        scope_rate() {
            if (this.notice.scope && !this.scope_rate.includes('')) this.notice.scope = false;
        },
        progress_rate() {
            if (this.notice.projress && !this.progress_rate.includes('')) this.projress.scope = false;
        },
    },
    methods: {
        check() {
            this.notice['name'] = !this.name.length ? true : false;
            this.notice['point'] = !this.point.length ? true : false;
            this.notice['scope'] = this.scope_rate.includes('');
            this.notice['progress'] = this.progress_rate.includes('');

            return !Object.values(this.notice).includes(true);
        }
    }
}