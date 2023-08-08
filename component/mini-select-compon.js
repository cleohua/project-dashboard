var template = /*html*/ `
<div
    :style="minSelectStyle"
    class="mini-select-area"
    :class="[unitclass]"
    @click.stop
>
    <div
        v-if="withsearch"
        class="search-bar"
    >
        <i class="fa fa-search" aria-hidden="true"></i>
        <input
            type="text"
            v-model.trim="query"
            :placeholder="placeholder"
        >
    </div>
    <div
        class="scroll-style-gray-thin options-area"
        style="min-height: 40px;"
    >
        <div
            v-for="(item, index) in filterList"
            :key="item[label]"
            @click="itemClick(item)"
        >
            <div
                v-if="withIconForward"
                v-html="item.icon.forward.html"
                class="forward-icon"
                :class="item.icon.forward.class"
            ></div>
            <div
                class="option-text"
            >{{item[label]}}</div>
            <div
                v-if="withIconRear"
                v-html="item.icon.rear.html"
                class="rear-icon"
                :class="item.icon.rear.class"
            ></div>
        </div>
        <div
            class="empty-remind"
            v-if="!filterList.length"
        >{{emptyRemindText}}</div>
    </div>
</div>
`

export default {
    name: 'mini-select-compon',
    template,
    props: {
        unitclass: {
            type: String,
            default: '',
        },
        options: {
            type: Array,
            default: [],
        },
        withsearch: {
            type: Boolean,
            default: false,
        },
        minHeight: {
            type: String,
            default: '50px',
        },
        maxHeight: {
            type: String,
            default: '250px',
        },
        label: {
            type: String,
            default: 'text',
        },
        placeholder: {
            type: String,
            default: '輸入關鍵字搜尋'
        },
        reduce: {
            type: Function,
            default: (v) => v,
        },
        withIconForward: {
            type: Boolean,
            dafault: false,
        },
        withIconRear: {
            type: Boolean,
            dafault: false,
        }
    },
    data() {
        return {
            query: '',
        }
    },
    computed: {
        minSelectStyle() {
            return {
                'max-height': this.maxHeight,
                'min-height': this.minHeight,
            }
        },
        filterList() {
            if (this.query.length) {
                return this.options.filter(item => {
                    let text = item.text.toLowerCase();
                    let keys = this.query.toLowerCase().split(' ');
                    return !keys.map(k => text.includes(k)).includes(false);
                });
            } else {
                return this.options;
            }
        },
        emptyRemindText() {
            return this.query.length ? '無符合項目' : '無資料';
        }
    },
    methods: {
        itemClick(item) {
            let value = this.reduce(item);
            this.query = '';
            this.$emit('onselect', value);
        }
    }
}