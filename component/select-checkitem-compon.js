import floatDialog from "../../../vue/assets/float-dialog-slot-compon.js";
import miniSelectCompon from "./mini-select-compon.js";
import { mainTemplate, shListTemp, listTemp } from "../template/select-checkitem-temp.js";

// 檢查項目
var listCompon = {
    name: 'list-compon',
    template: listTemp,
    props: {
        data: {
            type: Object,
        },
        select: {
            type: Number,
        },
        level: {
            type: Number,
            default: 0,
        }
    },
    data() {
        return {
            // 二階層後預設縮折
            filpDown: this.level < 1,
        };
    },
    methods: {
        filpClick() {
            this.filpDown = !this.filpDown;
        },
        listClick() {
            let dataObj = {
                nameArr: [this.data.name],
                uidArr: [this.data.uid],
            }
            this.$emit('on-list-click', dataObj);
        },
        onListClick(dataObj) {
            dataObj.nameArr.push(this.data.name);
            dataObj.uidArr.push(this.data.uid);
            this.$emit('on-list-click', dataObj);
        },
    },
}
// 自檢表
var shListCompon = {
    name: 'sh-list-compon',
    template: shListTemp,
    props: {
        data: {
            type: Object,
        },
        select: {
            type: Number,
        },
    },
    computed: {
        childList() {
            return this.data.list.filter(l => l.show);
        }
    },
    methods: {
        listClick(list) {
            this.$emit('on-list-click', [list.name, list.uid]);
        },
    },
}

