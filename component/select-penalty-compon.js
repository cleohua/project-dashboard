import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import miniSelectCompon from "./mini-select-compon.js";
import { mainTemplate, listTemp } from "../template/select-penalty-temp.js";

var listCompon = {
    name: 'list-compon',
    template: listTemp,
    props: {
        data: {
            type: Object,
        },
        select: {
            type: Number,
        }
    },
    computed: {
        childList() {
            return this.data.list.filter(l => l.show);
        },
        fineText() {
            return (fine) => {
                if (fine) {
                    fine = fine.replace(/\D/g, '');
                    const regex = /\B(?=(?:\d{3})+(?!\d))/g;
                    fine = fine.replace(regex, ',');
                    return `罰鍰： ${fine} 元`;
                } else {
                    return '罰鍰：0 元';
                }
            }
        }
    },
    methods: {
        listClick(list) {
            this.$emit('onlistclick', list);
        },
    },
}

export default {
    name: 'select-penalty-compon',
    template: mainTemplate,
    components: {
        'float-dialog': floatDialog,
        'list-compon': listCompon,
        'mini-select': miniSelectCompon,
    },
    data() {
        return {
            // dialog
            elementID: 'select-penalty-page',
            titleText: '選擇罰則條款',
            bottomShow: true,
            showCloseBtn: false,
            loading: true,
            // content
            placeholderText: '搜尋',
            typeList: [],
            listData: [],
            searchText: '',
            currentType: null, // {text, keyIndex}
            currentSelect: null,
            miniSelectShow: false,
            sureCall: () => { },
        }
    },
    watch: {
        currentType(newVal) {
            this.listData = this.getData.getPenaltyContent();
            let index = newVal.keyIndex;
            this.listData.forEach(type => {
                if (index == type.keyIndex || index == 0) {
                    type.show = true;
                    this.keySearchFilter(type, this.searchText);
                } else {
                    type.show = false;
                }
            });
        },
        // debounce
        searchText(newVal) {
            this.search(newVal);
        },
    },
    computed: {
        typeText() {
            return this.currentType ? this.currentType.text : '無資料';
        },
        selectID() {
            return this.currentSelect?.uid;
        },
    },
    methods: {
        search: _.debounce(function (string) {
            string = string.toLowerCase();
            this.listData.forEach(type => {
                if (type.show) this.keySearchFilter(type, string);
            });
        }, 200),
        keySearchFilter(oneType, string) {
            oneType.list.forEach(l => {
                let match = true;
                if (string.length) match = l.name.toLowerCase().includes(string);
                l.show = match ? true : false;
            });
        },
        typeSelect(select) {
            this.currentType = select;
            this.miniSelectShow = false;
        },
        listClick(list) {
            this.currentSelect = this.currentSelect?.uid == list.uid ? null : list;
        },
        output() {
            let output = _.cloneDeep({
                currentType: this.currentType,
                currentSelect: this.currentSelect,
            });

            return output;
        },
        nextBtnClick() {
            if (this.currentSelect) {
                this.sureCall?.(this.output());
                this.$refs.dialog.onDialogClose();
            } else {
                floatMsgRemind('請選擇罰鍰條款');
            }
        },
    },
    async created() {
        if(this.currentType) {
            this.listData.forEach(type => {
                let keyIndex = this.currentType.keyIndex;
                if (keyIndex == type.keyIndex || keyIndex == 0) {
                    type.show = true;
                    this.keySearchFilter(type, this.searchText);
                } else {
                    type.show = false;
                }
            });
        }
        this.loading = false;
    },
}