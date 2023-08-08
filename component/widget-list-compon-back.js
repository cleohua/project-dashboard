import * as callapi from "../callAPI.js";

const colElmTemp = /*html*/ `
<div
    class="one-column"
>
    <div
        :class="'level' + level"
        @click="colClick(data.col_id)"
    >{{data.name}}</div>
    <div
        v-if="data.children"
        class="sub-column"
    >
        <col-elm-compon
            v-for="colId in data.children"
            :key="colId"
            :data="columnData[colId] || {}"
            :level="level + 1"
        ></col-elm-compon>
    </div>
</div>
`

const colElmCompon = {
    name: 'colElmCompon',
    template: colElmTemp,
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        level: {
            type: Number,
            default: 0,
        },
        minWidth: {
            type: Number,
            default: 100,
        },
        fitContent: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {

        }
    },
    computed: {
        colStyle: {

        },
    },
    methods: {

    }
}

const cellElmTemp = /*html*/ `
<div
    class="one-cell"
>
    <span
        v-for="(val, index) in data"
        :key="index"
        @click="cellClick"
        :colInfo="colInfo"
        :style="cellStyle"
    >{{val}}</span>
</div>
`

const cellElmCompon = {
    name: 'cellElmComon',
    template: cellElmTemp,
    props: {
        data: {
            type: Array,
            default: []
        },
        type: {
            type: String,
            default: 'text',
        },
        colOptions: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {

        }
    },
    methods: {

    },
}

const template = /*html*/ `
<div
    class="widget-list-style"
    :class="{'loading': loading }"
>
    <div
        class="widget-list-header"
    >
        <col-elm-compon 
            v-for="column in columnList"
            :key="column.id"
            :data="column"
            :column-data="columnData"
            :level="0"
        ></col-elm-compon>
    </div>
    <div
        class="widget-list-content"
    >
        <cell-elm-compon
            v-for="(lineData, index) in currentData"
            :key="index"
            :data="lineData"
        ></cell-elm-compon>
    </div>
</div>
`

export default {
    name: 'widget-list-compon',
    template,
    components: {
        'col-elm-compon': colElmCompon,
        'cell-elm-compon': cellElmCompon,
    },
    props: {
        widgetData: {
            type: Object,
            default: () => { }
        },
        columnData: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            loading: false,
            // columnData: [],
            data: [],
            // 分頁
            page: 0,
            partition: 10,
        }
    },
    computed: {
        // 分頁
        count() {
            return this.data.length;
        },
        currentData() {
            if (this.count) {
                const start = this.page == 0 ? 0 : this.page * this.partition;
                const end = start + this.partition + 1;
                return this.data.slice(start, end);
            } else {
                return [];
            }
        },
        columnList() {
            return this.widgetData.columns.map(id => columnData[id] || {});
        }
    },
    methods: {
        async getData() {
            const { api, params, post = false } = this.widgetData.get;
            const sendData = params.reduce((obj, key) => {
                switch (key) {
                    case 'user_id':
                    case 'sys_code_id':
                        break;
                    default:
                        console.warn('key not match: ', key);
                        break;
                };

                return obj;
            }, {});

            let rsData = await callapi.getWidgetData(api, sendData, post);
            return rsData;
        }
    }
}