export default {
    name: 'select-checkitem-compon',
    template: mainTemplate,
    components: {
        'float-dialog': floatDialog,
        'list-compon': listCompon,
        'sh-list-compon': shListCompon,
        'mini-select': miniSelectCompon,
    },
    data() {
        return {
            // dialog
            elementID: 'select-checkitem-page',
            titleText: '選擇檢查項目',
            bottomShow: true,
            showCloseBtn: false,
            loading: true,
            // content
            placeholderText: '搜尋',
            formType: [
                {
                    name: '安衛督導表單',
                    compon: 'sh-list-compon',
                    index: 0,
                },
                {
                    name: '品質督導表單',
                    compon: 'list-compon',
                    index: 1,
                },
                {
                    name: '技師督導表單',
                    compon: 'list-compon',
                    index: 2,
                }
            ],
            listCompon: 'sh-list-compon',
            groupList: [],
            listData: [],
            miniSelectShow: null,
            searchText: '',
            // 表單
            currentForm: 0,
            // 類組
            // 一般: {text, uid}, sh: {text, keyIndex}
            currentGroup: null,
            // 當前勾選
            currentSelect: 0,
            // 當前名稱
            currentName: '',
            // 帶有父子層的select
            selectGroup: [],
            // 
            sureCall: () => { },
            cancelCall: () => { },
            getData: {},
            isReady: false,
            // mounted
            mounted: false,
        };
    },
    computed: {
        formText() {
            return this.formType[this.currentForm].name;
        },
        groupText() {
            return this.currentGroup ? this.currentGroup.text : '無資料';
        },
    },
    watch: {
        async currentForm(newVal) {
            if (!this.isReady) return;
            this.loading = true;
            this.listData = [];
            this.listCompon = this.formType[newVal].compon;
            this.groupList = await this.getData.getCheckListGroup(newVal);
            this.currentGroup = this.groupList.length ? this.groupList[0] : null;
            this.currentSelect = 0;
        },
        async currentGroup(newVal, oldVal) {
            if (!this.isReady) return;
            if (newVal) {
                this.loading = true;
                if (this.currentForm) {
                    // 品質、技師
                    let uid = newVal.uid;
                    this.listData = await this.getData.getCheckListContent(
                        this.currentForm,
                        uid
                    );
                    this.currentSelect = 0;
                    await this.$nextTick();
                } else {
                    // 安衛
                    let index = newVal.keyIndex;
                    if (!this.listData.length) {
                        this.listData = await this.getData.getCheckListContent(this.currentForm);
                    }

                    this.listData.forEach(type => {
                        if (index == type.keyIndex || index == 0) {
                            type.show = true;
                            this.shKeySearchFilter(type, this.searchText);
                        } else {
                            type.show = false;
                        }
                    });
                }
            }
            await this.$nextTick();
            this.loading = false;
        },
        // debounce
        searchText(newVal) {
            this.search(newVal);
        },
    },
    methods: {
        search: _.debounce(function (string) {
            string = string.toLowerCase();
            if (this.currentForm) {
                // 品質、技師
                const isShow = (l) => {
                    let match = l.name.toLowerCase().includes(string);
                    let childMatch = false;
                    l.child.forEach(l => {
                        let match = isShow(l);
                        l.show = match;
                        if (match) childMatch = true;
                    });
                    return match || childMatch;
                };
                this.listData.forEach(l => l.show = isShow(l));
            } else {
                // 安衛
                this.listData.forEach(type => {
                    if (type.show) this.shKeySearchFilter(type, string);
                });
            }
        }, 200),
        showSelect(type) {
            this.miniSelectShow = type == this.miniSelectShow ? null : type;
        },
        formSelect(index) {
            this.currentForm = index;
            this.miniSelectShow = null;
        },
        groupSelect(select) {
            this.currentGroup = select;
            this.miniSelectShow = null;
        },
        listClick(dataObj) {
            const { nameArr, uidArr } = dataObj;

            if (this.currentSelect == uidArr[0]) {
                this.currentSelect = 0;
                this.selectGroup = [];
                this.currentName = '';
            } else {
                this.currentSelect = uidArr[0];
                this.selectGroup = uidArr;
                this.currentName = nameArr.reverse().join(',');
            }
        },
        shListClick([name, uid]) {
            let same = this.currentSelect == uid;
            this.currentSelect = same ? 0 : uid;
            this.selectGroup = same ? [] : [uid];
            this.currentName = same ? '' : name;
        },
        shKeySearchFilter(oneType, string) {
            oneType.list.forEach(l => {
                let match = true;
                if (string.length) match = l.name.toLowerCase().includes(string);
                l.show = match ? true : false;
            });
        },
        output() {
            let output = _.cloneDeep({
                currentForm: this.currentForm,
                currentGroup: this.currentGroup,
                currentSelect: this.currentSelect,
                selectGroup: this.selectGroup,
                currentName: this.currentName,
            });

            return output;
        },
        // saveToStorage(outPutData) {
        //     let storage = JSON.stringify({
        //         currentForm: outPutData.currentForm,
        //         currentGroup: outPutData.currentGroup
        //     });
        //     localStorage.setItem('safty-inspect-select-checkitem', storage);
        // },
        nextBtnClick() {
            if (this.currentSelect) {
                let outPutData = this.output();
                // this.saveToStorage(outPutData);
                this.sureCall?.(outPutData);
                this.$refs.dialog.onDialogClose();
            } else {
                floatMsgRemind('請選擇檢查項目');
            }
        },
        async setDefaultValue() {
            let uid = this.currentSelect;
            this.currentSelect = 0;
            await this.$nextTick();
            let elm = document.querySelector(`.one-list [listid="${uid}"]`);
            if (elm) elm.click();
        },
        async init(selectData) {
            // let storage = localStorage.getItem('safty-inspect-select-checkitem');
            // const fromData = selectData ?? JSON.parse(storage);
            // 帶入既有
            if (selectData) {
                for (let key in selectData) {
                    this[key] = selectData[key];
                }
            }
            // 表單對應component
            this.listCompon = this.formType[this.currentForm].compon;
            // 類組清單
            this.groupList = this.getData.getCheckListGroup(this.currentForm);
            if (this.groupList.length) {
                if (!this.currentGroup) this.currentGroup = this.groupList[0];
                this.listData = await this.getData.getCheckListContent(this.currentForm, this.currentGroup.uid);

                // 安衛篩選
                if (this.currentForm == 0) {
                    let index = this.currentGroup.keyIndex;
                    this.listData.forEach(type => {
                        if (index == type.keyIndex || index == 0) {
                            type.show = true;
                            this.shKeySearchFilter(type, this.searchText);
                        } else {
                            type.show = false;
                        }
                    });
                }
                // 非安衛
                // render後才能打勾
                if (this.currentForm && this.currentSelect) {
                    const run = () => setTimeout(() => {
                        if (this.mounted) {
                            this.setDefaultValue();
                        } else {
                            run();
                        }
                    }, 500);
                    run();
                }
            }
            this.isReady = true;
            this.loading = false;
        }
    },
    mounted() {
        this.mounted = true;
    }
}