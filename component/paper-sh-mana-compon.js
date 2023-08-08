import * as callapi from "../callAPI.js";

var template = /*html*/ `
<div
    id="sh-mana-page"
    @click="menuShow = null"
    @wheel.stop.prevent="onPageWheel"
>
    <div
        class="checklist-line"
        v-for="list in data"
        :key="list.uid"
        @click="listClick(list.uid)"
    >
        <div>
            <div>{{list.name}}</div>
            <div>
                <div></div>
                <div>{{list.checklist_name}}</div>
            </div>
        </div>
        <div>
            <span>得分：</span>
            <span>{{list.total}}</span>
        </div>
        <div>
            <div
                @click.stop="menuClick(list.uid)"
            >
                <div></div>
            </div>
            <div
                class="options-menu"
                v-show="menuShow == list.uid"
            >
                <div
                    v-for="(opt, index) in menu.filter(m => m.show)"
                    :key="index"
                    @click="opt.todo(list.uid)"
                >{{opt.name}}</div>
            </div>
        </div>
    </div>
    <div
        class="empty-remind"
        v-if="!editable && data.length == 0"
    >尚無建立安衛評分紀錄</div>
    <div
        class="add-btn"
        v-if="editable"
        @click="newReportClick"
    >
        <div>+</div>
        <div>執行評分</div>
    </div>
</div>`

export default {
    name: 'sh-mana-compon',
    template,
    props: {
        uid: {
            type: Number,
            default: 0,
        },
        editable: {
            type: Boolean,
            default: true,
        },
        isproject: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            data: [],
            menu: [
                {
                    name: '下載',
                    todo: this.download,
                    show: true,
                },
                {
                    name: '刪除',
                    todo: this.deleteSH,
                    show: true,
                }
            ],
            menuShow: null,
        };
    },
    methods: {
        menuClick(uid) {
            this.menuShow = this.menuShow == uid ? null : uid;
        },
        listClick(uid) {
            this.$emit('childevent', 'shRecordClick', uid);
        },
        newReportClick() {
            this.$emit('childevent', 'newSHrecord', this.uid);
        },
        download(uid) {
            this.$emit('childevent', 'downloadSHrecord', uid);
        },
        deleteSH(uid) {
            this.$emit('childevent', 'deleteSHrecord', uid);
        },
        onPageWheel(e) {
            const sureCall = (value = 100) => {
                const el = this.$el;
                const scrollTop = el.scrollTop;
                const offsetHeight = el.offsetHeight;
                const scrollHeight = el.scrollHeight;

                let newVal = scrollTop + value;
                if (newVal < 0) newVal = 0;
                if (newVal > scrollHeight) newVal = offsetHeight;

                el.scrollTo({
                    top: newVal,
                    // behavior: 'smooth',
                });
            }
            this.$emit('wheel', e, sureCall);
        },
        async refresh() {
            let rsData = await callapi.getPaperSHList(this.uid);
            if (rsData) this.data = rsData;
            await this.$nextTick();
        },
    },
    created() {
        if(!this.editable) {
            this.menu[1].show = false;
        }
    }
}